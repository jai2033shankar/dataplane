from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.connection import DBConnection
from app.services.schema_service import SchemaService
from app.services.ai_service import AIService

router = APIRouter()

@router.post("/suggest")
def suggest_transformation(source_id: int, target_id: int, table_name: str, db: Session = Depends(get_db)):
    """
    AI Suggests column mappings and structure casting logic between source and target tables.
    """
    source_conn = db.query(DBConnection).filter(DBConnection.id == source_id).first()
    target_conn = db.query(DBConnection).filter(DBConnection.id == target_id).first()

    if not source_conn or not target_conn:
        raise HTTPException(status_code=404, detail="Source or Target Connection not found")

    try:
        source_schema = SchemaService.get_full_schema(source_conn)
        target_schema = SchemaService.get_full_schema(target_conn)

        if table_name not in source_schema:
            raise HTTPException(status_code=400, detail=f"Table '{table_name}' not found in Source '{source_conn.name}'")
        if table_name not in target_schema:
            raise HTTPException(status_code=400, detail=f"Table '{table_name}' not found in Target '{target_conn.name}'")

        # Run AI matching on the columns of the target table
        match_results = AIService.match_schemas(
            source_name=table_name,
            source_schema=source_schema[table_name],
            target_name=table_name,
            target_schema=target_schema[table_name]
        )
        return {
            "source": source_conn.name,
            "target": target_conn.name,
            "table": table_name,
            "suggestions": match_results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Suggestion Failed: {str(e)}")
