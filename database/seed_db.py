import sys
import os
import random
from datetime import datetime, timedelta

# Ensure backend and workspace root are in pythonpath
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models.models import (
    User, Department, Account, Budget, Transaction, Payment,
    CashFlow, MarketAsset, MarketTick, PortfolioPosition, RiskEvent,
    Alert, Forecast, AgentRun, AgentMessage, AgentDecision,
    AlgorithmRun, AuditLog, SystemEvent, FinancialReport
)
from agents.agent_definitions import AGENTS_CONFIG

def seed_database():
    print("Initializing FINOS Database Schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        print("Seeding Initial Users...")
        users = [
            User(email="admin@finos.org", full_name="Chief Executive Auditor", hashed_password=get_password_hash("admin123"), role="ADMIN"),
            User(email="manager@finos.org", full_name="Treasury Operations Manager", hashed_password=get_password_hash("manager123"), role="FINANCE_MANAGER"),
            User(email="analyst@finos.org", full_name="Senior Financial Risk Analyst", hashed_password=get_password_hash("analyst123"), role="ANALYST"),
            User(email="auditor@finos.org", full_name="Compliance Auditor", hashed_password=get_password_hash("auditor123"), role="AUDITOR")
        ]
        db.add_all(users)
        db.commit()

        print("Seeding Departments & Accounts...")
        depts_data = [
            ("DEP_PW", "Public Works", 25000000.0, 18450000.0, "Dr. Robert Vance", "LOW"),
            ("DEP_HL", "Health & Human Services", 35000000.0, 29800000.0, "Sarah Jenkins", "MEDIUM"),
            ("DEP_ED", "Education & Research", 20000000.0, 14200000.0, "Prof. Arthur Pendelton", "LOW"),
            ("DEP_RD", "Rural Development", 15000000.0, 11900000.0, "Maria Gomez", "HIGH"),
            ("DEP_TR", "Transport & Infrastructure", 30000000.0, 26100000.0, "David Sterling", "HIGH"),
            ("DEP_EN", "Energy & Clean Power", 18000000.0, 12500000.0, "Elena Rostova", "LOW"),
            ("DEP_IT", "Information Technology", 12000000.0, 9800000.0, "Marcus Brody", "MEDIUM"),
            ("DEP_HS", "Housing & Urban Planning", 16000000.0, 13400000.0, "Anita Desai", "MEDIUM"),
            ("DEP_DF", "Defense & Internal Security", 40000000.0, 31200000.0, "Gen. Thomas Croft", "CRITICAL"),
            ("DEP_AG", "Agriculture & Food Security", 14000000.0, 8900000.0, "Vikram Patel", "LOW")
        ]

        db_depts = []
        for code, name, alloc, spent, mgr, risk in depts_data:
            d = Department(code=code, name=name, allocated_budget=alloc, spent_budget=spent, manager=mgr, risk_level=risk)
            db.add(d)
            db_depts.append(d)
        db.commit()

        print("Seeding Department Budgets & Accounts...")
        db_accounts = []
        for d in db_depts:
            # Create Budget
            rem = d.allocated_budget - d.spent_budget
            util = (d.spent_budget / d.allocated_budget) * 100.0
            b_status = "ON_TRACK" if util < 85 else ("WARNING" if util < 95 else "EXCEEDED")
            budget = Budget(
                department_id=d.id,
                fiscal_year=2026,
                allocated_amount=d.allocated_budget,
                committed_amount=d.spent_budget * 0.9,
                spent_amount=d.spent_budget,
                remaining_amount=rem,
                utilization_pct=round(util, 2),
                status=b_status
            )
            db.add(budget)

            # Create 2 Accounts per Department
            acc1 = Account(
                account_number=f"ACC-{d.code}-01",
                account_name=f"{d.name} Primary Operating",
                department_id=d.id,
                balance=round(rem * 0.6, 2),
                currency="USD",
                account_type="OPERATIONAL",
                status="ACTIVE"
            )
            acc2 = Account(
                account_number=f"ACC-{d.code}-02",
                account_name=f"{d.name} Reserve Escrow",
                department_id=d.id,
                balance=round(rem * 0.4, 2),
                currency="USD",
                account_type="RESERVE",
                status="ACTIVE"
            )
            db.add_all([acc1, acc2])
            db_accounts.extend([acc1, acc2])

        db.commit()

        print("Seeding 120+ Financial Transactions...")
        categories = [
            "Infrastructure Grant", "Medical Equipment Procurement", "School Digital Upgrade",
            "Rural Road Asphalt", "Bridge Maintenance", "Substation Transformer",
            "Cloud Data Center Hosting", "Affordable Housing Grant", "Emergency Medical Supplies",
            "Solar Grid Installation", "Staff Payroll", "Vendor Software Licensing"
        ]
        counterparties = [
            "Apex Infrastructure Corp", "BioHealth MedTech Ltd", "EduTech Global Systems",
            "National Paving Industries", "Titan Engineering Solutions", "PowerGrid Energy Systems",
            "CloudScale Networks Inc", "Metropolitan Construction Group", "PharmaSupply Direct",
            "SunRay Solar Holdings", "Global Logistics Partners", "OmniCorp Services"
        ]

        now = datetime.utcnow()
        transactions = []
        for i in range(1, 125):
            dept = random.choice(db_depts)
            acc = random.choice([a for a in db_accounts if a.department_id == dept.id])
            cat = random.choice(categories)
            cp = random.choice(counterparties)

            # Generate varying amounts & anomaly risks
            is_anomaly = (i % 11 == 0)
            amount = round(random.uniform(500000.0, 3500000.0) if is_anomaly else random.uniform(12000.0, 240000.0), 2)
            risk_score = round(random.uniform(75.0, 95.0) if is_anomaly else random.uniform(5.0, 35.0), 1)

            status = "Completed"
            reason = None
            if risk_score > 85:
                status = "Flagged"
                reason = "Amount significantly above 3-sigma historical baseline & unusual timing"
            elif risk_score > 70:
                status = "Under Review"
                reason = "Department budget threshold approaching limit (>90%)"
            elif i % 17 == 0:
                status = "Pending"

            tx_time = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23), minutes=random.randint(0, 59))

            tx = Transaction(
                transaction_code=f"TX-2026-{1000 + i}",
                account_id=acc.id,
                department_id=dept.id,
                category=cat,
                amount=amount,
                currency="USD",
                transaction_type="DEBIT" if i % 6 != 0 else "CREDIT",
                risk_score=risk_score,
                status=status,
                timestamp=tx_time,
                description=f"Disbursement for {cat} - Ref #{1000+i}",
                counterparty=cp,
                anomaly_reason=reason
            )
            transactions.append(tx)

        db.add_all(transactions)
        db.commit()

        print("Seeding Market Assets & Portfolio Positions...")
        assets = [
            ("NIFTY 50", "Nifty 50 Index", "INDEX", 25340.50, 142.30, 0.56, 25410.00, 25210.00, 15400000.0),
            ("SENSEX", "BSE Sensex", "INDEX", 82890.20, 410.80, 0.50, 83100.00, 82500.00, 12200000.0),
            ("S&P 500", "S&P 500 Index", "INDEX", 5620.10, 28.40, 0.51, 5645.00, 5600.00, 48000000.0),
            ("NASDAQ", "Nasdaq Composite", "INDEX", 17680.40, 145.20, 0.83, 17750.00, 17580.00, 65000000.0),
            ("DOW JONES", "Dow Jones Industrial", "INDEX", 41390.80, -85.40, -0.21, 41500.00, 41300.00, 28000000.0),
            ("FTSE 100", "FTSE 100 Index", "INDEX", 8270.30, 18.20, 0.22, 8290.00, 8250.00, 19000000.0),
            ("NIKKEI 225", "Nikkei 225 Index", "INDEX", 37800.00, -210.00, -0.55, 38100.00, 37700.00, 31000000.0),
            ("USD/INR", "US Dollar / Indian Rupee", "FOREX", 83.85, 0.08, 0.10, 83.92, 83.78, 95000000.0),
            ("EUR/USD", "Euro / US Dollar", "FOREX", 1.1120, -0.0015, -0.13, 1.1145, 1.1105, 88000000.0),
            ("GOLD", "Gold Troy Ounce", "COMMODITY", 2580.40, 15.60, 0.61, 2595.00, 2568.00, 22000000.0),
            ("BRENT CRUDE", "Brent Crude Oil", "COMMODITY", 71.60, -1.20, -1.65, 73.20, 71.10, 35000000.0),
            ("BITCOIN", "Bitcoin / USD", "CRYPTO", 63200.00, 1850.00, 3.02, 64100.00, 61200.00, 140000000.0)
        ]

        for sym, name, atype, price, chg, pct, high, low, vol in assets:
            m = MarketAsset(
                symbol=sym, name=name, asset_type=atype, price=price,
                change_amount=chg, change_pct=pct, high_24h=high, low_24h=low,
                volume=vol, last_updated=now
            )
            db.add(m)

        portfolio_data = [
            ("US_TREASURY_30Y", "US 30-Yr Treasury Bonds", 150000.0, 98.50, 101.20, 15180000.0, 405000.0, 35.0),
            ("GOLD_BULLION", "Gold Reserve Bullion ETF", 4500.0, 2400.0, 2580.40, 11611800.0, 811800.0, 27.0),
            ("NIFTY_BEES", "Nifty Index ETF", 250000.0, 235.0, 253.40, 6335000.0, 460000.0, 15.0),
            ("LIQUID_FUND", "AAA Sovereign Money Market", 10000000.0, 1.0, 1.0, 10000000.0, 0.0, 23.0)
        ]
        for sym, name, qty, buy_p, cur_p, mkt_val, pnl, alloc in portfolio_data:
            p = PortfolioPosition(
                symbol=sym, asset_name=name, quantity=qty, avg_buy_price=buy_p,
                current_price=cur_p, market_value=mkt_val, unrealized_pnl=pnl, allocation_pct=alloc
            )
            db.add(p)

        db.commit()

        print("Seeding Agent Runs & Initial Activity Logs...")
        for cfg in AGENTS_CONFIG:
            agent_run = AgentRun(
                agent_name=cfg["name"],
                status=cfg["status"],
                current_task=cfg["task"],
                last_run=now,
                confidence=cfg["confidence"],
                risk_rating=cfg["risk_rating"],
                events_processed=random.randint(140, 920),
                execution_time_ms=round(random.uniform(12.0, 85.0), 1)
            )
            db.add(agent_run)

            msg = AgentMessage(
                timestamp=now - timedelta(minutes=random.randint(1, 45)),
                agent_name=cfg["name"],
                log_level="INFO" if cfg["risk_rating"] < 20 else "WARNING",
                message=f"Agent initialized successfully. Task: {cfg['task']}",
                details=f"Confidence: {cfg['confidence']} | Risk score: {cfg['risk_rating']}"
            )
            db.add(msg)

        print("Seeding System Audit Logs...")
        audit_events = [
            ("Chief Executive Auditor", "LOGIN", "USER", "USR-101", None, "User logged in with MFA", "LOW", "SUCCESS"),
            ("Policy Validation Agent", "EVALUATE_RULE", "TRANSACTION", "TX-2026-1011", "PENDING", "FLAGGED", "HIGH", "SUCCESS"),
            ("Budget Planning Agent", "REALLOCATE", "BUDGET", "DEP_HL", "Spent: $29.8M", "Adjusted cap +$2.5M", "MEDIUM", "SUCCESS"),
            ("Risk Detection Agent", "ISOLATION_FOREST_RUN", "ANOMALY_ENGINE", "ANOM-902", "Z-Score: 1.2", "Z-Score: 3.8", "HIGH", "SUCCESS"),
            ("System Admin", "CONFIG_UPDATE", "SETTINGS", "SYS-CFG", "Mode: SIMULATION", "Mode: SIMULATION", "LOW", "SUCCESS")
        ]
        for user, act, ent_type, ent_id, prev, new_val, risk, res in audit_events:
            log = AuditLog(
                user_or_agent=user, action=act, entity_type=ent_type, entity_id=ent_id,
                previous_value=prev, new_value=new_val, risk_rating=risk, result=res,
                timestamp=now - timedelta(minutes=random.randint(2, 120))
            )
            db.add(log)

        db.commit()
        print("Database Seed Successfully Completed!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
