import time
import numpy as np
import pandas as pd
from typing import Dict, List, Any

class FinancialForecaster:
    """
    Financial Forecasting Engine.
    Models historical time-series data using:
      1. Simple Moving Average (SMA)
      2. Exponential Smoothing (Holt-Winters / Single Exponential)
      3. Ordinary Least Squares (OLS) Linear Regression with Confidence Interval Bands
    """
    def __init__(self):
        pass

    def forecast(self, historical_data: List[float] = None, periods_ahead: int = 6) -> Dict[str, Any]:
        start_time = time.time()

        if not historical_data:
            # Baseline monthly expenditure historical series (12 months)
            historical_data = [
                1200000.0, 1250000.0, 1180000.0, 1310000.0, 1290000.0, 1350000.0,
                1400000.0, 1380000.0, 1420000.0, 1480000.0, 1510000.0, 1560000.0
            ]

        y = np.array(historical_data)
        n = len(y)
        x = np.arange(n)

        # 1. Simple Moving Average (window = 3)
        window = 3
        sma_val = float(np.mean(y[-window:]))
        sma_forecast = [round(sma_val, 2)] * periods_ahead

        # 2. Exponential Smoothing (alpha = 0.4)
        alpha = 0.4
        exp_smooth = [y[0]]
        for t in range(1, n):
            exp_smooth.append(alpha * y[t] + (1 - alpha) * exp_smooth[-1])
        last_exp = exp_smooth[-1]
        exp_forecast = [round(float(last_exp), 2)] * periods_ahead

        # 3. Linear Regression (y = m*x + c)
        slope, intercept = np.polyfit(x, y, 1)
        future_x = np.arange(n, n + periods_ahead)
        reg_forecast = slope * future_x + intercept

        # Calculate residual std error for 95% Confidence Intervals
        y_pred = slope * x + intercept
        residuals = y - y_pred
        std_error = float(np.std(residuals))
        z_95 = 1.96

        forecast_points = []
        for i in range(periods_ahead):
            f_val = float(reg_forecast[i])
            lower = max(0.0, f_val - z_95 * std_error)
            upper = f_val + z_95 * std_error
            forecast_points.append({
                "period": n + i + 1,
                "linear_regression": round(f_val, 2),
                "exp_smoothing": exp_forecast[i],
                "moving_avg": sma_forecast[i],
                "lower_bound_95": round(lower, 2),
                "upper_bound_95": round(upper, 2)
            })

        exec_time = (time.time() - start_time) * 1000

        return {
            "algorithm": "Multi-Model Time Series Forecasting",
            "historical_periods": n,
            "forecast_horizon": periods_ahead,
            "linear_regression_model": {
                "slope_trend": round(float(slope), 2),
                "intercept": round(float(intercept), 2),
                "residual_std_error": round(std_error, 2)
            },
            "forecast": forecast_points,
            "execution_time_ms": round(exec_time, 3)
        }

if __name__ == "__main__":
    forecaster = FinancialForecaster()
    print("Forecasting Output:", forecaster.forecast())
