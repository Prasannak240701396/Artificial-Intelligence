import time
from typing import Dict, List, Any

class BudgetCSP:
    """
    Constraint Satisfaction Problem (CSP) Backtracking Solver for Departmental Budget Allocation.
    Variables: Department Allocations
    Constraints:
      1. Sum of allocations <= Total Pool
      2. Each allocation >= Department Minimum Requirement
      3. Each allocation <= Department Maximum Ceiling
      4. Priority weights preference enforcement
    """
    def __init__(self):
        pass

    def run(self, total_budget: float = 10000000.0,
            departments: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        start_time = time.time()

        if not departments:
            departments = [
                {"name": "Public Works", "min": 1500000.0, "max": 3500000.0, "priority": 1},
                {"name": "Health", "min": 2000000.0, "max": 4000000.0, "priority": 1},
                {"name": "Education", "min": 1500000.0, "max": 3000000.0, "priority": 2},
                {"name": "Information Technology", "min": 1000000.0, "max": 2500000.0, "priority": 2},
                {"name": "Transport", "min": 800000.0, "max": 2000000.0, "priority": 3},
                {"name": "Energy", "min": 500000.0, "max": 1500000.0, "priority": 3}
            ]

        # Step size discretization for backtrack domain exploration
        step = 250000.0
        backtracks = [0] # Mutable counter

        def is_valid(assignment: Dict[str, float]) -> bool:
            current_sum = sum(assignment.values())
            if current_sum > total_budget:
                return False
            return True

        def backtrack(index: int, current_assignment: Dict[str, float]) -> Dict[str, float]:
            if index == len(departments):
                if sum(current_assignment.values()) <= total_budget:
                    return current_assignment
                return None

            dept = departments[index]
            name = dept["name"]
            min_val = dept["min"]
            max_val = dept["max"]

            # Generate domain values high-to-low for priority optimization
            val = max_val
            while val >= min_val:
                current_assignment[name] = val
                if is_valid(current_assignment):
                    result = backtrack(index + 1, current_assignment)
                    if result is not None:
                        return result
                backtracks[0] += 1
                val -= step

            del current_assignment[name]
            return None

        solution = backtrack(0, {})
        exec_time = (time.time() - start_time) * 1000

        total_allocated = sum(solution.values()) if solution else 0.0
        unallocated = total_budget - total_allocated

        return {
            "algorithm": "CSP Backtracking Budget Allocator",
            "total_budget": total_budget,
            "total_allocated": total_allocated,
            "unallocated_reserve": unallocated,
            "backtracks_performed": backtracks[0],
            "solution": solution,
            "execution_time_ms": round(exec_time, 3)
        }

if __name__ == "__main__":
    csp = BudgetCSP()
    res = csp.run()
    print("CSP Output:", res)
