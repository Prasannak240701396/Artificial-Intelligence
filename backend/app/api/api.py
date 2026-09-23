from fastapi import APIRouter
from app.api.endpoints import (
    auth, dashboard, market, transactions, budgets, cash_flow,
    risk, forecasting, planner, agents, algorithms, reports,
    audit, system, settings
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
api_router.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])
api_router.include_router(cash_flow.router, prefix="/cash-flow", tags=["Cash Flow"])
api_router.include_router(risk.router, prefix="/risk", tags=["Risk Analytics"])
api_router.include_router(forecasting.router, prefix="/forecasting", tags=["Forecasting"])
api_router.include_router(planner.router, prefix="/planner", tags=["AI Planner"])
api_router.include_router(agents.router, prefix="/agents", tags=["Agent Control Center"])
api_router.include_router(algorithms.router, prefix="/algorithms", tags=["Algorithm Lab"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(audit.router, prefix="/audit", tags=["Audit Trail"])
api_router.include_router(system.router, prefix="/system", tags=["System Monitoring"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
