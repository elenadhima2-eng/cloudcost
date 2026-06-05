process.env.GOOGLE_APPLICATION_CREDENTIALS = "./diploma-497914-328fde35098e.json";

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
require('dotenv').config();
 
const app = express();
 
// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin:     ['http://localhost:3000', 'http://localhost'],
  credentials: true,
  methods:     ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));
 
// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/startup', require('./routes/startup'));
app.use('/api/backup',  require('./routes/backup'));
app.use('/api/ai',      require('./routes/ai'));
 
// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status:'ok', time: new Date() }));
 
// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB u lidh'))
  .catch(err => console.error('❌ MongoDB gabim:', err.message));
 
// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server po ekzekutohet në port ${PORT}`));