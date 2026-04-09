"""
Simple per-user token quota for chat requests.

- User identity: X-User-Id header (preferred) or client IP fallback.
- Storage: SQLite (persists across process restarts if disk persists).
- Counting: estimated tokens using tiktoken on (question + answer).
"""

from __future__ import annotations

import json
import os
import sqlite3
import threading
import time
from dataclasses import dataclass
from typing import Optional, Dict

import tiktoken


def _utc_day_key(ts: Optional[float] = None) -> str:
    ts = ts if ts is not None else time.time()
    return time.strftime("%Y-%m-%d", time.gmtime(ts))


@dataclass(frozen=True)
class QuotaDecision:
    allowed: bool
    limit: int
    used: int
    remaining: int


class TokenQuotaStore:
    def __init__(self, db_path: str):
        self._db_path = db_path
        self._lock = threading.Lock()
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._db_path, check_same_thread=False)
        conn.execute("PRAGMA journal_mode=WAL;")
        return conn

    def _init_db(self) -> None:
        os.makedirs(os.path.dirname(self._db_path), exist_ok=True)
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS token_usage (
                  user_key TEXT NOT NULL,
                  day_key TEXT NOT NULL,
                  tokens_used INTEGER NOT NULL DEFAULT 0,
                  updated_at INTEGER NOT NULL,
                  PRIMARY KEY (user_key, day_key)
                )
                """
            )
            conn.commit()

    def get_used(self, user_key: str, day_key: Optional[str]) -> int:
        day_key = day_key or _utc_day_key()
        with self._lock, self._connect() as conn:
            cur = conn.execute(
                "SELECT tokens_used FROM token_usage WHERE user_key = ? AND day_key = ?",
                (user_key, day_key),
            )
            row = cur.fetchone()
            return int(row[0]) if row else 0

    def add_tokens(self, user_key: str, day_key: Optional[str], tokens: int) -> int:
        day_key = day_key or _utc_day_key()
        now = int(time.time())
        with self._lock, self._connect() as conn:
            conn.execute(
                """
                INSERT INTO token_usage (user_key, day_key, tokens_used, updated_at)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(user_key, day_key)
                DO UPDATE SET tokens_used = tokens_used + excluded.tokens_used, updated_at = excluded.updated_at
                """,
                (user_key, day_key, int(tokens), now),
            )
            conn.commit()
            return self.get_used(user_key, day_key)


class TokenCounter:
    def __init__(self, model_name: str):
        # tiktoken supports many OpenAI models; fall back to cl100k_base
        try:
            self._enc = tiktoken.encoding_for_model(model_name)
        except Exception:
            self._enc = tiktoken.get_encoding("cl100k_base")

    def count(self, text: str) -> int:
        if not text:
            return 0
        return len(self._enc.encode(text))


def parse_user_limits_json(raw: str) -> Dict[str, int]:
    if not raw:
        return {}
    try:
        data = json.loads(raw)
        if isinstance(data, dict):
            out: Dict[str, int] = {}
            for k, v in data.items():
                try:
                    out[str(k)] = int(v)
                except Exception:
                    continue
            return out
    except Exception:
        pass
    return {}


def resolve_user_key(header_user_id: Optional[str], client_ip: Optional[str]) -> str:
    if header_user_id and header_user_id.strip():
        return f"uid:{header_user_id.strip()}"
    if client_ip and client_ip.strip():
        return f"ip:{client_ip.strip()}"
    return "ip:unknown"


def check_quota(
    store: TokenQuotaStore,
    user_key: str,
    limit: int,
    day_key: Optional[str] = None,
) -> QuotaDecision:
    dk = day_key or _utc_day_key()
    used = store.get_used(user_key, dk)
    remaining = max(0, int(limit) - int(used))
    return QuotaDecision(allowed=used < limit, limit=int(limit), used=int(used), remaining=int(remaining))

