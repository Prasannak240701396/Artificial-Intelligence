from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from algorithms.forecasting import FinancialForecaster

router = APIRouter()

@router.get("/")
def get_forecasting_data(periods: int = 6, db: Session = Depends(get_db)):
    forecaster = FinancialForecaster()
    result = forecaster.forecast(periods_ahead=periods)
    return result
