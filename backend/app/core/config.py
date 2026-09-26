import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "AI Debate Arena — Devil's Advocate"
    APP_ENV: str = "development"
    PORT: int = 8000
    SECRET_KEY: str = "devil_advocate_super_secret_jwt_key_9992384729384729384"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # LLM Settings
    LLM_PROVIDER: str = "openai"  # openai, bedrock, or mock
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # AWS Bedrock
    AWS_REGION: str = "us-east-1"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    BEDROCK_MODEL_ID: str = "anthropic.claude-3-haiku-20240307-v1:0"

    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "debate_arena"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
