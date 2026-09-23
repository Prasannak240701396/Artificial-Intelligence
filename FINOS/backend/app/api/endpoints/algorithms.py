from fastapi import APIRouter, Body
from typing import Dict, Any

from algorithms.a_star import FinancialAStar
from algorithms.csp_backtracking import BudgetCSP
from algorithms.logic_engine import FinancialLogicEngine
from algorithms.bayesian_risk import BayesianRiskModel
from algorithms.minimax import CapitalMinimax
from algorithms.anomaly_detection import FinancialAnomalyDetector
from algorithms.forecasting import FinancialForecaster

router = APIRouter()

@router.post("/a-star")
def execute_a_star(payload: Dict[str, Any] = Body(default={})):
    solver = FinancialAStar()
    initial_debt = float(payload.get("initial_debt", 500000.0))
    initial_savings = float(payload.get("initial_savings", 50000.0))
    target_debt = float(payload.get("target_debt", 0.0))
    target_savings = float(payload.get("target_savings", 200000.0))
    return solver.run(initial_debt, initial_savings, target_debt, target_savings)

@router.post("/csp")
def execute_csp(payload: Dict[str, Any] = Body(default={})):
    solver = BudgetCSP()
    total_budget = float(payload.get("total_budget", 10000000.0))
    return solver.run(total_budget=total_budget)

@router.post("/logic-rules")
def execute_logic_rules(payload: Dict[str, Any] = Body(default={})):
    engine = FinancialLogicEngine()
    tx = payload.get("transaction", {"transaction_code": "TX_TEST_88", "amount": 125000.0, "hour": 2, "frequency_count_1h": 6, "is_counterparty_verified": False})
    return engine.evaluate(tx)

@router.post("/bayesian-risk")
def execute_bayesian(payload: Dict[str, Any] = Body(default={})):
    bayes = BayesianRiskModel()
    evidence = payload.get("evidence", ["amount_above_3std", "off_hours_timing", "high_velocity_frequency"])
    return bayes.infer(evidence)

@router.post("/minimax")
def execute_minimax():
    solver = CapitalMinimax()
    return solver.solve()

@router.post("/anomaly-detection")
def execute_anomaly():
    detector = FinancialAnomalyDetector()
    return detector.analyze()

@router.post("/forecasting")
def execute_forecasting(payload: Dict[str, Any] = Body(default={})):
    forecaster = FinancialForecaster()
    periods = int(payload.get("periods", 6))
    return forecaster.forecast(periods_ahead=periods)
