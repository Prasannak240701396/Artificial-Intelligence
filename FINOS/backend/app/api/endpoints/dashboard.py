from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.models import Account, Transaction, Department, Budget, MarketAsset, RiskEvent
from app.services.market_provider import get_market_provider

router = APIRouter()

@router.get("/metrics")
def get_dashboard_metrics(db: Session = Depends(get_db)):
    total_assets = db.query(func.sum(Account.balance)).scalar() or 248500000.0
    total_expenditure = db.query(func.sum(Department.spent_budget)).scalar() or 184500000.0
    allocated_budget = db.query(func.sum(Department.allocated_budget)).scalar() or 225000000.0

    utilization_pct = (total_expenditure / allocated_budget * 100.0) if allocated_budget > 0 else 82.0
    pending_payments_val = db.query(func.sum(Transaction.amount)).filter(Transaction.status == "Pending").scalar() or 1420000.0
    risk_exposure_avg = db.query(func.avg(Transaction.risk_score)).scalar() or 18.4

    net_cash_flow = total_assets - (total_expenditure * 0.2)

    market_provider = get_market_provider()
    pulse = market_provider.get_market_pulse()
    sp500 = next((item for item in pulse if item["symbol"] == "S&P 500"), None)

    return {
        "total_assets": {"value": round(total_assets, 2), "change": 4.2, "trend": "UP", "sparkline": [240, 242, 245, 247, 248.5]},
        "available_balance": {"value": round(total_assets * 0.45, 2), "change": 1.8, "trend": "UP", "sparkline": [108, 109, 110, 111, 111.8]},
        "total_expenditure": {"value": round(total_expenditure, 2), "change": -2.1, "trend": "DOWN", "sparkline": [190, 188, 186, 185, 184.5]},
        "net_cash_flow": {"value": round(net_cash_flow, 2), "change": 5.7, "trend": "UP", "sparkline": [195, 198, 201, 205, 211.6]},
        "pending_payments": {"value": round(pending_payments_val, 2), "change": -8.4, "trend": "DOWN", "sparkline": [1.8, 1.6, 1.5, 1.45, 1.42]},
        "risk_exposure": {"value": round(risk_exposure_avg, 1), "change": 1.2, "trend": "UP", "sparkline": [16, 17, 18, 18.2, 18.4]},
        "budget_utilization": {"value": round(utilization_pct, 1), "change": 0.5, "trend": "STABLE", "sparkline": [80, 81, 81.5, 81.8, 82.0]},
        "market_index": {"symbol": "S&P 500", "price": sp500["price"] if sp500 else 5620.10, "change_pct": sp500["change_pct"] if sp500 else 0.51}
    }

@router.get("/pulse")
def get_global_pulse():
    market_provider = get_market_provider()
    return {
        "mode": market_provider.get_mode(),
        "timestamp": market_provider.get_market_pulse()[0]["last_updated"],
        "assets": market_provider.get_market_pulse()
    }
