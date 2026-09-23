from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Transaction, Department, Account, AuditLog
import csv
import io

router = APIRouter()

@router.get("/")
def get_reports_list():
    return [
        {"id": "REP_001", "title": "Monthly Financial Intelligence Executive Summary", "type": "Monthly Financial Report", "period": "Q3 2026", "status": "READY"},
        {"id": "REP_002", "title": "Departmental Budget Allocation & Utilization Audit", "type": "Budget Report", "period": "FY 2026", "status": "READY"},
        {"id": "REP_003", "title": "Cash Flow Liquidity Projection & Solvency Risk", "type": "Cash Flow Report", "period": "Q3-Q4 2026", "status": "READY"},
        {"id": "REP_004", "title": "High Risk Anomaly & Policy Violation Audit Log", "type": "Risk Report", "period": "Last 30 Days", "status": "READY"},
        {"id": "REP_005", "title": "Agentic AI Reasoning & Decision Provenance Report", "type": "Agent Activity Report", "period": "Active Session", "status": "READY"}
    ]

@router.get("/export/csv/{report_id}")
def export_report_csv(report_id: str, db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)

    if report_id == "REP_002":
        # Department Budget CSV
        writer.writerow(["Department Code", "Department Name", "Manager", "Allocated Budget ($)", "Spent Budget ($)", "Risk Level"])
        depts = db.query(Department).all()
        for d in depts:
            writer.writerow([d.code, d.name, d.manager, d.allocated_budget, d.spent_budget, d.risk_level])
    else:
        # Transactions CSV
        writer.writerow(["Transaction Code", "Category", "Amount ($)", "Currency", "Risk Score", "Status", "Timestamp", "Counterparty"])
        txs = db.query(Transaction).limit(100).all()
        for t in txs:
            writer.writerow([t.transaction_code, t.category, t.amount, t.currency, t.risk_score, t.status, t.timestamp, t.counterparty])

    content = output.getvalue()
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=FINOS_Report_{report_id}.csv"}
    )
