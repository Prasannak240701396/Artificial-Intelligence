from typing import Dict, List, Any
import datetime

AGENTS_CONFIG = [
    {
        "name": "Monitoring Agent",
        "role": "Continuous Financial System Surveillance",
        "description": "Monitors active transaction streams, account balance movements, and API gateway health in real time.",
        "status": "ACTIVE",
        "confidence": 0.98,
        "risk_rating": 8.0,
        "task": "Scanning incoming transaction stream for anomalous volume spikes"
    },
    {
        "name": "Market Intelligence Agent",
        "role": "Global Market & Macro Economic Tracking",
        "description": "Ingests real-time prices for stock indices, FX rates, commodities, and calculates macro correlation matrices.",
        "status": "ACTIVE",
        "confidence": 0.95,
        "risk_rating": 12.0,
        "task": "Ingesting tick feed for S&P 500, USD/INR and Brent Crude"
    },
    {
        "name": "Financial Analysis Agent",
        "role": "Balance Sheet & Ratio Evaluation",
        "description": "Computes liquidity ratios, debt service coverage, working capital metrics, and revenue vs expenditure trends.",
        "status": "ACTIVE",
        "confidence": 0.96,
        "risk_rating": 10.0,
        "task": "Evaluating Q3 departmental liquidity positions and cash coverage"
    },
    {
        "name": "Budget Planning Agent",
        "role": "Departmental Allocation & Variance Tracking",
        "description": "Tracks department budget utilization percentages, flags ceiling overruns, and suggests re-allocation vectors.",
        "status": "ACTIVE",
        "confidence": 0.94,
        "risk_rating": 15.0,
        "task": "Checking Public Works and Health department spending against annual ceilings"
    },
    {
        "name": "Risk Detection Agent",
        "role": "Multi-Dimensional Anomaly & Vulnerability Scoring",
        "description": "Runs Bayesian inference models and Isolation Forest clustering to calculate 0-100 transaction risk scores.",
        "status": "ACTIVE",
        "confidence": 0.97,
        "risk_rating": 22.0,
        "task": "Evaluating high-value disbursements for fraud likelihood and Z-score deviation"
    },
    {
        "name": "Policy Validation Agent",
        "role": "Compliance & Declarative Rules Verification",
        "description": "Validates transactions against organizational financial policy rules, authorization limits, and whitelist constraints.",
        "status": "ACTIVE",
        "confidence": 0.99,
        "risk_rating": 5.0,
        "task": "Enforcing Rule_001 (Senior sign-off requirement for payments > $100,000)"
    },
    {
        "name": "Forecasting Agent",
        "role": "Predictive Time-Series & Trend Modeling",
        "description": "Generates 30-day and 90-day cash flow, expenditure, and revenue projections using Holt-Winters exponential smoothing.",
        "status": "ACTIVE",
        "confidence": 0.92,
        "risk_rating": 18.0,
        "task": "Generating 6-month budget utilization forecast with 95% confidence intervals"
    },
    {
        "name": "Optimization Agent",
        "role": "Resource Allocation & Portfolio Optimization",
        "description": "Executes CSP Backtracking and Minimax strategy decision trees to find pareto-optimal capital distribution.",
        "status": "ACTIVE",
        "confidence": 0.93,
        "risk_rating": 14.0,
        "task": "Running CSP solver for multi-department Q4 allocation balancing priority constraints"
    },
    {
        "name": "Execution Simulation Agent",
        "role": "Safe Sandbox Financial Scenario Testing",
        "description": "Simulates payment disbursements and portfolio rebalancing in a sandbox environment without executing real money transfers.",
        "status": "ACTIVE",
        "confidence": 0.99,
        "risk_rating": 2.0,
        "task": "Simulating execution of 14 queued departmental vendor disbursements"
    },
    {
        "name": "Verification Agent",
        "role": "Post-Sim Validation & Double Entry Balancing",
        "description": "Verifies ledger balance equations, debits equal credits integrity, and cryptographic transaction hashes.",
        "status": "ACTIVE",
        "confidence": 1.00,
        "risk_rating": 1.0,
        "task": "Validating double-entry debit/credit ledger equality across active operational accounts"
    },
    {
        "name": "Audit Agent",
        "role": "Immutable Logging & Compliance Provenance",
        "description": "Appends every system event, agent reasoning step, and state mutation to the immutable audit trail log.",
        "status": "ACTIVE",
        "confidence": 1.00,
        "risk_rating": 0.0,
        "task": "Writing cryptographic provenance hashes to system audit table"
    }
]
