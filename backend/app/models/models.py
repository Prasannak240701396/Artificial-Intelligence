from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="ANALYST") # ADMIN, FINANCE_MANAGER, ANALYST, AUDITOR, VIEWER
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    allocated_budget = Column(Float, default=0.0)
    spent_budget = Column(Float, default=0.0)
    manager = Column(String, nullable=True)
    risk_level = Column(String, default="LOW")
    created_at = Column(DateTime, default=datetime.utcnow)

class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String, unique=True, index=True)
    account_name = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    balance = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    account_type = Column(String, default="OPERATIONAL") # OPERATIONAL, RESERVE, ESCROW, TREASURY
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    fiscal_year = Column(Integer, default=2026)
    allocated_amount = Column(Float, default=0.0)
    committed_amount = Column(Float, default=0.0)
    spent_amount = Column(Float, default=0.0)
    remaining_amount = Column(Float, default=0.0)
    utilization_pct = Column(Float, default=0.0)
    status = Column(String, default="ON_TRACK") # ON_TRACK, WARNING, EXCEEDED
    created_at = Column(DateTime, default=datetime.utcnow)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_code = Column(String, unique=True, index=True)
    account_id = Column(Integer, ForeignKey("accounts.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    category = Column(String, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    transaction_type = Column(String) # DEBIT, CREDIT
    risk_score = Column(Float, default=0.0)
    status = Column(String, default="Completed") # Completed, Pending, Flagged, Under Review, Failed
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    description = Column(Text, nullable=True)
    counterparty = Column(String, nullable=True)
    anomaly_reason = Column(String, nullable=True)

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    payment_code = Column(String, unique=True, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    source_account = Column(String, nullable=False)
    destination_account = Column(String, nullable=False)
    scheduled_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="PENDING") # PENDING, APPROVED, REJECTED, EXECUTED
    risk_score = Column(Float, default=0.0)
    category = Column(String, default="Vendor Disbursement")

class CashFlow(Base):
    __tablename__ = "cash_flows"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    inflow = Column(Float, default=0.0)
    outflow = Column(Float, default=0.0)
    net_flow = Column(Float, default=0.0)
    available_liquidity = Column(Float, default=0.0)
    projection_tag = Column(String, default="ACTUAL") # ACTUAL, FORECAST

class MarketAsset(Base):
    __tablename__ = "market_assets"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    asset_type = Column(String, default="INDEX") # INDEX, FOREX, COMMODITY, CRYPTO, EQUITY
    price = Column(Float, nullable=False)
    change_amount = Column(Float, default=0.0)
    change_pct = Column(Float, default=0.0)
    high_24h = Column(Float, default=0.0)
    low_24h = Column(Float, default=0.0)
    volume = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)

class MarketTick(Base):
    __tablename__ = "market_ticks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    price = Column(Float, nullable=False)
    volume = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

class PortfolioPosition(Base):
    __tablename__ = "portfolio_positions"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    asset_name = Column(String, nullable=False)
    quantity = Column(Float, default=0.0)
    avg_buy_price = Column(Float, default=0.0)
    current_price = Column(Float, default=0.0)
    market_value = Column(Float, default=0.0)
    unrealized_pnl = Column(Float, default=0.0)
    allocation_pct = Column(Float, default=0.0)

class RiskEvent(Base):
    __tablename__ = "risk_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    event_type = Column(String, nullable=False)
    severity = Column(String, default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    risk_score = Column(Float, default=0.0)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    entity_id = Column(String, nullable=True)
    status = Column(String, default="OPEN")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    alert_type = Column(String, nullable=False)
    level = Column(String, default="WARNING") # INFO, WARNING, ERROR, CRITICAL
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    department_id = Column(Integer, nullable=True)

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String, index=True) # REVENUE, EXPENSE, CASH_FLOW, BUDGET_UTILIZATION
    forecast_date = Column(DateTime, nullable=False)
    actual_value = Column(Float, nullable=True)
    forecast_value = Column(Float, nullable=False)
    lower_bound = Column(Float, nullable=False)
    upper_bound = Column(Float, nullable=False)
    confidence = Column(Float, default=0.95)
    model_used = Column(String, default="EXPONENTIAL_SMOOTHING")

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String, unique=True, index=True)
    status = Column(String, default="ACTIVE") # ACTIVE, IDLE, WAITING, WARNING, ERROR
    current_task = Column(String, nullable=True)
    last_run = Column(DateTime, default=datetime.utcnow)
    confidence = Column(Float, default=0.95)
    risk_rating = Column(Float, default=12.0)
    events_processed = Column(Integer, default=0)
    execution_time_ms = Column(Float, default=45.0)

class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    agent_name = Column(String, index=True)
    log_level = Column(String, default="INFO")
    message = Column(Text, nullable=False)
    details = Column(String, nullable=True)

class AgentDecision(Base):
    __tablename__ = "agent_decisions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    agent_name = Column(String, index=True)
    decision_type = Column(String, nullable=False)
    recommendation = Column(Text, nullable=False)
    impact_score = Column(Float, default=0.0)
    status = Column(String, default="APPROVED")

class AlgorithmRun(Base):
    __tablename__ = "algorithm_runs"

    id = Column(Integer, primary_key=True, index=True)
    algorithm_name = Column(String, index=True)
    input_params = Column(String, nullable=True)
    execution_time_ms = Column(Float, default=0.0)
    output_summary = Column(Text, nullable=True)
    status = Column(String, default="SUCCESS")
    timestamp = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    user_or_agent = Column(String, nullable=False)
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=True)
    previous_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    risk_rating = Column(String, default="LOW")
    result = Column(String, default="SUCCESS")

class SystemEvent(Base):
    __tablename__ = "system_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    component = Column(String, index=True)
    metric_name = Column(String, nullable=False)
    metric_value = Column(Float, nullable=False)
    status = Column(String, default="HEALTHY")

class FinancialReport(Base):
    __tablename__ = "financial_reports"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    report_type = Column(String, index=True)
    date_range = Column(String, default="Q3 2026")
    generated_by = Column(String, default="System Agent")
    file_path = Column(String, nullable=True)
    status = Column(String, default="GENERATED")
    timestamp = Column(DateTime, default=datetime.utcnow)
