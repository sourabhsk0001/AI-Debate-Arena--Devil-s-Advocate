from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class EvidenceItem(BaseModel):
    title: str
    fact: str
    source: str
    relevance_score: float = 0.95

class Turn(BaseModel):
    round_number: int
    user_argument: str
    ai_counterargument: str
    ai_cross_examination_question: str
    identified_weaknesses: List[str] = []
    detected_fallacies: List[str] = []
    retrieved_evidence: List[EvidenceItem] = []
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ScoreMetrics(BaseModel):
    logic_and_reasoning: float = Field(..., ge=0, le=10)
    evidence_and_facts: float = Field(..., ge=0, le=10)
    rebuttal_effectiveness: float = Field(..., ge=0, le=10)
    persuasiveness_and_clarity: float = Field(..., ge=0, le=10)

class FinalEvaluation(BaseModel):
    winner: str # "user", "devil_advocate", or "draw"
    overall_score_user: float # 0 - 100
    overall_score_ai: float # 0 - 100
    metrics: ScoreMetrics
    user_strengths: List[str] = []
    user_weaknesses: List[str] = []
    fallacies_committed: List[str] = []
    verdict_summary: str
    coaching_tips: List[str] = []

class CreateDebateRequest(BaseModel):
    topic: str
    user_position: str # "for" or "against"
    difficulty: str = "standard" # "friendly", "standard", "brutal"
    mode: str = "devils_advocate" # "devils_advocate", "socratic", "opponent", "neutral_judge"
    total_rounds: int = 3

class SubmitTurnRequest(BaseModel):
    user_argument: str

class DebateSession(BaseModel):
    id: str
    user_id: Optional[str] = "guest"
    topic: str
    user_position: str
    difficulty: str
    mode: str = "devils_advocate" # "devils_advocate", "socratic", "opponent", "neutral_judge"
    total_rounds: int
    current_round: int = 1
    status: str = "active" # "active", "completed"
    turns: List[Turn] = []
    evaluation: Optional[FinalEvaluation] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
