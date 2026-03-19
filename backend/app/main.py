from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers import connectors, schema, agent
from app.core.config import settings
from app.core.database import Base, engine
from app.models.connection import DBConnection # ensure models loaded

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Create tables
    Base.metadata.create_all(bind=engine)

    # 2. Seed physical dummy databases file on filesystem for demo
    import sqlite3
    import os
    
    # Source DB
    src_path = "/tmp/dataplane_crm_source.db"
    if not os.path.exists(src_path):
        conn = sqlite3.connect(src_path)
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE crm_users (id INTEGER PRIMARY KEY, first_name TEXT, email_address TEXT, created_at TIMESTAMP)")
        cursor.execute("CREATE TABLE crm_leads (id INTEGER PRIMARY KEY, email TEXT, status VARCHAR(20))")
        conn.commit()
        conn.close()

    # Target DB
    tgt_path = "/tmp/dataplane_dw_target.db"
    if not os.path.exists(tgt_path):
        conn = sqlite3.connect(tgt_path)
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE dw_customers (customer_id INTEGER PRIMARY KEY, given_name TEXT, contact_email TEXT, signup_date DATE)")
        conn.commit()
        conn.close()

    # 3. Seed DBConnection rows
    from sqlalchemy.orm import Session
    db = Session(bind=engine)
    try:
        # Check if already seeded
        if not db.query(DBConnection).filter(DBConnection.name == "CRM_Source_Analytics").first():
            db.add(DBConnection(name="CRM_Source_Analytics", type="sqlite", config={"path": src_path}))
            db.add(DBConnection(name="Data_Warehouse_Target", type="sqlite", config={"path": tgt_path}))
            db.commit()
    finally:
        db.close()

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
