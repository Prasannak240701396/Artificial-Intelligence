import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from algorithms.a_star import FinancialAStar
from algorithms.anomaly_detection import FinancialAnomalyDetector
from algorithms.bayesian_risk import BayesianRiskModel
from algorithms.csp_backtracking import BudgetCSP
from algorithms.forecasting import FinancialForecaster
from algorithms.logic_engine import FinancialLogicEngine
from algorithms.minimax import CapitalMinimax


def test_a_star_solver():
    solver = FinancialAStar()
    result = solver.run(
        initial_debt=300000.0,
        initial_savings=40000.0,
        target_debt=0.0,
        target_savings=150000.0
    )
    assert result["algorithm"] == "A* Financial Optimization"
    assert result["path_length"] > 0
    assert len(result["path"]) > 0
    assert result["nodes_explored"] > 0
    last_step = result["path"][-1]
    assert last_step["debt"] <= 0.0
    assert last_step["savings"] >= 150000.0


def test_anomaly_detector_default():
    detector = FinancialAnomalyDetector()
    res = detector.analyze()
    assert res["total_samples"] == 100
    assert "z_score_anomalies_count" in res
    assert "iqr_anomalies_count" in res
    assert "isolation_forest_anomalies_count" in res
    assert res["consensus_anomalies_count"] > 0


def test_anomaly_detector_custom_data():
    detector = FinancialAnomalyDetector()
    # 20 normal samples and 1 massive outlier
    data = [100.0] * 20 + [500000.0]
    res = detector.analyze(data)
    assert res["total_samples"] == 21
    assert res["z_score_anomalies_count"] >= 1
    assert res["iqr_anomalies_count"] >= 1


def test_bayesian_risk_model():
    model = BayesianRiskModel()
    # Baseline with no evidence
    res_none = model.infer([])
    assert res_none["posterior_high_risk_prob"] == pytest.approx(0.05, 0.01)

    # With high risk indicators
    res_high = model.infer([
        "amount_above_3std",
        "off_hours_timing",
        "budget_deviation_gt_20pct",
        "high_velocity_frequency"
    ])
    assert res_high["posterior_high_risk_prob"] > 0.8
    assert res_high["risk_level"] in ["HIGH", "CRITICAL"]


def test_csp_backtracking_budget():
    csp = BudgetCSP()
    res = csp.run(total_budget=10000000.0)
    assert res["algorithm"] == "CSP Backtracking Budget Allocator"
    assert res["solution"] is not None
    assert res["total_allocated"] <= 10000000.0
    assert res["unallocated_reserve"] >= 0.0


def test_financial_forecasting():
    forecaster = FinancialForecaster()
    res = forecaster.forecast(periods_ahead=6)
    assert res["algorithm"] == "Multi-Model Time Series Forecasting"
    assert res["forecast_horizon"] == 6
    assert len(res["forecast"]) == 6
    for pt in res["forecast"]:
        assert pt["lower_bound_95"] <= pt["linear_regression"] <= pt["upper_bound_95"]


def test_logic_engine_clean_transaction():
    engine = FinancialLogicEngine()
    tx = {
        "transaction_code": "TX_CLEAN_01",
        "amount": 25000.0,
        "hour": 14,
        "frequency_count_1h": 1,
        "is_counterparty_verified": True
    }
    res = engine.evaluate(tx)
    assert res["compliance_status"] == "PASS"
    assert len(res["triggered_rules"]) == 0
    assert res["calculated_risk_score"] < 25


def test_logic_engine_flagged_transaction():
    engine = FinancialLogicEngine()
    tx = {
        "transaction_code": "TX_ALERT_01",
        "amount": 250000.0,
        "hour": 2,
        "frequency_count_1h": 8,
        "is_counterparty_verified": False
    }
    res = engine.evaluate(tx)
    assert res["compliance_status"] in ["REVIEW_REQUIRED", "CRITICAL_FLAG", "ELEVATED_MONITORING"]
    assert len(res["triggered_rules"]) >= 3
    assert res["calculated_risk_score"] > 50


def test_minimax_solver():
    solver = CapitalMinimax()
    res = solver.solve()
    assert "optimal_strategy" in res
    assert "minimax_value" in res
    assert len(res["decision_tree"]) == 4
