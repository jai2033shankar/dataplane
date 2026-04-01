from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from app.core.database import get_db
from app.models.connection import DBConnection
from app.services.schema_service import SchemaService
from app.services.ai_service import AIService
from app.services.schema_mapper_service import SchemaMapperService

router = APIRouter()


class ParseRequest(BaseModel):
    text: str
    source_id: int
    target_id: int


class GenerateSQLRequest(BaseModel):
    mappings: List[Dict[str, Any]]
    target_db_type: str = "sqlite"


class VisualMapRequest(BaseModel):
    source_id: int
    target_id: int


@router.post("/parse")
def parse_english(req: ParseRequest, db: Session = Depends(get_db)):
    """Parse English mapping instructions into structured rules."""
    source_conn = db.query(DBConnection).filter(DBConnection.id == req.source_id).first()
    target_conn = db.query(DBConnection).filter(DBConnection.id == req.target_id).first()

    if not source_conn or not target_conn:
        raise HTTPException(status_code=404, detail="Source or Target connection not found")

    try:
        source_schema = SchemaService.get_full_schema(source_conn)
        target_schema = SchemaService.get_full_schema(target_conn)

        result = SchemaMapperService.parse_english_mapping(
            text=req.text,
            source_schema=source_schema,
            target_schema=target_schema,
        )
        result["source"] = source_conn.name
        result["target"] = target_conn.name
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parse failed: {str(e)}")


@router.post("/generate-sql")
def generate_sql(req: GenerateSQLRequest):
    """Generate migration SQL from mapping rules."""
    try:
        result = SchemaMapperService.generate_migration_sql(
            mappings=req.mappings,
            target_db_type=req.target_db_type,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SQL generation failed: {str(e)}")


@router.post("/visual-data")
def get_visual_mapping(req: VisualMapRequest, db: Session = Depends(get_db)):
    """Get structured data for the visual schema mapper UI."""
    source_conn = db.query(DBConnection).filter(DBConnection.id == req.source_id).first()
    target_conn = db.query(DBConnection).filter(DBConnection.id == req.target_id).first()

    if not source_conn or not target_conn:
        raise HTTPException(status_code=404, detail="Source or Target connection not found")

    try:
        source_schema = SchemaService.get_full_schema(source_conn)
        target_schema = SchemaService.get_full_schema(target_conn)

        # Get AI matches for first table pair
        ai_matches = []
        src_tables = list(source_schema.keys())
        tgt_tables = list(target_schema.keys())
        if src_tables and tgt_tables:
            match_result = AIService.match_schemas(
                source_name=src_tables[0],
                source_schema=source_schema[src_tables[0]],
                target_name=tgt_tables[0],
                target_schema=target_schema[tgt_tables[0]],
            )
            ai_matches = match_result.get("matches", [])

        result = SchemaMapperService.get_visual_mapping_data(
            source_schema=source_schema,
            target_schema=target_schema,
            ai_matches=ai_matches,
        )
        result["source_name"] = source_conn.name
        result["target_name"] = target_conn.name
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Visual mapping failed: {str(e)}")
