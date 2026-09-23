from fastapi import APIRouter
from app.services.market_provider import get_market_provider

router = APIRouter()

@router.get("/assets")
def get_market_assets():
    provider = get_market_provider()
    return {
        "mode": provider.get_mode(),
        "assets": provider.get_market_pulse()
    }
