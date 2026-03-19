from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "dataPlane"
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/dataplane"
    OLLAMA_HOST: str = "http://ollama:11434"
    
    class Config:
        env_file = ".env"

settings = Settings()
