from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.core.database import get_db
from app.models.models import AgentRun, AgentMessage, AgentDecision, AuditLog
from agents.agent_definitions import AGENTS_CONFIG
from agents.engine import agent_engine

router = APIRouter()

@router.get("/")
def get_agents(db: Session = Depends(get_db)):
    runs = db.query(AgentRun).all()
    if not runs:
        return AGENTS_CONFIG
    
    results = []
    for r in runs:
        results.append({
            "id": r.id,
            "name": r.agent_name,
            "status": r.status,
            "current_task": r.current_task,
            "last_run": r.last_run.strftime("%Y-%m-%d %H:%M:%S"),
            "confidence": r.confidence,
            "risk_rating": r.risk_rating,
            "events_processed": r.events_processed,
            "execution_time_ms": r.execution_time_ms
        })
    return results

@router.get("/timeline")
def get_agent_timeline(db: Session = Depends(get_db)):
    messages = db.query(AgentMessage).order_by(desc(AgentMessage.timestamp)).limit(30).all()
    return [
        {
            "id": m.id,
            "timestamp": m.timestamp.strftime("%H:%M:%S"),
            "agent_name": m.agent_name,
            "log_level": m.log_level,
            "message": m.message,
            "details": m.details
        } for m in messages
    ]

@router.post("/trigger")
def trigger_agent_step(db: Session = Depends(get_db)):
    event = agent_engine.step()
    
    # Save log to DB
    msg = AgentMessage(
        agent_name=event["agent_name"],
        log_level="INFO",
        message=f"[{event['stage']}] {event['message']}",
        details=f"Confidence: {event['confidence']} | Stage: {event['stage']}"
    )
    db.add(msg)
    
    audit = AuditLog(
        user_or_agent=event["agent_name"],
        action=f"WORKFLOW_STEP_{event['stage']}",
        entity_type="AGENTIC_ENGINE",
        entity_id=event["agent_name"],
        previous_value=f"Stage: {event['stage']}",
        new_value=event["message"],
        risk_rating="LOW",
        result="SUCCESS"
    )
    db.add(audit)
    db.commit()

    return event
