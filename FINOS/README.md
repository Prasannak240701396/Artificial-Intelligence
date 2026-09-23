# FINOS - Financial Intelligence and Operations System

**FINOS** is a professional, full-stack financial intelligence and agentic finance platform designed for academic and research evaluation. It features real-time market data streaming/simulation, dense financial intelligence dashboards, 11 autonomous agentic finance workers, executable AI & analytics algorithms, automated budget/risk tracking, and an extensive audit trail.

---

## ⚠️ Academic & Safety Disclaimer

> **IMPORTANT**: FINOS is strictly an **academic/research system**. It does **NOT** execute real banking payments, real money transfers, or real stock exchange trades. All financial disbursements, portfolio rebalancing, and algorithm executions take place within a controlled local simulation environment.

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
PostgreSQL / SQLite Storage Engine
        ↓
FastAPI REST & WebSocket Server (Port 8000)
        ↓
React + Vite + TypeScript Dark Bloomberg Terminal UI (Port 3000)
```

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Apache ECharts, Lucide Icons, TanStack Query, React Router.
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy, Pydantic v2, WebSockets, Redis pub/sub.
- **Database**: PostgreSQL 15 (Docker) / SQLite (Standalone local fallback).
- **AI & Algorithms**: NumPy, Pandas, SciPy, scikit-learn (A* Search, CSP Backtracking, Financial Rules Engine, Bayesian Probability Risk, Minimax Game Theory, Isolation Forest Anomaly Detection, OLS & Exponential Smoothing Forecasting).
- **Agents**: 11 Specialized Autonomous Agents executing an 9-phase workflow loop (`OBSERVE -> ANALYZE -> REASON -> PLAN -> VALIDATE -> SIMULATE -> VERIFY -> AUDIT -> REPLAN`).

---

## 📁 Directory Structure

```text
FINOS/
├── frontend/                   # React + Vite + TypeScript + Tailwind CSS + ECharts UI
│   ├── src/
│   │   ├── components/         # TopHeader, Sidebar, GlobalPulse, MetricCard, EChart Wrapper
│   │   ├── pages/              # 16 Full-featured financial terminal views
│   │   ├── services/           # REST API client & WebSocket stream subscriber
│   │   └── types/              # TypeScript domain types
├── backend/                    # FastAPI Backend Application
│   ├── app/
│   │   ├── api/                # 15 Modular REST routers (Auth, Dashboard, Risk, etc.)
│   │   ├── core/               # Security, Database session, WebSockets manager, Config
│   │   ├── models/             # SQLAlchemy ORM schemas
│   │   ├── schemas/            # Pydantic validation schemas
│   │   ├── services/           # Market provider abstraction (Live vs Simulation)
│   │   └── main.py             # FastAPI entry point & continuous background ticker
├── agents/                     # Agentic Finance Engine (11 Autonomous Agents)
│   ├── agent_definitions.py    # Roles, tasks, confidence levels
│   └── engine.py               # 9-Phase workflow coordinator
├── algorithms/                 # Executable AI & Optimization Algorithms
│   ├── a_star.py               # A* Search pathfinding for financial debt/capital allocation
│   ├── csp_backtracking.py     # Backtracking CSP solver for departmental budgets
│   ├── logic_engine.py         # Declarative financial rule engine
│   ├── bayesian_risk.py        # Bayesian risk model P(Risk | Evidence)
│   ├── minimax.py              # Game-theoretic capital allocation strategy solver
│   ├── anomaly_detection.py    # Z-Score, IQR, and Isolation Forest anomaly detector
│   └── forecasting.py          # OLS Linear Regression, Exponential Smoothing, Moving Average
├── database/                   # Database seeder
│   └── seed_db.py              # Populates 120+ transactions, 10+ depts, budgets, market assets
├── docker-compose.yml          # PostgreSQL + Redis container definitions
├── .env.example                # Sample environment variables
├── scripts/                    # Windows launch batch & PowerShell setup scripts
└── README.md                   # Comprehensive guide
```

---

## 🚀 Quickstart Guide (Windows)

### Prerequisites
- Python 3.10+
- Node.js 18+
- (Optional) Docker Desktop for PostgreSQL & Redis

### Step 1: Install Backend Dependencies & Seed Database
Open PowerShell in the workspace root:

```powershell
# Navigate to backend
cd backend
pip install -r requirements.txt

# Run Database Seeder (Populates 120+ transactions, budgets, agents)
cd ..
python database\seed_db.py
```

### Step 2: Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

### Step 3: Launch Services
You can start both backend and frontend using the provided batch launcher:

```cmd
.\scripts\run_all.bat
```

Or start them manually in two separate command windows:

**Terminal 1 (Backend):**
```cmd
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 (Frontend):**
```cmd
cd frontend
npm run dev
```

Access the application in your browser at:
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **FastAPI OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## ⚡ Real-Time Streaming Modes

FINOS supports two operational market data modes:

1. **SIMULATION MODE (Default)**: Uses correlated Geometric Brownian Motion with drift, stochastic volatility, momentum, mean reversion, and macro shocks to generate realistic market movements.
2. **LIVE DATA**: Configurable via `Settings` page or `.env` file by providing a Finnhub or AlphaVantage API Key to stream real equity quotes.

---

## 🧪 Algorithm Lab

FINOS features an interactive **Algorithm Lab** (`/algorithm-lab`) enabling interactive execution and parameter testing for:
1. **A* Search**: Financial debt restructuring and capital pathfinding.
2. **CSP / Backtracking**: Multi-departmental budget optimization under strict min/max constraints.
3. **Logic Engine**: Declarative financial policy compliance rules.
4. **Bayesian Risk**: Posterior risk probability estimation given multi-vector evidence.
5. **Minimax**: Game-theoretic minimax strategy tree evaluation against market crash scenarios.
6. **ML Anomaly Detection**: Z-Score, Interquartile Range, and Isolation Forest transaction clustering.
7. **Time-Series Forecasting**: Multi-model exponential smoothing and linear trend forecasting with 95% confidence bounds.
