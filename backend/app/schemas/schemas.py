from pydantic import BaseModel
from typing import Optional, List, Any, Dict
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "ANALYST"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Department Schemas
class DepartmentResponse(BaseModel):
    id: int
    code: str
    name: str
    allocated_budget: float
    spent_budget: float
    manager: Optional[str] = None
    risk_level: str
    created_at: datetime
    class Config:
        from_attributes = True

# Account Schemas
class AccountResponse(BaseModel):
    id: int
    account_number: str
    account_name: str
    department_id: Optional[int] = None
    balance: float
    currency: str
    account_type: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Budget Schemas
class BudgetResponse(BaseModel):
    id: int
    department_id: int
    fiscal_year: int
    allocated_amount: float
    committed_amount: float
    spent_amount: float
    remaining_amount: float
    utilization_pct: float
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# Transaction Schemas
class TransactionBase(BaseModel):
    account_id: int
    department_id: int
    category: str
    amount: float
    currency: str = "USD"
    transaction_type: str
    description: Optional[str] = None
    counterparty: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    transaction_code: str
    risk_score: float
    status: str
    timestamp: datetime
    anomaly_reason: Optional[str] = None
    class Config:
        from_attributes = True

# Market Asset Schemas
class MarketAssetResponse(BaseModel):
    id: int
    symbol: str
    name: str
    asset_type: str
    price: float
    change_amount: float
    change_pct: float
    high_24h: float
    low_24h: float
    volume: float
    last_updated: datetime
    class Config:
        from_attributes = True

# Agent Run Schemas
class AgentRunResponse(BaseModel):
    id: int
    agent_name: str
    status: str
    current_task: Optional[str] = None
    last_run: datetime
    confidence: float
    risk_rating: float
    events_processed: int
    execution_time_ms: float
    class Config:
        from_attributes = True

class AgentMessageResponse(BaseModel):
    id: int
    timestamp: datetime
    agent_name: str
    log_level: str
    message: str
    details: Optional[str] = None
    class Config:
        from_attributes = True

# Audit Log Schemas
class AuditLogResponse(BaseModel):
    id: int
    timestamp: datetime
    user_or_agent: str
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    previous_value: Optional[str] = None
    new_value: Optional[str] = None
    risk_rating: str
    result: str
    class Config:
        from_attributes = True

# Dashboard Overview Payload
class DashboardOverview(BaseModel):
    total_assets: float
    available_balance: float
    total_expenditure: float
    net_cash_flow: float
    pending_payments: float
    risk_exposure: float
    budget_utilization_pct: float
    market_index_summary: Dict[str, Any] = {}
