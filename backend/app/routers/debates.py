import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.models.debate import (
    CreateDebateRequest,
    SubmitTurnRequest,
    DebateSession,
    Turn,
    FinalEvaluation
)
from app.core.database import StorageService
from app.core.auth import get_current_user_optional
from app.services.debate_agent import debate_agent
from app.services.llm_service import llm_service

router = APIRouter(prefix="/api/debates", tags=["Debates"])

@router.post("", response_model=DebateSession)
async def create_debate(req: CreateDebateRequest, user: Optional[dict] = Depends(get_current_user_optional)):
    debate_id = str(uuid.uuid4())
    user_id = user.get("sub", "guest") if user else "guest"

    session = DebateSession(
        id=debate_id,
        user_id=user_id,
        topic=req.topic,
        user_position=req.user_position,
        difficulty=req.difficulty,
        mode=req.mode,
        total_rounds=req.total_rounds,
        current_round=1,
        status="active",
        turns=[]
    )
    await StorageService.save_debate(debate_id, session.dict())
    return session

@router.get("/{debate_id}", response_model=DebateSession)
async def get_debate(debate_id: str):
    data = await StorageService.get_debate(debate_id)
    if not data:
        raise HTTPException(status_code=404, detail="Debate session not found")
    return DebateSession(**data)

@router.get("", response_model=List[DebateSession])
async def list_debates(user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = user.get("sub") if user else None
    items = await StorageService.list_debates(user_id=user_id, limit=20)
    return [DebateSession(**item) for item in items]

@router.post("/{debate_id}/turn", response_model=DebateSession)
async def submit_turn(debate_id: str, req: SubmitTurnRequest):
    data = await StorageService.get_debate(debate_id)
    if not data:
        raise HTTPException(status_code=404, detail="Debate session not found")
    
    session = DebateSession(**data)
    if session.status == "completed":
        raise HTTPException(status_code=400, detail="Debate is already completed")

    # Run Agent with specified debate mode
    turn: Turn = await debate_agent.run_round(
        topic=session.topic,
        user_position=session.user_position,
        difficulty=session.difficulty,
        mode=session.mode,
        round_number=session.current_round,
        total_rounds=session.total_rounds,
        user_argument=req.user_argument,
        previous_turns=[t.dict() for t in session.turns]
    )

    session.turns.append(turn)
    session.updated_at = datetime.utcnow().isoformat()

    # If reached maximum rounds, automatically evaluate or mark ready
    if session.current_round >= session.total_rounds:
        eval_dict = await llm_service.evaluate_debate(
            topic=session.topic,
            user_position=session.user_position,
            difficulty=session.difficulty,
            mode=session.mode,
            turns=[t.dict() for t in session.turns]
        )
        session.evaluation = FinalEvaluation(**eval_dict)
        session.status = "completed"
    else:
        session.current_round += 1

    await StorageService.save_debate(debate_id, session.dict())
    return session

@router.post("/{debate_id}/conclude", response_model=DebateSession)
async def conclude_debate(debate_id: str):
    """Prematurely conclude and judge an active debate."""
    data = await StorageService.get_debate(debate_id)
    if not data:
        raise HTTPException(status_code=404, detail="Debate session not found")
    
    session = DebateSession(**data)
    if not session.turns:
        raise HTTPException(status_code=400, detail="Cannot judge a debate with no completed rounds")

    eval_dict = await llm_service.evaluate_debate(
        topic=session.topic,
        user_position=session.user_position,
        difficulty=session.difficulty,
        mode=session.mode,
        turns=[t.dict() for t in session.turns]
    )
    session.evaluation = FinalEvaluation(**eval_dict)
    session.status = "completed"
    session.updated_at = datetime.utcnow().isoformat()

    await StorageService.save_debate(debate_id, session.dict())
    return session
