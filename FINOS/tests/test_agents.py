import pytest
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.agent_definitions import AGENTS_CONFIG
from agents.engine import AgenticFinanceEngine


def test_agent_definitions_completeness():
    assert len(AGENTS_CONFIG) == 11
    roles = set()
    for agent in AGENTS_CONFIG:
        assert "name" in agent
        assert "role" in agent
        assert "confidence" in agent
        assert 0.0 <= agent["confidence"] <= 1.0
        assert "risk_rating" in agent
        roles.add(agent["role"])
    assert len(roles) >= 8


def test_agent_engine_workflow_stages():
    engine = AgenticFinanceEngine()
    expected_stages = [
        "OBSERVE", "ANALYZE", "REASON", "PLAN",
        "VALIDATE", "SIMULATE", "VERIFY", "AUDIT", "REPLAN"
    ]
    for expected_stage in expected_stages:
        step_result = engine.step()
        assert step_result["stage"] == expected_stage
        assert "timestamp" in step_result
        assert "agent_name" in step_result
        assert "message" in step_result
        assert 0.0 <= step_result["confidence"] <= 1.0
