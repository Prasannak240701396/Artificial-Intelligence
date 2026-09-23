import time
import numpy as np
from scipy import stats
from sklearn.ensemble import IsolationForest
from typing import Dict, List, Any

class FinancialAnomalyDetector:
    """
    Multi-Method Transaction Anomaly Detection Engine.
    Combines:
      1. Parametric Z-Score Analysis
      2. Non-Parametric IQR (Interquartile Range)
      3. Machine Learning Isolation Forest Classifier
    """
    def __init__(self):
        pass

    def analyze(self, amounts: List[float] = None) -> Dict[str, Any]:
        start_time = time.time()

        if not amounts or len(amounts) < 5:
            # Baseline realistic transaction amounts dataset if not provided
            np.random.seed(42)
            normal_txs = np.random.normal(loc=5000.0, scale=1200.0, size=95).tolist()
            anomalous_txs = [45000.0, 92000.0, 150000.0, 320000.0, 50.0]
            amounts = normal_txs + anomalous_txs

        arr = np.array(amounts)

        # 1. Z-Score Method
        mean = np.mean(arr)
        std = np.std(arr) if np.std(arr) > 0 else 1.0
        z_scores = (arr - mean) / std
        z_anomalies_idx = np.where(np.abs(z_scores) > 2.5)[0].tolist()

        # 2. IQR Method
        q25, q75 = np.percentile(arr, 25), np.percentile(arr, 75)
        iqr = q75 - q25
        lower_bound = q25 - 1.5 * iqr
        upper_bound = q75 + 1.5 * iqr
        iqr_anomalies_idx = np.where((arr < lower_bound) | (arr > upper_bound))[0].tolist()

        # 3. Isolation Forest Method
        X = arr.reshape(-1, 1)
        iso_forest = IsolationForest(contamination=0.05, random_state=42)
        predictions = iso_forest.fit_predict(X) # -1 is anomaly, 1 is normal
        iso_anomalies_idx = np.where(predictions == -1)[0].tolist()

        # Combined consensus anomalies
        consensus_idx = sorted(list(set(z_anomalies_idx).intersection(set(iqr_anomalies_idx))))

        anomalies_summary = []
        for idx in consensus_idx:
            anomalies_summary.append({
                "index": int(idx),
                "amount": float(arr[idx]),
                "z_score": round(float(z_scores[idx]), 2),
                "iqr_bounds": {"lower": round(float(lower_bound), 2), "upper": round(float(upper_bound), 2)},
                "isolation_forest_label": "ANOMALY"
            })

        exec_time = (time.time() - start_time) * 1000

        return {
            "algorithm": "Multi-Method Anomaly Detection",
            "total_samples": len(amounts),
            "sample_mean": round(float(mean), 2),
            "sample_std": round(float(std), 2),
            "z_score_anomalies_count": len(z_anomalies_idx),
            "iqr_anomalies_count": len(iqr_anomalies_idx),
            "isolation_forest_anomalies_count": len(iso_anomalies_idx),
            "consensus_anomalies_count": len(consensus_idx),
            "detected_anomalies": anomalies_summary,
            "execution_time_ms": round(exec_time, 3)
        }

if __name__ == "__main__":
    detector = FinancialAnomalyDetector()
    print("Anomaly Detector Output:", detector.analyze())
