from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
import datetime

router = APIRouter()

@router.get("/")
def get_cash_flow_summary(db: Session = Depends(get_db)):
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    historical = [
        {"month": "Jan", "inflow": 42.5, "outflow": 38.2, "net": 4.3, "liquidity": 110.5},
        {"month": "Feb", "inflow": 45.0, "outflow": 39.8, "net": 5.2, "liquidity": 115.7},
        {"month": "Mar", "inflow": 41.2, "outflow": 42.0, "net": -0.8, "liquidity": 114.9},
        {"month": "Apr", "inflow": 48.6, "outflow": 40.5, "net": 8.1, "liquidity": 123.0},
        {"month": "May", "inflow": 52.0, "outflow": 44.1, "net": 7.9, "liquidity": 130.9},
        {"month": "Jun", "inflow": 49.5, "outflow": 46.0, "net": 3.5, "liquidity": 134.4},
        {"month": "Jul", "inflow": 55.2, "outflow": 48.0, "net": 7.2, "liquidity": 141.6},
        {"month": "Aug", "inflow": 53.8, "outflow": 47.5, "net": 6.3, "liquidity": 147.9},
        {"month": "Sep", "inflow": 58.0, "outflow": 49.2, "net": 8.8, "liquidity": 156.7}
    ]
    
    projection = [
        {"month": "Oct", "inflow": 60.5, "outflow": 51.0, "net": 9.5, "liquidity": 166.2},
        {"month": "Nov", "inflow": 62.0, "outflow": 53.4, "net": 8.6, "liquidity": 174.8},
        {"month": "Dec", "inflow": 65.0, "outflow": 56.0, "net": 9.0, "liquidity": 183.8}
    ]
    
    return {
        "current_liquidity": 156.7, # Millions
        "available_credit": 45.0,
        "net_monthly_flow": 8.8,
        "historical": historical,
        "projection": projection
    }
