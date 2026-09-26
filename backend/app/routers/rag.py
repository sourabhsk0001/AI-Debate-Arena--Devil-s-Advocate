from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.rag_service import rag_service

router = APIRouter(prefix="/api/evidence", tags=["RAG Evidence"])

@router.get("/search")
async def search_evidence(query: str = Query(..., min_length=2), topic: str = Query(default="general")):
    results = rag_service.retrieve_evidence(query=query, topic=topic, limit=5)
    return {"query": query, "topic": topic, "count": len(results), "evidence": results}
