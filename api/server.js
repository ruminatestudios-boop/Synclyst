'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Keys only from env — never logged or sent to client
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY || '';

// Optional: restrict which origins can call the API (e.g. https://yourdomain.com)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '';

const corsOptions = ALLOWED_ORIGIN
  ? { origin: ALLOWED_ORIGIN.split(',').map(s => s.trim()) }
  : { origin: true }; // allow same-origin and common dev origins

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Serve static site from parent directory (index.html, etc.)
app.use(express.static(path.join(__dirname, '..')));

// ——— Proxy: Vision API (OCR) ———
app.post('/api/vision/annotate', async (req, res) => {
  if (!GOOGLE_VISION_API_KEY) {
    return res.status(503).json({ error: { message: 'Vision API not configured. Set GOOGLE_VISION_API_KEY in api/.env' } });
  }
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${encodeURIComponent(GOOGLE_VISION_API_KEY)}`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: { message: 'Vision API request failed' } });
  }
});

// ——— Proxy: Gemini API (doc classification) ———
app.post('/api/gemini/generate', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(503).json({ error: { message: 'Gemini API not configured. Set GEMINI_API_KEY in api/.env' } });
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: { message: 'Gemini API request failed' } });
  }
});

// Health check (no secrets)
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    vision: !!GOOGLE_VISION_API_KEY,
    gemini: !!GEMINI_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`SyncLyst API running at http://localhost:${PORT}`);
  console.log(`  Static site: http://localhost:${PORT}/`);
  if (!GEMINI_API_KEY) console.warn('  GEMINI_API_KEY not set — doc classification will be fallback-only');
  if (!GOOGLE_VISION_API_KEY) console.warn('  GOOGLE_VISION_API_KEY not set — OCR will use client-side Tesseract');
});
