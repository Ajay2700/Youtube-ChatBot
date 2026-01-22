# 📝 How to Update Deployment Links in README

## 🎯 Quick Steps

1. **Open `README.md`**
2. **Find the badges section at the top**
3. **Replace placeholder URLs with your actual URLs:**

### Replace These:
- `https://your-app-name.netlify.app` → Your actual Netlify URL
- `https://your-backend.onrender.com` → Your actual Render backend URL

---

## 📋 Example

### Before:
```markdown
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://your-app-name.netlify.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Backend-46E3B7?style=for-the-badge&logo=fastapi&logoColor=white)](https://your-backend.onrender.com/docs)
```

### After (with your actual URLs):
```markdown
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://youtube-chatbots.netlify.app)
[![API Docs](https://img.shields.io/badge/API%20Docs-Backend-46E3B7?style=for-the-badge&logo=fastapi&logoColor=white)](https://youtube-chatbot-e7ub.onrender.com/docs)
```

---

## 🔍 Where to Find Your URLs

### Netlify Frontend URL:
1. Go to: https://app.netlify.com
2. Click your site
3. Copy the URL from the top (e.g., `https://youtube-chatbots.netlify.app`)

### Render Backend URL:
1. Go to: https://dashboard.render.com
2. Click your backend service
3. Copy the URL from the top (e.g., `https://youtube-chatbot-e7ub.onrender.com`)

---

## ✅ After Updating

1. **Commit the changes:**
   ```powershell
   git add README.md
   git commit -m "Update deployment links with actual URLs"
   git push origin main
   ```

2. **The badges will now link to your live application!**

---

## 🎨 Badge Customization

You can customize the badges by:
- Changing colors in the badge URLs
- Adding more badges (GitHub stars, license, etc.)
- Modifying the text

**Badge Generator:** https://shields.io/

---

**That's it! Your README will now show your live deployment links! 🎉**
