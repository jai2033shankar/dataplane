from typing import List, Dict, Any
from app.connectors.sqlite import SQLiteConnector
from app.connectors.postgres import PostgresConnector
from app.models.connection import DBConnection

def get_connector(connection: DBConnection):
    """
    Factory function to initialize correct connector based on DBConnection model.
    """
    conn_type = connection.type.lower()
    config = connection.config

    if conn_type == "sqlite":
        # expects config to have 'path'
        if "path" not in config:
            raise ValueError("SQLite config must include 'path'")
        return SQLiteConnector(config["path"])
        
    elif conn_type == "postgres":
        # expects config to have host, port, dbname, user, password
        required = ["host", "port", "dbname", "user", "password"]
        for r in required:
            if r not in config:
                raise ValueError(f"Postgres config must include '{r}'")
        return PostgresConnector(**config)
        
    else:
        raise ValueError(f"Unsupported connector type: {conn_type}")

class SchemaService:
    @staticmethod
    def get_full_schema(connection: DBConnection) -> Dict[str, Any]:
        """
        Extracts full schema structure (tables and columns) from the connection.
        """
        connector = get_connector(connection)
        try:
            tables = connector.get_tables()
            schema_data = {}
            for table in tables:
                schema_data[table] = connector.get_table_schema(table)
            return schema_data
        finally:
            connector.close()

    @staticmethod
    def test_connection(connection: DBConnection) -> bool:
        """
        Test if the connection parameters are correct.
        """
        connector = get_connector(connection)
        try:
            return connector.test_connection()
        finally:
            connector.close()
