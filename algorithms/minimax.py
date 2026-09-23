import time
from typing import Dict, List, Any

class CapitalMinimax:
    """
    Minimax Game-Theoretic Portfolio Strategy Solver.
    Maximizes minimum expected capital performance against adversary market scenarios (Bull, Stagnant, Bear, Volatile Crash).
    """
    def __init__(self):
        # Strategies (Max Player: FINOS Capital Allocator)
        self.strategies = [
            "Conservative Cash Escrow",
            "Balanced Treasury Mix",
            "Aggressive Yield Growth",
            "Hedging Derivative Shield"
        ]
        
        # Market States (Min Player: Adversarial Market Condition)
        self.market_scenarios = [
            "Bull Market",
            "Neutral Stagnation",
            "Moderate Recession",
            "Severe Volatility Crash"
        ]
        
        # Payoff Matrix: Expected Return %
        self.payoff_matrix = {
            "Conservative Cash Escrow": [3.5, 3.2, 3.0, 2.5],
            "Balanced Treasury Mix": [8.5, 5.0, 1.2, -4.5],
            "Aggressive Yield Growth": [18.0, 6.0, -12.0, -28.0],
            "Hedging Derivative Shield": [6.0, 4.5, 4.0, 1.5]
        }

    def solve(self) -> Dict[str, Any]:
        start_time = time.time()
        
        min_payoffs = {}
        for strat, payoffs in self.payoff_matrix.items():
            # Worst case market scenario payoff for this strategy
            min_payoffs[strat] = min(payoffs)

        # Minimax choice: Strategy with highest worst-case payoff
        best_strategy = max(min_payoffs, key=min_payoffs.get)
        optimal_worst_case_return = min_payoffs[best_strategy]

        decision_tree = []
        for strat, payoffs in self.payoff_matrix.items():
            branch = {
                "strategy": strat,
                "scenarios": [
                    {"scenario": self.market_scenarios[i], "return_pct": payoffs[i]}
                    for i in range(len(self.market_scenarios))
                ],
                "worst_case_return": min(payoffs)
            }
            decision_tree.append(branch)

        exec_time = (time.time() - start_time) * 1000

        return {
            "algorithm": "Minimax Capital Strategy Optimization",
            "evaluated_strategies": len(self.strategies),
            "market_scenarios_evaluated": len(self.market_scenarios),
            "decision_tree": decision_tree,
            "optimal_strategy": best_strategy,
            "minimax_value": optimal_worst_case_return,
            "execution_time_ms": round(exec_time, 3)
        }

if __name__ == "__main__":
    mm = CapitalMinimax()
    print("Minimax Output:", mm.solve())
