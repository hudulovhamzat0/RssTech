# 🚀 RSStech - NEXUS FEED

<div align="center">

**A cyberpunk-inspired RSS reader that transforms news consumption into an immersive digital experience**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![RSS](https://img.shields.io/badge/RSS-2.0-FF6600?style=for-the-badge&logo=rss&logoColor=white)](https://www.rssboard.org/rss-specification)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[🎮 Live Demo](https://rsstech.onrender.com/) • [📚 Documentation](#documentation) • [🐛 Report Bug](https://github.com/hudulovhamzat0/rsstech/issues) • [✨ Request Feature](https://github.com/hudulovhamzat0/rsstech/issues)

</div>

---

## 🌟 What Makes RSStech Special?

RSStech isn't just another RSS reader—it's a **digital portal** that reimagines how we consume information. With its neon-soaked cyberpunk aesthetic and lightning-fast performance, it transforms mundane news browsing into an engaging visual journey.

### ⚡ Key Features

<table>
<tr>
<td width="50%">

**🎨 Cyberpunk UI/UX**
- Neon glow effects and animated elements
- Dual-theme support (Dark Nexus / Light Matrix)
- Smooth hover animations and transitions
- Futuristic typography with Orbitron font

**🔍 Smart Search System**
- Real-time search with highlighting
- Search across titles, content, and authors
- Intelligent result filtering
- Keyboard shortcuts (Ctrl+K, Escape, T)

</td>
<td width="50%">

**⚡ Performance Optimized**
- Lightning-fast article loading
- Intersection Observer for smooth scrolling
- Debounced search for optimal performance
- Lazy loading for images

**🛡️ Security First**
- XSS protection with input sanitization
- Regex injection prevention
- Secure error handling
- CORS-ready architecture

</td>
</tr>
</table>

---

## 🎯 Quick Start

Get your RSS feed running in under 2 minutes:

```bash
# Clone the repository
git clone https://github.com/hudulovhamzat0/rsstech.git

# Navigate to project directory
cd rsstech

# Install dependencies
npm install

# Launch the feed
npm start

# Open your browser to http://localhost:3000
```

**That's it!** 🎉 Your cyberpunk RSS reader is now live and ready to consume feeds.

---

## 🎮 Features Showcase

### 🌓 Dual Theme System
Switch between **Dark Nexus** (default) and **Light Matrix** themes with a single click. Each theme provides a completely different visual experience while maintaining perfect readability.

<div align="center">

<img src="ss.gif">

</div>

### 🔍 Intelligent Search
Real-time search across all article content with smart highlighting:

```
🔍 Search capabilities:
  ├── Title matching
  ├── Content searching  
  ├── Author filtering
  └── Live result counting
```

### 📱 Responsive Design
Perfect experience across all devices:
- **Desktop**: Full grid layout with hover effects
- **Tablet**: Optimized card arrangement
- **Mobile**: Single-column responsive design

---

## 🛠️ Technical Architecture

### Core Technologies
- **Backend**: Node.js + Express.js
- **RSS Parsing**: xml2js for robust XML handling
- **HTTP Client**: node-fetch with timeout controls
- **Frontend**: Vanilla JavaScript (no framework bloat!)
- **Styling**: Modern CSS with CSS Variables

### Performance Features
```javascript
// Smart debouncing for search
const debouncedSearch = debounce(performSearch, 150);

// Intersection Observer for animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) animateArticle(entry.target);
  });
});
```

---

## 🎨 Customization

### RSS Feed Sources
Easily change the RSS feed URL in `server.js`:

```javascript
const RSS_URL = "https://your-preferred-rss-feed.com/rss";
```

### Theme Customization
Modify CSS variables in the style section:

```css
:root {
  --neon-red: #ff0040;      /* Primary accent color */
  --neon-blue: #00d4ff;     /* Secondary accent color */
  --dark-bg: #0a0a0a;       /* Background color */
  --card-bg: #1a1a1a;       /* Card background */
}
```

### Animation Tweaks
Adjust animation speeds and effects:

```css
.article {
  transition: all 0.4s ease;  /* Hover animation speed */
}

@keyframes pulse {
  /* Customize the pulsing logo effect */
}
```

---

## 📊 Browser Compatibility

<table>
<tr>
<td align="center"><img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome"><br>Chrome 70+</td>
<td align="center"><img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox"><br>Firefox 65+</td>
<td align="center"><img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari"><br>Safari 12+</td>
<td align="center"><img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge"><br>Edge 79+</td>
</tr>
</table>

---

## 🚀 Deployment Options

### Heroku
```bash
heroku create your-rsstech-app
git push heroku main
```

### Vercel
```bash
vercel --prod
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional VPS
```bash
# Install Node.js 18+
# Clone repository
# Install PM2 for process management
npm install -g pm2
pm2 start server.js --name "rsstech"
```

---



---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🐛 Bug Reports
Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information

### ✨ Feature Requests
Have an idea? We'd love to hear it! Include:
- Detailed feature description
- Use case scenarios
- Mockups or sketches (if applicable)

### 💻 Code Contributions

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

---

## 📈 Roadmap

### Version 2.0 (Coming Soon)
- [ ] 🔌 Multi-RSS feed support
- [ ] 📊 Reading analytics dashboard  
- [ ] 🏷️ Article tagging system
- [ ] 📱 Progressive Web App (PWA)
- [ ] 🌐 Offline reading capability

---

## 🏆 Acknowledgments

Special thanks to:
- **Mashable** for providing the RSS feed
- **Google Fonts** for Orbitron and Rajdhani typography
- **The Open Source Community** for inspiration and feedback
- **Cyberpunk 2077** for visual inspiration 🌆

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Feel free to use this project for personal and commercial purposes.
Attribution is appreciated but not required.
```

---

## 💬 Connect & Support

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-hudulovhamzat0-181717?style=for-the-badge&logo=github)](https://github.com/hudulovhamzat0)

**⭐ Star this repo if you found it helpful!**

</div>

---

<div align="center">

**Built with ❤️ and lots of ☕**

*RSStech - Where information meets innovation*

</div>
