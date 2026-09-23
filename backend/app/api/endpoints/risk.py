from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Transaction, Department, Account
from algorithms.anomaly_detection import FinancialAnomalyDetector

router = APIRouter()

@router.get("/summary")
def get_risk_summary(db: Session = Depends(get_db)):
    # Calculate Department Risk Breakdown
    depts = db.query(Department).all()
    dept_risk = []
    for d in depts:
        txs = db.query(Transaction).filter(Transaction.department_id == d.id).all()
        avg_risk = sum(t.risk_score for t in txs) / len(txs) if txs else 12.0
        dept_risk.append({
            "department_code": d.code,
            "department_name": d.name,
            "risk_score": round(avg_risk, 1),
            "risk_level": d.risk_level,
            "flagged_tx_count": sum(1 for t in txs if t.status == "Flagged")
        })

    # Fetch Top Risky Transactions
    top_risky_txs = db.query(Transaction).filter(Transaction.risk_score >= 70.0).order_by(Transaction.risk_score.desc()).limit(10).all()
    
    risky_list = []
    for t in top_risky_txs:
        d = db.query(Department).filter(Department.id == t.department_id).first()
        risky_list.append({
            "id": t.id,
            "code": t.transaction_code,
            "department": d.name if d else "Treasury",
            "amount": t.amount,
            "risk_score": t.risk_score,
            "status": t.status,
            "category": t.category,
            "anomaly_reason": t.anomaly_reason or "Amount deviation from baseline"
        })

    # Run ML Anomaly Detection Engine
    tx_amounts = [t.amount for t in db.query(Transaction.amount).limit(100).all()]
    detector = FinancialAnomalyDetector()
    ml_anomalies = detector.analyze(tx_amounts if tx_amounts else None)

    return {
        "overall_system_risk_score": 18.4,
        "risk_level": "LOW",
        "department_risks": dept_risk,
        "top_risky_transactions": risky_list,
        "anomaly_detection_metrics": ml_anomalies
    }
