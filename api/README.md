# SyncLyst API — secure backend for API keys

All keys stay on the server. The browser never sees them.

## Setup

1. **Install dependencies**
   ```bash
   cd api && npm install
   ```

2. **Create `.env` from the example**
   ```bash
   cp .env.example .env
   ```

3. **Add your keys to `api/.env`** (never commit this file)
   - `GEMINI_API_KEY` — [Google AI Studio](https://aistudio.google.com/apikey)
   - `GOOGLE_VISION_API_KEY` — enable [Vision API](https://console.cloud.google.com/apis/library/vision.googleapis.com)

## Run

From the **repo root** (so the server can serve `index.html`):

```bash
node api/server.js
```

Then open **http://localhost:3001/** in your browser. The same server serves the site and the API; keys are only used on the server.

## Endpoints (proxy only; keys are never exposed)

| Method | Path | Forwards to |
|--------|------|-------------|
| POST | `/api/vision/annotate` | Google Vision API (OCR) |
| POST | `/api/gemini/generate` | Gemini generateContent |
| GET  | `/api/health` | — (reports if keys are set, no values) |

## Security

- Keys are read from `process.env` (from `api/.env`). `.env` is gitignored.
- Keys are never logged or sent in responses.
- Optional: set `ALLOWED_ORIGIN` in `.env` to restrict which origins can call the API (comma-separated).

## If the frontend is on another host

Set `API_BASE` in `config.js` (see `config.example.js`) so the site knows where to send API requests, and set `ALLOWED_ORIGIN` in `api/.env` to your site’s origin(s).
