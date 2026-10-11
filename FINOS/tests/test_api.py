import pytest
import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from backend.app.main import app

client = TestClient(app)


def test_health_check_routes():
    res = client.get("/api/v1/system/status")
    assert res.status_code == 200
    data = res.json()
    assert "status" in data


def test_dashboard_metrics():
    res = client.get("/api/v1/dashboard/metrics")
    assert res.status_code == 200
    data = res.json()
    assert "total_assets" in data
    assert "available_balance" in data
    assert "total_expenditure" in data
    assert "net_cash_flow" in data


def test_dashboard_pulse():
    res = client.get("/api/v1/dashboard/pulse")
    assert res.status_code == 200
    data = res.json()
    assert "assets" in data
    assert len(data["assets"]) > 0


def test_transactions_list():
    res = client.get("/api/v1/transactions/?limit=10")
    assert res.status_code == 200
    data = res.json()
    assert "total" in data
    assert "items" in data
    assert isinstance(data["items"], list)


def test_budgets_list():
    res = client.get("/api/v1/budgets/")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)


def test_risk_metrics():
    res = client.get("/api/v1/risk/summary")
    assert res.status_code == 200
    data = res.json()
    assert "overall_system_risk_score" in data
    assert "department_risks" in data
    assert "top_risky_transactions" in data


def test_cash_flow_summary():
    res = client.get("/api/v1/cash-flow/")
    assert res.status_code == 200
    data = res.json()
    assert "current_liquidity" in data
    assert "historical" in data
    assert "projection" in data


def test_algorithm_endpoints():
    # Test A*
    res_astar = client.post("/api/v1/algorithms/a-star", json={
        "initial_debt": 200000.0,
        "initial_savings": 50000.0,
        "target_debt": 0.0,
        "target_savings": 100000.0
    })
    assert res_astar.status_code == 200
    assert res_astar.json()["algorithm"] == "A* Financial Optimization"
    assert len(res_astar.json()["path"]) > 0

    # Test CSP
    res_csp = client.post("/api/v1/algorithms/csp", json={"total_budget": 10000000.0})
    assert res_csp.status_code == 200
    assert res_csp.json()["algorithm"] == "CSP Backtracking Budget Allocator"
    assert res_csp.json()["solution"] is not None

    # Test Anomaly
    res_anomaly = client.post("/api/v1/algorithms/anomaly-detection")
    assert res_anomaly.status_code == 200
    assert res_anomaly.json()["consensus_anomalies_count"] > 0

    # Test Forecasting
    res_forecast = client.post("/api/v1/algorithms/forecasting", json={"periods": 4})
    assert res_forecast.status_code == 200
    assert len(res_forecast.json()["forecast"]) == 4

    # Test Minimax
    res_minimax = client.post("/api/v1/algorithms/minimax")
    assert res_minimax.status_code == 200
    assert "optimal_strategy" in res_minimax.json()


def test_auth_token_demo():
    res = client.post("/api/v1/auth/token", data={
        "username": "admin@finos.org",
        "password": "any_password"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
