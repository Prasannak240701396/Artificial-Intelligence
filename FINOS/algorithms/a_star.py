import heapq
import time
from typing import Dict, List, Tuple, Any

class FinancialAStar:
    """
    A* Search Algorithm for Financial Allocation & Debt Restructuring.
    Finds the optimal step-by-step path from initial balance sheet state to target financial solvency.
    """
    def __init__(self):
        pass

    def heuristic(self, state: Tuple[float, float], goal: Tuple[float, float]) -> float:
        # Distance to goal state: (Remaining Debt, Target Savings)
        debt_diff = max(0.0, state[0] - goal[0])
        savings_diff = max(0.0, goal[1] - state[1])
        return debt_diff + savings_diff

    def run(self, initial_debt: float = 500000.0, initial_savings: float = 50000.0,
            target_debt: float = 0.0, target_savings: float = 200000.0) -> Dict[str, Any]:
        start_time = time.time()
        start_state = (initial_debt, initial_savings)
        goal_state = (target_debt, target_savings)

        # Actions: (Name, Debt Reduction, Savings Addition, Cost/Interest)
        actions = [
            ("Aggressive Debt Payoff", 50000.0, 5000.0, 5000.0),
            ("Balanced Allocation", 25000.0, 25000.0, 3000.0),
            ("High Yield Growth Focus", 10000.0, 45000.0, 2000.0),
            ("Conservative Liquidity Building", 5000.0, 30000.0, 1000.0)
        ]

        pq = []
        heapq.heappush(pq, (0 + self.heuristic(start_state, goal_state), 0, start_state, []))
        visited = set()

        solution_path = []
        total_cost = 0.0
        nodes_explored = 0

        while pq:
            f_score, g_score, current, path = heapq.heappop(pq)
            nodes_explored += 1

            if current[0] <= goal_state[0] and current[1] >= goal_state[1]:
                solution_path = path
                total_cost = g_score
                break

            state_key = (round(current[0], -3), round(current[1], -3))
            if state_key in visited:
                continue
            visited.add(state_key)

            if len(path) > 15: # Safety horizon depth limit
                continue

            for act_name, debt_red, sav_add, cost in actions:
                next_debt = max(0.0, current[0] - debt_red)
                next_sav = current[1] + sav_add
                next_g = g_score + cost
                next_f = next_g + self.heuristic((next_debt, next_sav), goal_state)
                heapq.heappush(pq, (next_f, next_g, (next_debt, next_sav), path + [
                    {"step": len(path) + 1, "action": act_name, "debt": next_debt, "savings": next_sav, "g_cost": next_g}
                ]))

        exec_time = (time.time() - start_time) * 1000
        return {
            "algorithm": "A* Financial Optimization",
            "initial_state": {"debt": initial_debt, "savings": initial_savings},
            "goal_state": {"debt": target_debt, "savings": target_savings},
            "nodes_explored": nodes_explored,
            "path_length": len(solution_path),
            "total_cost": total_cost,
            "path": solution_path,
            "execution_time_ms": round(exec_time, 3)
        }

if __name__ == "__main__":
    solver = FinancialAStar()
    res = solver.run()
    print("A* Output:", res)
