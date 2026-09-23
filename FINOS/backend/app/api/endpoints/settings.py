from fastapi import APIRouter, Body
from typing import Dict, Any

current_settings = {
    "market_mode": "SIMULATION",
    "alpha_vantage_key": "",
    "finnhub_key": "",
    "simulation_speed_ms": 1000,
    "risk_threshold_high": 75.0,
    "risk_threshold_critical": 90.0,
    "theme": "dark"
}

router = APIRouter()

@router.get("/")
def get_settings():
    return current_settings

@router.post("/")
def update_settings(payload: Dict[str, Any] = Body(...)):
    global current_settings
    current_settings.update(payload)
    return {"status": "SUCCESS", "message": "Settings updated successfully", "settings": current_settings}
