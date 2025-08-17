import express from "express";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

const app = express();
const PORT = process.env.PORT || 3000;
const RSS_URL = "https://mashable.com/feeds/rss/all";

// Add middleware for better error handling and logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", async (req, res) => {
  try {
    // Add timeout and headers for better reliability
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(RSS_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'RSS-Reader/1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xml = await response.text();
    const result = await parseStringPromise(xml);
    
    // More robust data extraction
    const channel = result.rss?.channel?.[0];
    if (!channel) {
      throw new Error('Invalid RSS format');
    }

    const items = channel.item || [];
    const feedTitle = channel.title?.[0] || 'RSS Feed';
    const feedDescription = channel.description?.[0] || '';

    // Helper function to safely extract text content
    const extractText = (content) => {
      if (!content) return '';
      return content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    };

    // Helper function to format date
    const formatDate = (dateStr) => {
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return '';
      }
    };

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${feedTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
    
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0;
    }
    
    /* CSS Variables for Light/Dark themes */
    :root {
      --neon-red: #ff0040;
      --neon-red-glow: #ff0040;
      --neon-blue: #00d4ff;
      --dark-bg: #0a0a0a;
      --card-bg: #1a1a1a;
      --text-primary: #ffffff;
      --text-secondary: #cccccc;
      --text-muted: #888888;
      --border-color: #333333;
      --accent-color: var(--neon-red);
      --gradient-1: var(--neon-red);
      --gradient-2: #ff4070;
    }
    
    [data-theme="light"] {
      --dark-bg: #f5f5f5;
      --card-bg: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #333333;
      --text-muted: #666666;
      --border-color: #e0e0e0;
      --accent-color: var(--neon-blue);
      --gradient-1: var(--neon-blue);
      --gradient-2: #40a9ff;
      --neon-red-glow: var(--neon-blue);
    }
    
    body { 
      font-family: 'Rajdhani', sans-serif;
      background: var(--dark-bg);
      color: var(--text-primary);
      margin: 0; 
      padding: 20px; 
      min-height: 100vh;
      transition: all 0.4s ease;
      background-image: 
        radial-gradient(circle at 20% 20%, rgba(255, 0, 64, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 0, 64, 0.05) 0%, transparent 50%);
    }
    
    [data-theme="light"] body {
      background-image: 
        radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(0, 212, 255, 0.05) 0%, transparent 50%);
    }
    
    /* Loading Screen */
    .loading-screen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--dark-bg);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      transition: opacity 0.5s ease;
    }
    
    .loading-screen.hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    .loading-spinner {
      width: 80px;
      height: 80px;
      border: 3px solid var(--border-color);
      border-top: 3px solid var(--accent-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    
    .loading-text {
      font-family: 'Orbitron', monospace;
      font-size: 1.5em;
      color: var(--accent-color);
      text-align: center;
      margin-bottom: 10px;
    }
    
    .loading-progress {
      color: var(--text-muted);
      font-size: 1em;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    
    .container.loaded {
      opacity: 1;
    }
    
    .header {
      background: linear-gradient(135deg, var(--card-bg) 0%, rgba(255, 0, 64, 0.1) 100%);
      padding: 40px;
      border-radius: 20px;
      border: 1px solid var(--border-color);
      box-shadow: 
        0 0 50px rgba(255, 0, 64, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      margin-bottom: 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: all 0.4s ease;
    }
    
    [data-theme="light"] .header {
      background: linear-gradient(135deg, var(--card-bg) 0%, rgba(0, 212, 255, 0.1) 100%);
      box-shadow: 
        0 0 50px rgba(0, 212, 255, 0.2),
        inset 0 1px 0 rgba(0, 0, 0, 0.1);
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
      animation: scan 2s infinite;
    }
    
    @keyframes scan {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .header-controls {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 10px;
    }
    
    .theme-toggle {
      background: var(--card-bg);
      border: 2px solid var(--border-color);
      color: var(--text-primary);
      padding: 10px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1.2em;
      transition: all 0.3s ease;
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .theme-toggle:hover {
      border-color: var(--accent-color);
      box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
      transform: scale(1.1);
    }
    
    [data-theme="light"] .theme-toggle:hover {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
    }
    
    .header h1 {
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      margin: 0 0 15px 0;
      color: var(--text-primary);
      font-size: 3em;
      text-shadow: 
        0 0 10px var(--accent-color),
        0 0 20px var(--accent-color),
        0 0 40px var(--accent-color);
      animation: pulse 2s infinite;
      transition: all 0.4s ease;
    }
    
    @keyframes pulse {
      0%, 100% { 
        text-shadow: 
          0 0 10px var(--accent-color),
          0 0 20px var(--accent-color),
          0 0 40px var(--accent-color);
      }
      50% { 
        text-shadow: 
          0 0 5px var(--accent-color),
          0 0 10px var(--accent-color),
          0 0 20px var(--accent-color);
      }
    }
    
    .header p {
      color: var(--text-secondary);
      font-size: 1.2em;
      margin: 0 0 20px 0;
      font-weight: 300;
    }
    
    .search-container {
      margin: 30px 0;
      position: relative;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .search-box {
      width: 100%;
      padding: 20px 60px 20px 25px;
      font-size: 1.1em;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 500;
      background: var(--card-bg);
      border: 2px solid var(--border-color);
      border-radius: 50px;
      color: var(--text-primary);
      outline: none;
      transition: all 0.3s ease;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.3);
    }
    
    [data-theme="light"] .search-box {
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .search-box:focus {
      border-color: var(--accent-color);
      box-shadow: 
        0 0 30px rgba(255, 0, 64, 0.5),
        inset 0 2px 10px rgba(0, 0, 0, 0.3);
      transform: scale(1.02);
    }
    
    [data-theme="light"] .search-box:focus {
      box-shadow: 
        0 0 30px rgba(0, 212, 255, 0.5),
        inset 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .search-box::placeholder {
      color: var(--text-muted);
      font-style: italic;
    }
    
    .search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--accent-color);
      font-size: 1.5em;
      pointer-events: none;
    }
    
    .search-stats {
      text-align: center;
      margin: 20px 0;
      color: var(--text-muted);
      font-weight: 300;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .search-stats.visible {
      opacity: 1;
    }
    
    .articles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
    }
    
    .article { 
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 0, 64, 0.1);
      transition: all 0.4s ease;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    
    [data-theme="light"] .article {
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(0, 212, 255, 0.1);
    }
    
    .article::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 49%, rgba(255, 0, 64, 0.1) 50%, transparent 51%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    [data-theme="light"] .article::before {
      background: linear-gradient(45deg, transparent 49%, rgba(0, 212, 255, 0.1) 50%, transparent 51%);
    }
    
    .article:hover {
      transform: translateY(-10px) scale(1.02);
      border-color: var(--accent-color);
      box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.8),
        0 0 50px rgba(255, 0, 64, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    [data-theme="light"] .article:hover {
      box-shadow: 
        0 20px 50px rgba(0, 0, 0, 0.2),
        0 0 50px rgba(0, 212, 255, 0.3),
        inset 0 1px 0 rgba(0, 0, 0, 0.1);
    }
    
    .article:hover::before {
      opacity: 1;
    }
    
    .article.hidden {
      display: none;
    }
    
    .article img { 
      width: 100%; 
      height: 220px;
      object-fit: cover;
      transition: all 0.4s ease;
      filter: brightness(0.8) contrast(1.1);
    }
    
    [data-theme="light"] .article img {
      filter: brightness(0.9) contrast(1.05);
    }
    
    .article:hover img {
      transform: scale(1.1);
      filter: brightness(1) contrast(1.2);
    }
    
    .article-content {
      padding: 25px;
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    
    .article h2 { 
      margin: 0 0 20px 0; 
      font-size: 1.4em;
      color: var(--text-primary);
      line-height: 1.4;
      flex: 1;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      transition: color 0.4s ease;
    }
    
    [data-theme="light"] .article h2 {
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .article p { 
      color: var(--text-secondary); 
      line-height: 1.6;
      margin: 0 0 20px 0;
      flex: 1;
      font-weight: 400;
    }
    
    .article-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      font-size: 0.9em;
      color: var(--text-muted);
      font-weight: 300;
    }
    
    .author {
      color: var(--accent-color);
      font-weight: 500;
    }
    
    .article a { 
      display: inline-block;
      padding: 15px 30px;
      background: linear-gradient(45deg, var(--gradient-1), var(--gradient-2));
      color: white;
      text-decoration: none;
      border-radius: 50px;
      transition: all 0.3s ease;
      text-align: center;
      font-weight: 600;
      font-size: 1em;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 
        0 5px 20px rgba(255, 0, 64, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    [data-theme="light"] .article a {
      box-shadow: 
        0 5px 20px rgba(0, 212, 255, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    .article a:hover { 
      background: linear-gradient(45deg, var(--gradient-2), var(--gradient-1));
      transform: translateY(-3px);
      box-shadow: 
        0 10px 30px rgba(255, 0, 64, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    [data-theme="light"] .article a:hover {
      box-shadow: 
        0 10px 30px rgba(0, 212, 255, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    .no-results {
      text-align: center;
      padding: 80px 20px;
      color: var(--text-muted);
      display: none;
    }
    
    .no-results.visible {
      display: block;
    }
    
    .no-results h3 {
      font-family: 'Orbitron', monospace;
      font-size: 2em;
      margin-bottom: 20px;
      color: var(--accent-color);
    }
    
    @media (max-width: 768px) {
      .articles-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .header h1 {
        font-size: 2.2em;
      }
      .search-container {
        margin: 20px 0;
      }
      .search-box {
        padding: 18px 55px 18px 20px;
        font-size: 1em;
      }
      .header-controls {
        position: relative;
        top: auto;
        right: auto;
        justify-content: center;
        margin-bottom: 20px;
      }
    }
    
    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 10px;
    }
    
    ::-webkit-scrollbar-track {
      background: var(--dark-bg);
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--accent-color);
      border-radius: 5px;
      box-shadow: 0 0 10px var(--accent-color);
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: var(--gradient-2);
    }
  </style>
</head>
<body>
  <!-- Loading Screen -->
  <div class="loading-screen" id="loadingScreen">
    <div class="loading-spinner"></div>
    <div class="loading-text">NEXUS FEED</div>
    <div class="loading-progress">Fetching articles...</div>
  </div>

  <div class="container" id="mainContainer">
    <div class="header">
      <div class="header-controls">
        <button class="theme-toggle" id="themeToggle" title="Toggle Dark/Light Mode">
          🌓
        </button>
      </div>
      <h1>NEXUS FEED</h1>
      <p>Rss scraper from Mashable by Hudulov Hamzat</p>
      <div class="search-container">
        <input type="text" class="search-box" id="searchBox" placeholder="🔍 Search articles... (title, content, author)">
        <div class="search-icon">⚡</div>
      </div>
      <div class="search-stats" id="searchStats"></div>
      <small style="opacity: 0.6;">Last updated: ${new Date().toLocaleString()}</small>
    </div>
    
    <div class="no-results" id="noResults">
      <h3>NO MATCHES FOUND</h3>
      <p>Try adjusting your search terms or browse all articles below.</p>
    </div>
    
    <div class="articles-grid" id="articlesGrid">`;

    items.slice(0, 100).forEach((item, index) => {
      const title = item.title?.[0] || "No title available";
      const link = item.link?.[0] || "#";
      const description = extractText(item.description?.[0] || "");
      const pubDate = formatDate(item.pubDate?.[0]);
      const author = item["dc:creator"]?.[0] || 'Mashable';

      // Enhanced image extraction
      let imgTag = "";
      let imgSrc = "";
      
      // Try multiple sources for images
      if (item["media:content"] && item["media:content"][0]?.$.url) {
        imgSrc = item["media:content"][0].$.url;
      } else if (item["content:encoded"]) {
        const match = item["content:encoded"][0].match(/<img[^>]+src="([^">]+)"/);
        if (match) imgSrc = match[1];
      }
      
      if (imgSrc) {
        imgTag = `<img src="${imgSrc}" alt="${title.replace(/"/g, '&quot;')}" loading="lazy" onerror="this.style.display='none'">`;
      }

      html += `
      <article class="article" data-title="${title.toLowerCase().replace(/"/g, '&quot;')}" data-description="${description.toLowerCase().replace(/"/g, '&quot;')}" data-author="${author.toLowerCase().replace(/"/g, '&quot;')}">
        ${imgTag}
        <div class="article-content">
          <div class="article-meta">
            <span class="author">${author}</span>
            <span>${pubDate}</span>
          </div>
          <h2>${title}</h2>
          <p>${description}</p>
          <a href="${link}" target="_blank" rel="noopener noreferrer">Access Article</a>
        </div>
      </article>`;
    });

    html += `
    </div>
  </div>
  
<script>
  // -----------------------------
  // Theme Management with fallback
  // -----------------------------
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Fallback for localStorage
  let savedTheme = 'dark';
  try {
    savedTheme = localStorage.getItem('nexus-theme') || 'dark';
  } catch (e) {
    console.warn('localStorage not available, using default theme');
  }

  body.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀️';

  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    
    try {
      localStorage.setItem('nexus-theme', newTheme);
    } catch (e) {
      console.warn('Could not save theme preference');
    }

    body.style.transition = 'all 0.4s ease';
    setTimeout(() => body.style.transition = '', 400);
  });

  // -----------------------------
  // Loading Progress Simulation
  // -----------------------------
  const loadingText = document.querySelector('.loading-progress');
  let loadingProgress = 0;
  const loadingInterval = setInterval(() => {
    loadingProgress += Math.random() * 15;
    if (loadingProgress >= 100) {
      loadingProgress = 100;
      clearInterval(loadingInterval);
    }
    loadingText.textContent = \`Loading \${Math.floor(loadingProgress)}% complete...\`;
  }, 100);

  // -----------------------------
  // Debounce Utility
  // -----------------------------
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // -----------------------------
  // Scroll Background Parallax
  // -----------------------------
  const handleScroll = debounce(() => {
    const scrolled = window.pageYOffset;
    document.body.style.backgroundPosition = \`0 \${scrolled * -0.5}px\`;
  }, 10);
  window.addEventListener('scroll', handleScroll);

  // -----------------------------
  // DOMContentLoaded
  // -----------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('searchBox');
    const searchStats = document.getElementById('searchStats');
    const noResults = document.getElementById('noResults');
    const articlesGrid = document.getElementById('articlesGrid');
    const articles = document.querySelectorAll('.article');

    // -----------------------------
    // Search Functionality
    // -----------------------------
    let searchTimeout;
    searchBox.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => performSearch(), 150);
    });

    function performSearch() {
      const term = searchBox.value.toLowerCase().trim();
      let visibleCount = 0;

      articles.forEach(article => {
        const title = (article.dataset.title || '').toLowerCase();
        const desc = (article.dataset.description || '').toLowerCase();
        const author = (article.dataset.author || '').toLowerCase();

        const match = !term || title.includes(term) || desc.includes(term) || author.includes(term);

        if (match) {
          article.classList.remove('hidden');
          visibleCount++;
          if (term) {
            highlightText(article, term);
          } else {
            clearHighlight(article);
          }
        } else {
          article.classList.add('hidden');
        }
      });

      // Update stats
      if (term) {
        searchStats.textContent = \`Found \${visibleCount} article\${visibleCount !== 1 ? 's' : ''} matching "\${searchBox.value}"\`;
      } else {
        searchStats.textContent = \`Showing all \${articles.length} articles\`;
      }

      searchStats.classList.add('visible');
      articlesGrid.style.display = visibleCount === 0 && term ? 'none' : 'grid';
      noResults.classList.toggle('visible', visibleCount === 0 && term);
    }

    function highlightText(article, term) {
      const title = article.querySelector('h2');
      const desc = article.querySelector('p');
      [title, desc].forEach(el => {
        if (!el) return;
        if (!el.dataset.originalText) el.dataset.originalText = el.textContent;
        const regex = new RegExp('(' + term.replace(/[.*+?^$}{()|[\]\\]/g, '\\$&') + ')', 'gi');
        const color = body.getAttribute('data-theme') === 'light' ? '#00d4ff' : '#ff0040';
        el.innerHTML = el.dataset.originalText.replace(regex, \`<span style="background:\${color}33;color:\${color};padding:2px 4px;border-radius:3px;font-weight:600;">$1</span>\`);
      });
    }

    function clearHighlight(article) {
      const title = article.querySelector('h2');
      const desc = article.querySelector('p');
      [title, desc].forEach(el => {
        if (el && el.dataset.originalText) {
          el.innerHTML = el.dataset.originalText;
        }
      });
    }

    searchStats.textContent = \`Showing all \${articles.length} articles\`;

    // -----------------------------
    // Article Animations
    // -----------------------------
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { root: null, rootMargin: '50px', threshold: 0.1 });

    articles.forEach((article, i) => {
      article.style.opacity = '0';
      article.style.transform = 'translateY(50px)';
      setTimeout(() => {
        article.style.transition = 'all 0.6s ease';
        article.style.opacity = '1';
        article.style.transform = 'translateY(0)';
      }, i * 50);
      observer.observe(article);
    });

    // -----------------------------
    // Hover and Search Icon Effects
    // -----------------------------
    articles.forEach(article => {
      article.addEventListener('mouseenter', () => {
        article.style.filter = 'brightness(1.05)';
      });
      article.addEventListener('mouseleave', () => {
        article.style.filter = 'brightness(1)';
      });
    });

    const searchIcon = document.querySelector('.search-icon');
    let typingTimer;
    searchBox.addEventListener('input', () => {
      if (searchIcon) {
        searchIcon.style.animation = 'pulse 0.5s ease';
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          searchIcon.style.animation = '';
        }, 500);
      }
    });

    // -----------------------------
    // Search Box Focus Effects
    // -----------------------------
    searchBox.addEventListener('focus', () => {
      if (searchBox.parentElement) {
        searchBox.parentElement.style.transform = 'scale(1.05)';
      }
    });
    
    searchBox.addEventListener('blur', () => {
      if (searchBox.parentElement) {
        searchBox.parentElement.style.transform = 'scale(1)';
      }
    });

    // -----------------------------
    // Keyboard Shortcuts
    // -----------------------------
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchBox.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchBox) {
        searchBox.value = '';
        performSearch();
        searchBox.blur();
      }
      if (e.key.toLowerCase() === 't' && !searchBox.contains(document.activeElement)) {
        themeToggle.click();
      }
    });

    // Initialize search stats
    performSearch();
  });

  // -----------------------------
  // Window Load – Hide Loading Screen
  // -----------------------------
  window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContainer = document.getElementById('mainContainer');
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      mainContainer.classList.add('loaded');
    }, 1000);
  });
</script>
</body>
</html>`;

    // Send response
    res.send(html);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).send(`
      <html>
        <head>
          <title>RSS Feed Error</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: #1a1a1a; 
              color: #fff; 
              padding: 50px; 
              text-align: center; 
            }
            h1 { color: #ff0040; }
            p { margin: 20px 0; }
            .error-code { 
              background: #333; 
              padding: 20px; 
              border-radius: 10px; 
              margin: 20px 0; 
              font-family: monospace; 
            }
          </style>
        </head>
        <body>
          <h1>RSS Feed Error</h1>
          <p>Unable to fetch the RSS feed. This could be due to:</p>
          <ul>
            <li>Network connectivity issues</li>
            <li>RSS feed server being down</li>
            <li>CORS restrictions</li>
            <li>Invalid RSS format</li>
          </ul>
          <div class="error-code">
            Error: ${error.message}
          </div>
          <p>Please try refreshing the page or check back later.</p>
        </body>
      </html>
    `);
  }
});

// Add error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NEXUS FEED server running on port ${PORT}`);
  console.log(`📡 Access at: http://localhost:${PORT}`);
});