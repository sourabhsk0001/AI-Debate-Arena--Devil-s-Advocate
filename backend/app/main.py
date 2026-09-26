import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import db_manager
from app.routers import auth, debates, topics, rag, courtroom

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("debate-arena")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Initializing AI Debate Arena Services...")
    await db_manager.connect()
    yield
    # Shutdown
    logger.info("Shutting down AI Debate Arena Services...")
    await db_manager.close()

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Production-grade AI Debate Arena powered by Devil's Advocate Cognitive Agents and RAG",
    lifespan=lifespan
)

# CORS configuration for modern web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API routes
app.include_router(auth.router)
app.include_router(debates.router)
app.include_router(topics.router)
app.include_router(rag.router)
app.include_router(courtroom.router)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mongodb_connected": db_manager.is_connected,
        "llm_provider": settings.LLM_PROVIDER,
        "openai_configured": bool(settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your_openai_api_key_here")
    }

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
