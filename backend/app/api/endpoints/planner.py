from fastapi import APIRouter, Depends, Body
from typing import Dict, Any, List
from algorithms.csp_backtracking import BudgetCSP
from algorithms.minimax import CapitalMinimax

router = APIRouter()

@router.post("/optimize")
def run_financial_plan(payload: Dict[str, Any] = Body(...)):
    total_budget = float(payload.get("total_budget", 10000000.0))
    priorities = payload.get("priorities", {})

    csp_solver = BudgetCSP()
    csp_output = csp_solver.run(total_budget=total_budget)

    minimax_solver = CapitalMinimax()
    minimax_output = minimax_solver.solve()

    return {
        "planning_scenario": "AI Financial Allocation Optimization",
        "inputs": {
            "total_available_budget": total_budget,
            "priorities": priorities
        },
        "csp_allocation_result": csp_output,
        "minimax_strategy_result": minimax_output,
        "recommendation": f"Optimal budget distribution achieved with ${csp_output['unallocated_reserve']:,.2f} unallocated reserve. Strategy: '{minimax_output['optimal_strategy']}' minimizes market risk."
    }
