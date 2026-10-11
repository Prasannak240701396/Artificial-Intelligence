from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.core.database import get_db
from app.models.models import ProjectDispatch, EmailLog, AuditLog

router = APIRouter()

class EmailLogSchema(BaseModel):
    id: int
    project_id: Optional[int] = None
    sender_name: str
    sender_email: str
    sender_role: str
    sender_batch: str
    recipient_name: str
    recipient_email: str
    recipient_role: str
    subject: str
    body_text: str
    estimated_amount: float
    dispatch_status: str
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

class ProjectDispatchSchema(BaseModel):
    id: int
    project_code: str
    title: str
    location: str
    estimated_amount: float
    description: str
    current_tier: str
    status: str
    created_by_name: str
    created_by_email: str
    created_by_batch: str
    timestamp: datetime
    model_config = ConfigDict(from_attributes=True)

class ForwardDispatchPayload(BaseModel):
    project_id: int
    sender_name: str
    sender_email: str
    sender_role: str
    sender_batch: str
    notes: Optional[str] = None

@router.get("/", response_model=List[ProjectDispatchSchema])
def get_dispatches(db: Session = Depends(get_db)):
    return db.query(ProjectDispatch).order_by(ProjectDispatch.timestamp.desc()).all()

@router.get("/emails", response_model=List[EmailLogSchema])
def get_email_logs(db: Session = Depends(get_db)):
    return db.query(EmailLog).order_by(EmailLog.timestamp.desc()).all()

@router.post("/forward")
def forward_project(payload: ForwardDispatchPayload, db: Session = Depends(get_db)):
    project = db.query(ProjectDispatch).filter(ProjectDispatch.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project dispatch not found")
    
    # Hierarchy definition
    hierarchy_map = {
        "CEO": ("DIRECTOR", "Higher Official / Regional Director", "Ananya Roy", "director.infra@finos.gov.in", "BATCH-2026-7732"),
        "DIRECTOR": ("MANAGER", "Project Operations Manager", "Rahul Verma", "manager.projects@finos.gov.in", "BATCH-2026-6611"),
        "MANAGER": ("SITE_EMPLOYEE", "Site Execution Team Lead", "Priya Nair", "site.lead@finos.gov.in", "BATCH-2026-5544"),
        "SITE_EMPLOYEE": ("COMPLETED", "Chief Audit Committee", "Audit Bureau", "audit@finos.gov.in", "BATCH-2026-1000")
    }

    current = project.current_tier
    if current not in hierarchy_map:
        raise HTTPException(status_code=400, detail="Project workflow is already completed")

    next_tier, next_role_name, next_recipient_name, next_recipient_email, next_recipient_batch = hierarchy_map[current]

    project.current_tier = next_tier
    if next_tier == "COMPLETED":
        project.status = "FULLY_DISPATCHED_AND_EXECUTED"
    else:
        project.status = f"FORWARDED_TO_{next_tier}"

    # Generate email text
    body = (
        f"OFFICIAL HIERARCHICAL DISPATCH NOTICE\n\n"
        f"Dear {next_recipient_name} ({next_role_name}),\n\n"
        f"We have approved the infrastructure/construction project proposal '{project.title}' (Code: {project.project_code}).\n"
        f"• Location: {project.location}\n"
        f"• Total Estimated Budget: ₹{project.estimated_amount:,.2f} Cr\n\n"
        f"Official Instructions & Notes:\n"
        f"{payload.notes or project.description}\n\n"
        f"Please acknowledge receipt, review the allocation breakdown, and dispatch the work order down to the next team tier immediately.\n\n"
        f"Sender Details:\n"
        f"Name: {payload.sender_name}\n"
        f"Role: {payload.sender_role}\n"
        f"Email: {payload.sender_email}\n"
        f"Batch ID: {payload.sender_batch}\n"
        f"Timestamp: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}"
    )

    email = EmailLog(
        project_id=project.id,
        sender_name=payload.sender_name,
        sender_email=payload.sender_email,
        sender_role=payload.sender_role,
        sender_batch=payload.sender_batch,
        recipient_name=next_recipient_name,
        recipient_email=next_recipient_email,
        recipient_role=next_role_name,
        subject=f"[FINOS DISPATCH #{project.project_code}] Construction Project Approval - {project.title}",
        body_text=body,
        estimated_amount=project.estimated_amount,
        dispatch_status="SENT"
    )
    db.add(email)

    audit = AuditLog(
        user_or_agent=payload.sender_name,
        action=f"FORWARDED_DISPATCH_TO_{next_tier}",
        entity_type="PROJECT_DISPATCH",
        entity_id=project.project_code,
        previous_value=current,
        new_value=next_tier,
        risk_rating="LOW",
        result="SUCCESS"
    )
    db.add(audit)
    db.commit()

    return {"message": "Dispatch forwarded and email generated successfully", "next_tier": next_tier}
