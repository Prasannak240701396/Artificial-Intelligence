from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional
from app.core.database import get_db
from app.models.models import AuditLog

router = APIRouter()

@router.get("/")
def get_audit_trail(
    db: Session = Depends(get_db),
    query: Optional[str] = None,
    risk: Optional[str] = None,
    skip: int = 0,
    limit: int = 50
):
    q = db.query(AuditLog)
    if query:
        search = f"%{query}%"
        q = q.filter(
            (AuditLog.user_or_agent.like(search)) |
            (AuditLog.action.like(search)) |
            (AuditLog.entity_type.like(search)) |
            (AuditLog.entity_id.like(search))
        )
    if risk:
        q = q.filter(AuditLog.risk_rating == risk)

    total = q.count()
    logs = q.order_by(desc(AuditLog.timestamp)).offset(skip).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": l.id,
                "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "user_or_agent": l.user_or_agent,
                "action": l.action,
                "entity_type": l.entity_type,
                "entity_id": l.entity_id,
                "previous_value": l.previous_value,
                "new_value": l.new_value,
                "risk_rating": l.risk_rating,
                "result": l.result
            } for l in logs
        ]
    }
