// Proxy to SyncLyst backend extraction. Set AURALINK_BACKEND_URL in Vercel to your deployed backend (e.g. https://your-app.railway.app).
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ detail: 'Method not allowed' });

  const base = (process.env.AURALINK_BACKEND_URL || '').trim().replace(/\/$/, '');
  if (!base) {
    return res.status(503).json({
      detail: 'Extraction not configured. Set AURALINK_BACKEND_URL in Vercel to your SyncLyst backend URL (e.g. https://your-app.railway.app).'
    });
  }

  const url = base + '/api/v1/vision/extract';
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;
    const r = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body || {})
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ detail: 'Extraction service unavailable. Check AURALINK_BACKEND_URL and that the backend is running.' });
  }
}
