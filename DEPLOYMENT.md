# 🚀 GeoSentinel Fleet — Production Deployment Guide

> **Google All Things Agentic Hackathon**  
> Complete deployment guide for running the **FastAPI Backend on Render** and the **React 19 / Vite Frontend on Vercel**.

---

## 1. System Architecture

```text
                                  PUBLIC INTERNET
                                         │
                                         ▼
                   ┌───────────────────────────────────────────┐
                   │             VERCEL (FRONTEND)             │
                   │   React 19 • TypeScript • Vite • Recharts │
                   │       https://geosentinel-fleet.vercel.app │
                   └─────────────────────┬─────────────────────┘
                                         │
                                         │ HTTPS REST API
                                         │ + WSS WebSockets
                                         ▼
                   ┌───────────────────────────────────────────┐
                   │             RENDER (BACKEND)              │
                   │ FastAPI • Uvicorn • Pydantic v2 • AsyncIO │
                   │   https://geosentinel-backend.onrender.com │
                   └──────┬──────────────────────┬─────────────┘
                          │                      │
                          ▼                      ▼
        ┌───────────────────────────┐   ┌───────────────────────────┐
        │     GOOGLE GEMINI API     │   │ DETERMINISTIC PHYSICS LAB │
        │    Gemini 2.5 Pro Brain   │   │  NumPy ACI 318 / ASCE 41  │
        │ Structured Tool Calling   │   │ OpenSeesPy Pushover FEA   │
        └───────────────────────────┘   │ ACI 440.2R CFRP Optimizer │
                                        └───────────────────────────┘
```

---

## 2. Environment Variables Reference

