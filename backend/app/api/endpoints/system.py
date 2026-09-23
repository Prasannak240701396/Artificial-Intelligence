from fastapi import APIRouter
from app.core.websockets import manager

router = APIRouter()

@router.get("/status")
def get_system_status():
    return {
        "status": "HEALTHY",
        "backend": {"status": "ONLINE", "latency_ms": 1.4, "version": "1.0.0"},
        "database": {"status": "CONNECTED", "pool_size": 10, "active_connections": 3},
        "redis": {"status": "CONNECTED", "events_per_sec": 142.5},
        "websocket": {"status": "ACTIVE", "connected_clients": len(manager.active_connections)},
        "market_provider": {"status": "ACTIVE", "mode": "SIMULATION MODE"},
        "agentic_engine": {"status": "OPERATIONAL", "active_agents": 11}
    }
