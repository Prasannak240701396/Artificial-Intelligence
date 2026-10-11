# FINOS - Financial Intelligence and Operations System

**FINOS** is an institutional-grade, full-stack financial intelligence and agentic operations platform. It features real-time financial data streaming, dense intelligence dashboards, 11 autonomous agentic finance workers, 7 executable AI & optimization algorithms, multi-tier project authorization workflows, and complete cryptographic audit logging.

---

## 🌐 Live Access & Deployment Links

* **Frontend Web Application**: [http://localhost:3000](http://localhost:3000)
* **Backend REST API & Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **WebSocket Real-Time Stream**: `ws://localhost:8000/ws`
* **Cloud Ready**: Configured for 1-click deployment on **Vercel** (Frontend) and **Render / Railway / AWS** (Backend).

### 🔑 Demo Institutional Logins

| Leadership Role | Email | Password |
| :--- | :--- | :--- |
| **Chief Executive Officer (CEO)** | `ceo@ceo.finos.gov.in` | `admin123` |
| **Chief Financial Officer (CFO)** | `cfo@finos.gov.in` | `admin123` |
| **Chief Risk Auditor** | `auditor@finos.gov.in` | `admin123` |
| **Regional Director** | `director@finos.gov.in` | `admin123` |
| **Project Operations Manager** | `pm@finos.gov.in` | `admin123` |

---

## ⚠️ Safety & Academic Disclaimer

> **IMPORTANT**: FINOS is an **academic & research simulation platform**. It does **NOT** execute real banking payments, real money transfers, or real stock exchange trades. All financial disbursements, portfolio rebalancing, and algorithm executions take place within a controlled simulation and audit sandbox.

---

## 🏗️ Architecture & Technology Stack

```text
Market/Data Provider (Live / Simulation Provider Abstraction)
        ↓
Data Normalizer & Event Bus
        ↓
Redis Event Bus & WebSocket Hub
        ↓
Analytics Engine (Risk, Anomaly, Forecasting)
        ↓
Agentic Finance Engine (11 Autonomous Agents)
        ↓
PostgreSQL 15 / SQLite Storage Engine
        ↓
FastAPI REST & WebSocket Server (Port 8000)
        ↓
React 18 + Vite 5 + TypeScript Bloomberg Terminal UI (Port 3000)
```

- **Frontend**: React 18, Vite 5, TypeScript, Tailwind CSS, Apache ECharts, Lucide Icons, TanStack Query, React Router v6.
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy 2.0, Pydantic v2 (ConfigDict), WebSockets, Uvicorn ASGI.
- **Database**: PostgreSQL 15 (Docker) / SQLite 3 (Standalone local fallback).
- **AI & Algorithms**: NumPy, Pandas, SciPy, scikit-learn (A* Search, CSP Backtracking, Financial Rules Engine, Bayesian Probability Risk, Minimax Game Theory, Isolation Forest Anomaly Detection, OLS & Exponential Smoothing Forecasting).
- **Agents**: 11 Specialized Autonomous Agents executing a 9-phase workflow loop (`OBSERVE -> ANALYZE -> REASON -> PLAN -> VALIDATE -> SIMULATE -> VERIFY -> AUDIT -> REPLAN`).

---

## 🧪 Automated Test Suite (20/20 PASSED)

FINOS includes an automated test suite guaranteeing algorithm correctness, agent workflow state integrity, and API stability.

```powershell
# Run the complete test suite:
python -m pytest -v

# Or use the one-click Windows runner:
.\scripts\run_tests.bat
```

### Verified Test Matrix:
* **Financial Algorithms (9/9 Passed)**: A* Search, Anomaly Detection (Z-Score + IQR + Isolation Forest), Bayesian Risk Inference, CSP Backtracking Budget Allocator, Time-Series Forecasting (OLS + Exp Smoothing), Financial Logic Policy Rules, Minimax Game-Theoretic Solver.
* **Autonomous Agents (2/2 Passed)**: 11 Agent definitions, tasks, and 9-phase workflow engine execution loop.
* **FastAPI Backend (9/9 Passed)**: Health Check, Dashboard Metrics, Global Pulse, Transactions, Department Budgets, Risk Breakdown, Cash Flow Projections, Algorithm Endpoints, and OAuth2 JWT Auth.

---

## 🚀 Quickstart & Production Launch

### 1. One-Click Production Launch (Windows)
```cmd
.\scripts\deploy_production.bat
```
This automatically runs all tests, builds the optimized production bundle (`frontend/dist/`), and starts both production servers.

### 2. Multi-Container Docker Deployment
```cmd
.\scripts\deploy_docker.bat
# Or directly:
docker compose up --build -d
```
Spawns the full microservices stack: `finos_frontend` (Nginx), `finos_backend` (FastAPI), `finos_postgres` (PostgreSQL 15), and `finos_redis` (Redis 7).

### 3. Manual Local Development
```powershell
# Terminal 1 - Backend:
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend:
cd frontend
npm run dev
```

---

## 🧪 Algorithm Lab Capabilities

Accessible via `/algorithm-lab` for interactive execution and parameter testing:
1. **A* Search**: Financial debt restructuring and capital pathfinding.
2. **CSP / Backtracking**: Multi-departmental budget optimization under strict min/max constraints.
3. **Logic Engine**: Declarative financial policy compliance rules.
4. **Bayesian Risk**: Posterior risk probability estimation given multi-vector evidence.
5. **Minimax**: Game-theoretic minimax strategy tree evaluation against market crash scenarios.
6. **ML Anomaly Detection**: Z-Score, Interquartile Range, and Isolation Forest transaction clustering.
7. **Time-Series Forecasting**: Multi-model exponential smoothing and linear trend forecasting with 95% confidence bounds.