### Backend (Render / Cloud Environment)

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `GEMINI_API_KEY` | **Yes** | `""` | Google Gemini API Key from [AI Studio](https://aistudio.google.com/app/apikey). |
| `GEMINI_MODEL` | No | `gemini-2.5-pro` | Gemini model identifier for Commander orchestration. |
| `FRONTEND_ORIGIN` | **Yes** | `http://localhost:5173` | Comma-separated list of allowed CORS domains (e.g. `https://geosentinel-fleet.vercel.app,http://localhost:5173`). |
| `SAFETY_FACTOR_THRESHOLD` | No | `1.5` | Emergency limit for structural safety factor ($SF \ge 1.50$). |
| `SANDBOX_TIMEOUT_SECONDS` | No | `15` | Subprocess execution timeout in seconds. |
| `PORT` | Auto | `8000` | Automatically injected by Render / Cloud container runtime. |

### Frontend (Vercel Environment)

| Variable | Required | Production Example | Description |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | **Yes** | `https://geosentinel-backend.onrender.com` | HTTPS base URL of the deployed FastAPI backend. |
| `VITE_WS_URL` | **Yes** | `wss://geosentinel-backend.onrender.com/ws/swarm-feed` | Secure WebSocket endpoint for live event streaming. |

> ⚠️ **Security Notice:** Never add `GEMINI_API_KEY` to Vercel or any frontend environment variables. All LLM calls and physics calculations occur strictly on the backend.

---

## 3. Step-by-Step Backend Deployment (Render)

### Option A: 1-Click Render Blueprint (Recommended)
1. Push your repository to GitHub.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** → **Blueprint**.
4. Connect your GitHub repository (`geosentinel-fleet`).
5. Render will automatically detect `render.yaml` and configure the web service.
6. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: `your_actual_gemini_api_key`
   - `FRONTEND_ORIGIN`: `https://your-vercel-app.vercel.app,http://localhost:5173`
7. Click **Apply**.

### Option B: Manual Web Service Setup
1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the following fields:
   - **Name:** `geosentinel-backend`
   - **Runtime:** `Python 3`
   - **Python Version:** `3.11.9`
   - **Region:** `Oregon (US West)`
   - **Branch:** `main`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/health`
4. In the **Environment Variables** tab, add:
   - `GEMINI_API_KEY`: `AIzaSy...`
   - `GEMINI_MODEL`: `gemini-2.5-pro`
   - `FRONTEND_ORIGIN`: `https://geosentinel-fleet.vercel.app`
   - `SAFETY_FACTOR_THRESHOLD`: `1.5`
   - `SANDBOX_TIMEOUT_SECONDS`: `15`
5. Click **Create Web Service**.
6. Once deployed, copy your backend URL (e.g. `https://geosentinel-backend.onrender.com`).

---

## 4. Step-by-Step Frontend Deployment (Vercel)

1. Log in to [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository (`geosentinel-fleet`).
4. Configure the project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. In the **Environment Variables** section, add:
   - `VITE_API_BASE_URL`: `https://geosentinel-backend.onrender.com`
   - `VITE_WS_URL`: `wss://geosentinel-backend.onrender.com/ws/swarm-feed`
6. Click **Deploy**.
7. Once deployed, note your Vercel URL (e.g. `https://geosentinel-fleet.vercel.app`).
8. Return to Render and update `FRONTEND_ORIGIN` with your actual Vercel domain.

---

## 5. Cold-Start Warmup Procedure (Crucial for Demos)

Free/Standard Render instances may spin down after 15 minutes of inactivity. To ensure zero-latency judge demonstrations:

1. **Ping the Health Check 2 minutes prior to a presentation:**
   ```bash
   curl -s https://geosentinel-backend.onrender.com/health
   # Returns: {"status":"ok","service":"geosentinel-backend"}
   ```
2. **Verify live response:**
   ```bash
   curl -s https://geosentinel-backend.onrender.com/api/v1/scenarios
   ```
3. Once the health check returns `200 OK`, the Python runtime, OpenSeesPy binary, and WebSocket bus are fully warm in memory.

---

## 6. End-to-End Production Verification Checklist

Run this verification from the deployed public URL:

1. [ ] Open `https://geosentinel-fleet.vercel.app` in an incognito browser window.
2. [ ] Verify header shows **`WS LIVE`** (green pulsing badge).
3. [ ] Verify Scenario Selector loads all 3 scenarios (`Bridge Pier P-04`, `Overpass Column`, `Transfer Girder`).
4. [ ] Click **`TRIGGER ANOMALY TRIAGE`** on `Bridge Pier P-04`.
5. [ ] Verify live WebSocket event stream begins receiving events with elapsed timestamp offsets (`+0.4s`, `+1.2s`...).
6. [ ] Verify **Agent Fleet** lights up (`Commander` $\to$ `StructuralAgent` $\to$ `ValidationAgent`).
7. [ ] Verify **Validation Agent** flags objection: *"INSUFFICIENT EVIDENCE: Shear analysis returned SF=1.54 (PASS), which DOES NOT explain severe strain & spalling."*
8. [ ] Verify **Commander** initiates `REPLANNING` to OpenSeesPy FEA and Moment-Curvature analysis.
9. [ ] Verify **Retrofit Agent** designs ACI 440.2R CFRP composite jacket.
10. [ ] Verify **Validation Agent** passes post-retrofit safety criteria ($SF = 1.74 \ge 1.50$).
11. [ ] Verify **Engineering Dashboard** renders all 4 Recharts dynamically.
12. [ ] Verify **Executive Panel** displays `HIGH RISK → MITIGATED`.
13. [ ] Click **`Audit Dossier`** and verify Markdown download completes.
14. [ ] Click **`Replay Mission`** and test scrubbing through recorded event timeline.

---

## 7. Troubleshooting & FAQ

### Issue 1: `CORS Error (Access-Control-Allow-Origin)`
- **Cause:** Backend `FRONTEND_ORIGIN` does not match the exact Vercel URL.
- **Fix:** In Render Dashboard $\to$ Environment $\to$ Set `FRONTEND_ORIGIN` to `https://your-exact-app.vercel.app` (without trailing slash). Render will auto-restart in 30 seconds.

### Issue 2: `WebSocket Connection Failed (wss://...)`
- **Cause:** Using `ws://` on an `https://` Vercel site causes browser mixed-content blocking.
- **Fix:** Ensure `VITE_WS_URL` begins with `wss://` and targets the Render domain directly (e.g. `wss://geosentinel-backend.onrender.com/ws/swarm-feed`).

### Issue 3: `Gemini API Rate Limit / Quota Exceeded`
- **Behavior:** GeoSentinel Fleet contains a resilient autonomous fallback state machine. If Gemini API rate limits or network glitches occur, the system transparently completes the full agentic multi-stage replanning workflow deterministically without throwing 500 errors.

---

## 8. Local Docker Deployment (Self-Hosted Alternative)

To test the entire containerized stack locally before cloud deployment:

```bash
# Build and run container
docker compose up --build

# Backend available at: http://localhost:8000
# Health check: http://localhost:8000/health
```
