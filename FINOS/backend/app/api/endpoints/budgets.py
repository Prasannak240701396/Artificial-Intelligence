from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Department, Budget

router = APIRouter()

@router.get("/")
def get_budgets(db: Session = Depends(get_db)):
    depts = db.query(Department).all()
    results = []
    for d in depts:
        budget = db.query(Budget).filter(Budget.department_id == d.id).first()
        results.append({
            "department_id": d.id,
            "department_code": d.code,
            "department_name": d.name,
            "allocated_budget": d.allocated_budget,
            "spent_budget": d.spent_budget,
            "remaining_budget": d.allocated_budget - d.spent_budget,
            "utilization_pct": round((d.spent_budget / d.allocated_budget * 100.0), 2) if d.allocated_budget > 0 else 0.0,
            "manager": d.manager,
            "risk_level": d.risk_level,
            "status": budget.status if budget else "ON_TRACK"
        })
    return results
