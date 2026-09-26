from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserRegisterSchema(BaseModel):
    name: str
    email: str
    password: str

class UserLoginSchema(BaseModel):
    email: str
    password: str

class UserResponseSchema(BaseModel):
    id: str
    name: str
    email: str
    created_at: str

class CreateDebateSchema(BaseModel):
    topic: str
    position: str = "for" # "for", "against", "neutral"
    mode: str = "devils_advocate" # "devils_advocate", "socratic", "opponent", "neutral_judge"
    difficulty: str = "intermediate" # "beginner", "intermediate", "advanced"
    max_rounds: int = 5
    ai_starts_first: bool = False


class SubmitMessageSchema(BaseModel):
    content: str

class EvidenceItemSchema(BaseModel):
    title: str
    source: str
    chunk: str
    url: Optional[str] = None
    relevance_score: float = 0.95

class ArgumentAnalysisSchema(BaseModel):
    claim: str
    assumptions: List[str] = []
    strengths: List[str] = []
    weaknesses: List[str] = []
    logical_issues: List[str] = []
    evidence_needed: List[str] = []

class AICounterargumentSchema(BaseModel):
    counterargument: str
    key_challenge: str
    question: str
    confidence: float = 0.88

class MessageSchema(BaseModel):
    id: str
    debate_id: str
    role: str # "user" or "devil_advocate"
    content: str
    round: int
    analysis: Optional[ArgumentAnalysisSchema] = None
    counter: Optional[AICounterargumentSchema] = None
    evidence: Optional[List[EvidenceItemSchema]] = None
    created_at: str

class EvaluationSchema(BaseModel):
    debate_id: str
    logic: float = Field(..., ge=0, le=10)
    evidence: float = Field(..., ge=0, le=10)
    rebuttal: float = Field(..., ge=0, le=10)
    clarity: float = Field(..., ge=0, le=10)
    consistency: float = Field(..., ge=0, le=10)
    overall: float = Field(..., ge=0, le=10)
    strengths: List[str] = []
    weaknesses: List[str] = []
    improvement_suggestions: List[str] = []

class DebateSessionSchema(BaseModel):
    id: str
    user_id: str
    topic: str
    position: str
    mode: str
    difficulty: str
    max_rounds: int
    current_round: int
    status: str
    messages: List[MessageSchema] = []
    evaluation: Optional[EvaluationSchema] = None
    created_at: str
    updated_at: str
