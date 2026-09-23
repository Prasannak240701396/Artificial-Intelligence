from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import Optional, List
from app.core.database import get_db
from app.models.models import Transaction, Department, Account, AuditLog
from app.schemas.schemas import TransactionResponse, TransactionCreate
from datetime import datetime

router = APIRouter()

@router.get("/")
def get_transactions(
    db: Session = Depends(get_db),
    query: Optional[str] = None,
    department_id: Optional[int] = None,
    status: Optional[str] = None,
    risk_min: Optional[float] = None,
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    q = db.query(Transaction)

    if query:
        search_pattern = f"%{query}%"
        q = q.filter(
            or_(
                Transaction.transaction_code.like(search_pattern),
                Transaction.counterparty.like(search_pattern),
                Transaction.description.like(search_pattern),
                Transaction.category.like(search_pattern)
            )
        )

    if department_id:
        q = q.filter(Transaction.department_id == department_id)
    if status:
        q = q.filter(Transaction.status == status)
    if risk_min is not None:
        q = q.filter(Transaction.risk_score >= risk_min)
    if category:
        q = q.filter(Transaction.category == category)

    total_count = q.count()
    items = q.order_by(desc(Transaction.timestamp)).offset(skip).limit(limit).all()

    # Format result with department name
    results = []
    for tx in items:
        dept = db.query(Department).filter(Department.id == tx.department_id).first()
        results.append({
            "id": tx.id,
            "transaction_code": tx.transaction_code,
            "account_id": tx.account_id,
            "department_id": tx.department_id,
            "department_name": dept.name if dept else "General Treasury",
            "category": tx.category,
            "amount": tx.amount,
            "currency": tx.currency,
            "transaction_type": tx.transaction_type,
            "risk_score": tx.risk_score,
            "status": tx.status,
            "timestamp": tx.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "description": tx.description,
            "counterparty": tx.counterparty,
            "anomaly_reason": tx.anomaly_reason
        })

    return {
        "total": total_count,
        "skip": skip,
        "limit": limit,
        "items": results
    }

@router.get("/{tx_id}")
def get_transaction_detail(tx_id: int, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter(Transaction.id == tx_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    dept = db.query(Department).filter(Department.id == tx.department_id).first()
    account = db.query(Account).filter(Account.id == tx.account_id).first()
    audits = db.query(AuditLog).filter(AuditLog.entity_id == tx.transaction_code).all()

    return {
        "transaction": {
            "id": tx.id,
            "transaction_code": tx.transaction_code,
            "category": tx.category,
            "amount": tx.amount,
            "currency": tx.currency,
            "transaction_type": tx.transaction_type,
            "risk_score": tx.risk_score,
            "status": tx.status,
            "timestamp": tx.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "description": tx.description,
            "counterparty": tx.counterparty,
            "anomaly_reason": tx.anomaly_reason
        },
        "department": {"id": dept.id, "name": dept.name, "code": dept.code} if dept else None,
        "account": {"id": account.id, "name": account.account_name, "number": account.account_number} if account else None,
        "audits": [
            {
                "timestamp": a.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "user_or_agent": a.user_or_agent,
                "action": a.action,
                "result": a.result
            } for a in audits
        ]
    }
