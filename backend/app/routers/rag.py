from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.rag.retriever import rag_retriever

router = APIRouter(tags=["RAG Evidence"])

class RAGSearchRequest(BaseModel):
    query: str
    topic: Optional[str] = "general"
    limit: Optional[int] = 5

@router.post("/api/rag/search")
async def search_rag(req: RAGSearchRequest):
    results = rag_retriever.retrieve_evidence(topic=req.topic or "general", query=req.query, limit=req.limit or 5)
    return {
        "query": req.query,
        "topic": req.topic,
        "count": len(results),
        "results": results
    }

@router.get("/api/rag/search")
async def search_rag_get(query: str = Query(..., min_length=2), topic: str = Query(default="general"), limit: int = 5):
    results = rag_retriever.retrieve_evidence(topic=topic, query=query, limit=limit)
    return {
        "query": query,
        "topic": topic,
        "count": len(results),
        "results": results
    }

@router.get("/api/evidence/search")
async def search_evidence(query: str = Query(..., min_length=2), topic: str = Query(default="general")):
    results = rag_retriever.retrieve_evidence(topic=topic, query=query, limit=5)
    return {"query": query, "topic": topic, "count": len(results), "evidence": results}
