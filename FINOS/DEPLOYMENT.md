# FINOS Deployment Guide

This document outlines the testing, build verification, and deployment procedures for the **FINOS (Financial Intelligence and Operations System)** platform.

---

## 📋 Pre-Deployment Validation & Testing

FINOS comes with an automated unit and integration test suite covering AI algorithms, autonomous agents, and backend REST APIs.

### Running Test Suite
```powershell
# From the FINOS root directory:
python -m pytest -v

# Or use the one-click batch script:
.\scripts\run_tests.bat
```

**Tested Components**:
1. **Financial Algorithms**:
   - `A* Search`: Capital and debt pathfinding optimization.
   - `Anomaly Detection`: Z-Score, IQR, and Isolation Forest ML clustering.
   - `Bayesian Risk`: Posterior conditional probability risk model.
   - `CSP Backtracking`: Departmental budget allocation under constraints.
   - `Forecasting`: Ordinary Least Squares linear trend & Exponential Smoothing.
   - `Logic Engine`: Declarative IF-THEN financial compliance rules.
   - `Minimax`: Game-theoretic minimax portfolio defense.
2. **Autonomous Agents**:
   - 11 Agent definitions, roles, tasks, and confidence metrics.
   - 9-phase workflow coordinator loop (`OBSERVE` through `REPLAN`).
3. **Backend API Endpoints**:
   - System Health, Dashboard Metrics & Pulse, Transactions, Budgets, Risk, Cash Flow, and Token Auth.

---

## 🚀 Deployment Options

### Option 1: Native Windows Production Deployment (Recommended for Local/Server VM)

To build optimized assets and run both services in production mode:

```cmd
.\scripts\deploy_production.bat
```

This pipeline automatically:
1. Executes `pytest -q` to guarantee code integrity.
2. Compiles the TypeScript React application via `npm run build` into minified production chunks (`frontend/dist/`).
3. Serves the production build with Vite Preview on port `3000` with reverse proxying to port `8000`.
4. Spawns the production FastAPI Uvicorn ASGI server on port `8000`.

---

### Option 2: Docker Multi-Container Deployment

Full multi-container topology orchestrating:
- `finos_frontend`: Nginx reverse proxy serving the SPA on port `3000`.
- `finos_backend`: FastAPI ASGI service on port `8000`.
- `finos_postgres`: PostgreSQL 15 database on port `5432`.
- `finos_redis`: Redis 7 event streaming cache on port `6379`.

#### Deploy with Docker Compose:
```powershell
docker compose up --build -d
```
or run:
```cmd
.\scripts\deploy_docker.bat
```

#### Stopping Containers:
```powershell
docker compose down
```

---

### Option 3: Cloud Deployment (Render / Railway / Fly.io / AWS)

#### Backend Deployment (Render / Railway / AWS EC2)
1. **Build Context**: Repository root.
2. **Dockerfile**: `Dockerfile.backend`
3. **Port**: `8000`
4. **Environment Variables**:
   - `DATABASE_URL`: `postgresql://<user>:<password>@<host>:5432/<db>` (or leave SQLite default `sqlite:///./finos.db`)
   - `SECRET_KEY`: `<secure-random-token>`
   - `MARKET_DATA_MODE`: `SIMULATION`

#### Frontend Deployment (Vercel / Netlify / Cloudflare Pages)
1. **Framework Preset**: Vite
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variable**: `VITE_API_URL` pointing to your deployed backend URL.

---

## 🌐 Operational Endpoints

| Service | Local URL | Container Port | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | [http://localhost:3000](http://localhost:3000) | `80` (mapped to `3000`) | Institutional financial terminal & dashboards |
| **FastAPI Backend** | [http://localhost:8000](http://localhost:8000) | `8000` | REST API routes & background tickers |
| **Swagger OpenAPI** | [http://localhost:8000/docs](http://localhost:8000/docs) | `8000` | Interactive API documentation |
| **WebSocket Stream** | `ws://localhost:8000/ws` | `8000` | Live simulated ticker & agent event stream |
