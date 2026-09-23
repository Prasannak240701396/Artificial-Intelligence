import time
from typing import Dict, List, Any

class FinancialLogicEngine:
    """
    Financial Policy Rule Engine.
    Executes declarative IF-THEN financial rules for compliance, risk flagging, and approval routing.
    """
    def __init__(self):
        self.rules = [
            {
                "id": "RULE_001",
                "name": "High Value Transaction Threshold",
                "condition": lambda tx, acc, dept: tx.get("amount", 0) > 100000.0,
                "action": "FLAG_FOR_REVIEW",
                "risk_penalty": 30.0,
                "description": "Transactions over $100,000 require senior auditor authorization."
            },
            {
                "id": "RULE_002",
                "name": "Budget Depletion Warning",
                "condition": lambda tx, acc, dept: dept.get("spent_budget", 0) + tx.get("amount", 0) > dept.get("allocated_budget", 1) * 0.90,
                "action": "BUDGET_WARNING",
                "risk_penalty": 25.0,
                "description": "Transaction causes department spending to exceed 90% of allocated budget."
            },
            {
                "id": "RULE_003",
                "name": "Off-Hours Transaction Spike",
                "condition": lambda tx, acc, dept: tx.get("hour", 12) < 6 or tx.get("hour", 12) > 22,
                "action": "SUSPICIOUS_TIMING",
                "risk_penalty": 20.0,
                "description": "Transaction initiated outside normal operational business hours."
            },
            {
                "id": "RULE_004",
                "name": "Rapid Repetitive Disbursement",
                "condition": lambda tx, acc, dept: tx.get("frequency_count_1h", 0) > 5,
                "action": "VELOCITY_EXCEEDED",
                "risk_penalty": 35.0,
                "description": "More than 5 disbursements initiated within 60 minutes."
            },
            {
                "id": "RULE_005",
                "name": "Unregistered Counterparty Destination",
                "condition": lambda tx, acc, dept: tx.get("is_counterparty_verified", True) is False,
                "action": "UNVERIFIED_COUNTERPARTY",
                "risk_penalty": 40.0,
                "description": "Destination counterparty is not on the approved vendor whitelist."
            }
        ]

    def evaluate(self, transaction: Dict[str, Any], account: Dict[str, Any] = None, department: Dict[str, Any] = None) -> Dict[str, Any]:
        start_time = time.time()
        account = account or {}
        department = department or {"allocated_budget": 5000000.0, "spent_budget": 4200000.0}

        triggered_rules = []
        cumulative_risk = 5.0 # Baseline risk score

        for rule in self.rules:
            try:
                if rule["condition"](transaction, account, department):
                    triggered_rules.append({
                        "rule_id": rule["id"],
                        "rule_name": rule["name"],
                        "action": rule["action"],
                        "penalty": rule["risk_penalty"],
                        "description": rule["description"]
                    })
                    cumulative_risk += rule["risk_penalty"]
            except Exception as e:
                pass

        final_risk_score = min(100.0, cumulative_risk)
        compliance_status = "PASS"
        if final_risk_score >= 80:
            compliance_status = "CRITICAL_FLAG"
        elif final_risk_score >= 50:
            compliance_status = "REVIEW_REQUIRED"
        elif final_risk_score >= 25:
            compliance_status = "ELEVATED_MONITORING"

        exec_time = (time.time() - start_time) * 1000

        return {
            "algorithm": "Rule-Based Financial Logic Engine",
            "transaction_evaluated": transaction.get("transaction_code", "TX_SAMPLE"),
            "evaluated_amount": transaction.get("amount", 0.0),
            "total_rules_evaluated": len(self.rules),
            "triggered_rules": triggered_rules,
            "calculated_risk_score": final_risk_score,
            "compliance_status": compliance_status,
            "execution_time_ms": round(exec_time, 3)
        }

if __name__ == "__main__":
    engine = FinancialLogicEngine()
    sample_tx = {"transaction_code": "TX_9901", "amount": 150000.0, "hour": 3, "frequency_count_1h": 6, "is_counterparty_verified": False}
    print("Logic Engine Output:", engine.evaluate(sample_tx))
