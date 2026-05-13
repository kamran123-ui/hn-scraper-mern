const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { scrapeHackerNews } = require('./scraper/scraper');

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
// FIXED: Sabhi origins allow kar diye deployment ke liye, ya CLIENT_URL use karein
app.use(cors({ 
  origin: true, // Sabhi sources allow honge, CORS issue khatam
  credentials: true 
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/scrape',  require('./routes/scrape'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 & Error Handlers ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, _req, res, _next) => {
  console.error(`[ERROR] ${err.message}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
});

// ─── Database & Server Bootstrap ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // FIXED: Pehle server start karo taaki Render ko "Port" mil jaye
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      
      // Server start hone ke baad background mein scraping chalao
      console.log('🔄 Running initial scrape in background...');
      scrapeHackerNews()
        .then(() => console.log('✅ Initial scrape complete'))
        .catch(err => console.error('❌ Background scrape failed:', err.message));
    });

  } catch (err) {
    console.error('❌ Bootstrap failed:', err.message);
    process.exit(1);
  }
};

bootstrap();

