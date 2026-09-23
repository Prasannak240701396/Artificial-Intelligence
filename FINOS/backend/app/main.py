import asyncio
import json
import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# Ensure python path includes root and backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.core.websockets import manager
from app.api.api import api_router
from app.services.market_provider import get_market_provider
from agents.engine import agent_engine
from database.seed_db import seed_database

# Background market & agent stream tick loop
async def continuous_event_loop():
    while True:
        try:
            # 1. Generate live/simulated market tick
            provider = get_market_provider(settings.MARKET_DATA_MODE)
            pulse = provider.get_market_pulse()

            # 2. Trigger agent step
            agent_evt = agent_engine.step()

            # 3. Broadcast real-time WS payload
            payload = {
                "type": "TICK_UPDATE",
                "mode": provider.get_mode(),
                "pulse": pulse,
                "agent_event": agent_evt
            }
            await manager.broadcast(payload)
        except Exception as e:
            print(f"Error in continuous tick loop: {e}")
        await asyncio.sleep(1.5) # Continuous 1.5s tick interval

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure DB schema & seed data exists
    try:
        print("Checking database initialization...")
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        from app.models.models import Department
        dept_count = db.query(Department).count()
        db.close()

        if dept_count == 0:
            print("Database empty. Seeding initial baseline data...")
            seed_database()
    except Exception as e:
        print(f"Startup DB check notice: {e}")

    # Start background continuous event stream loop
    ticker_task = asyncio.create_task(continuous_event_loop())
    yield
    # Shutdown
    ticker_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle client ping or subscription requests if any
            await websocket.send_text(json.dumps({"type": "PONG", "message": "FINOS WS Stream Active"}))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "system": "FINOS - Financial Intelligence and Operations System",
        "status": "ONLINE",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
