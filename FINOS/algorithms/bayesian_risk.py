import time
from typing import Dict, List, Any

class BayesianRiskModel:
    """
    Bayesian Inference Risk Engine.
    Computes P(High Risk | Evidence) using Bayes' Theorem:
    P(R|E) = P(E|R) * P(R) / P(E)
    """
    def __init__(self):
        # Prior probability of high risk in financial system
        self.prior_high_risk = 0.05 
        
        # Likelihoods: P(Evidence_i | High Risk) vs P(Evidence_i | Normal)
        self.evidence_likelihoods = {
            "amount_above_3std": {"P(E|R)": 0.70, "P(E|~R)": 0.05},
            "off_hours_timing": {"P(E|R)": 0.45, "P(E|~R)": 0.08},
            "budget_deviation_gt_20pct": {"P(E|R)": 0.60, "P(E|~R)": 0.10},
            "high_velocity_frequency": {"P(E|R)": 0.80, "P(E|~R)": 0.03},
            "new_unverified_counterparty": {"P(E|R)": 0.65, "P(E|~R)": 0.12}
        }

    def infer(self, active_evidence: List[str]) -> Dict[str, Any]:
        start_time = time.time()
        
        # Log-odds Bayesian updating to avoid numerical underflow
        prior = self.prior_high_risk
        p_risk = prior
        p_no_risk = 1.0 - prior

        evidence_breakdown = []

        for ev in active_evidence:
            if ev in self.evidence_likelihoods:
                p_e_given_r = self.evidence_likelihoods[ev]["P(E|R)"]
                p_e_given_nr = self.evidence_likelihoods[ev]["P(E|~R)"]

                # Update numerator and denominator
                p_risk = p_risk * p_e_given_r
                p_no_risk = p_no_risk * p_e_given_nr

                evidence_breakdown.append({
                    "evidence": ev,
                    "likelihood_given_risk": p_e_given_r,
                    "likelihood_given_normal": p_e_given_nr
                })

        # Normalize posterior probability
        total_p = p_risk + p_no_risk
        posterior_high_risk = p_risk / total_p if total_p > 0 else prior

        risk_score_0_100 = round(posterior_high_risk * 100.0, 2)
        risk_level = "LOW"
        if risk_score_0_100 >= 80:
            risk_level = "CRITICAL"
        elif risk_score_0_100 >= 50:
            risk_level = "HIGH"
        elif risk_score_0_100 >= 25:
            risk_level = "MEDIUM"

        exec_time = (time.time() - start_time) * 1000

        return {
            "algorithm": "Bayesian Probability Risk Model",
            "prior_high_risk_prob": self.prior_high_risk,
            "active_evidence_count": len(active_evidence),
            "evidence_details": evidence_breakdown,
            "posterior_high_risk_prob": round(posterior_high_risk, 4),
            "calculated_risk_score": risk_score_0_100,
            "risk_level": risk_level,
            "execution_time_ms": round(exec_time, 3)
        }

if __name__ == "__main__":
    bayes = BayesianRiskModel()
    evidence = ["amount_above_3std", "off_hours_timing", "high_velocity_frequency"]
    print("Bayesian Output:", bayes.infer(evidence))
