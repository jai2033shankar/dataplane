from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import connectors, schema, agent
from app.core.config import settings
from app.core.database import Base, engine
from app.models.connection import DBConnection # ensure models loaded

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="dataPlane API",
    description="Agentic DBA & Data Transformation Platform",
    version="0.1.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(connectors.router, prefix="/api/v1/connectors", tags=["Connectors"])
app.include_router(schema.router, prefix="/api/v1/schema", tags=["Schema Intelligence"])
app.include_router(agent.router, prefix="/api/v1/agent", tags=["AI Agent"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "dataPlane API"}
