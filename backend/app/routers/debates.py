import uuid
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional, Dict, Any

from app.schemas.debate import (
    CreateDebateSchema,
    SubmitMessageSchema,
    DebateSessionSchema,
    MessageSchema,
    EvaluationSchema,
    ArgumentAnalysisSchema,
    AICounterargumentSchema,
    EvidenceItemSchema,
)
from app.core.database import StorageService
from app.core.auth import get_current_user_optional
from app.agents.graph import debate_workflow
from app.agents.state import DebateGraphState

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/debates", tags=["Debates"])

@router.post("", response_model=DebateSessionSchema)
async def create_debate(req: CreateDebateSchema, user: Optional[dict] = Depends(get_current_user_optional)):
    debate_id = str(uuid.uuid4())
    user_id = user.get("sub", "guest") if user else "guest"
    now_iso = datetime.now(timezone.utc).isoformat()

    session_data = {
        "id": debate_id,
        "user_id": user_id,
        "topic": req.topic,
        "position": req.position.lower(),
        "mode": req.mode.lower(),
        "difficulty": req.difficulty.lower(),
        "max_rounds": req.max_rounds,
        "current_round": 1,
        "status": "active",
        "messages": [],
        "evaluation": None,
        "created_at": now_iso,
        "updated_at": now_iso,
    }

    await StorageService.save_debate(debate_id, session_data)
    return session_data


@router.get("", response_model=List[DebateSessionSchema])
async def list_debates(user: Optional[dict] = Depends(get_current_user_optional)):
    user_id = user.get("sub") if user else None
    items = await StorageService.list_debates(user_id=user_id, limit=50)
    
    # Normalize schema items if needed
    cleaned = []
    for item in items:
        if "position" not in item and "user_position" in item:
            item["position"] = item["user_position"]
        if "max_rounds" not in item and "total_rounds" in item:
            item["max_rounds"] = item["total_rounds"]
        if "messages" not in item:
            item["messages"] = []
        cleaned.append(item)
    return cleaned


@router.get("/{debate_id}", response_model=DebateSessionSchema)
async def get_debate(debate_id: str):
    data = await StorageService.get_debate(debate_id)
    if not data:
        raise HTTPException(status_code=404, detail="Debate session not found")
    
    if "position" not in data and "user_position" in data:
        data["position"] = data["user_position"]
    if "max_rounds" not in data and "total_rounds" in data:
        data["max_rounds"] = data["total_rounds"]
    if "messages" not in data:
        data["messages"] = []
    return data


@router.delete("/{debate_id}")
async def delete_debate(debate_id: str):
    deleted = await StorageService.delete_debate(debate_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Debate session not found")
    return {"status": "deleted", "id": debate_id}


@router.post("/{debate_id}/messages")
async def send_message(debate_id: str, req: SubmitMessageSchema):
    data = await StorageService.get_debate(debate_id)
    if not data:
        raise HTTPException(status_code=404, detail="Debate session not found")
    
    if data.get("status") == "completed":
        raise HTTPException(status_code=400, detail="Debate is already completed")

    now_iso = datetime.now(timezone.utc).isoformat()
    current_round = data.get("current_round", 1)
    max_rounds = data.get("max_rounds", data.get("total_rounds", 5))
    position = data.get("position", data.get("user_position", "for"))
    mode = data.get("mode", "devils_advocate")
    difficulty = data.get("difficulty", "intermediate")
    topic = data.get("topic", "")

    # Record User Message
    user_msg_id = f"msg_u_{uuid.uuid4().hex[:8]}"
    user_msg = {
        "id": user_msg_id,
        "debate_id": debate_id,
        "role": "user",
        "content": req.content,
        "round": current_round,
        "analysis": None,
        "counter": None,
        "evidence": None,
        "created_at": now_iso
    }

    # Prepare past user and AI arguments
    messages = data.get("messages", [])
    user_args = [m["content"] for m in messages if m.get("role") == "user"] + [req.content]
    ai_args = [m["content"] for m in messages if m.get("role") == "devil_advocate"]

    # Build LangGraph State
    state: DebateGraphState = {
        "debate_id": debate_id,
        "topic": topic,
        "user_position": position,
        "mode": mode,
        "difficulty": difficulty,
        "round": current_round,
        "max_rounds": max_rounds,
        "current_input": req.content,
        "messages": messages,
        "user_arguments": user_args,
        "ai_arguments": ai_args,
        "evidence": [],
        "analysis": {},
        "counter": {},
        "scores": {},
        "evaluation": None,
        "status": "active"
    }

    # Execute Cognitive Agent Workflow (LangGraph)
    updated_state = await debate_workflow.run_round(state)

    analysis_data = updated_state.get("analysis", {})
    counter_data = updated_state.get("counter", {})
    evidence_data = updated_state.get("evidence", [])

    # Format AI Message Content (Section 11, 13)
    ai_text = counter_data.get("counterargument", "")
    if counter_data.get("question"):
        ai_text = f"{ai_text}\n\n{counter_data.get('question')}"

    ai_msg_id = f"msg_ai_{uuid.uuid4().hex[:8]}"
    ai_msg = {
        "id": ai_msg_id,
        "debate_id": debate_id,
        "role": "devil_advocate",
        "content": ai_text,
        "round": current_round,
        "analysis": analysis_data,
        "counter": counter_data,
        "evidence": evidence_data,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    # Append to debate session
    if "messages" not in data:
        data["messages"] = []
    data["messages"].append(user_msg)
    data["messages"].append(ai_msg)

    # Check for completion
    if current_round >= max_rounds or updated_state.get("status") == "completed":
        data["status"] = "completed"
        final_eval = updated_state.get("evaluation")
        if not final_eval:
            final_eval = debate_workflow.judge_immediately(updated_state)
        data["evaluation"] = final_eval
    else:
        data["current_round"] = current_round + 1

    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    if "position" not in data:
        data["position"] = position
    if "max_rounds" not in data:
        data["max_rounds"] = max_rounds

    await StorageService.save_debate(debate_id, data)

    return {
        "debate": data,
        "userMessage": user_msg,
        "aiMessage": ai_msg
    }


@router.get("/{debate_id}/messages", response_model=List[MessageSchema])
async def get_debate_messages(debate_id: str):
    data = await StorageService.get_debate(debate_id)
    if not data:
        raise HTTPException(status_code=404, detail="Debate session not found")
    return data.get("messages", [])


@router.post("/{debate_id}/evaluate", response_model=EvaluationSchema)
async def evaluate_debate(debate_id: str):
    """Prematurely conclude or trigger final multi-factor debate adjudication."""
    data = await StorageService.get_debate(debate_id)
    if not data:
        raise HTTPException(status_code=404, detail="Debate session not found")

    messages = data.get("messages", [])
    user_args = [m["content"] for m in messages if m.get("role") == "user"]
    if not user_args:
        raise HTTPException(status_code=400, detail="Cannot evaluate a debate with no arguments submitted")

    state: DebateGraphState = {
        "debate_id": debate_id,
        "topic": data.get("topic", ""),
        "user_position": data.get("position", data.get("user_position", "for")),
        "mode": data.get("mode", "devils_advocate"),
        "difficulty": data.get("difficulty", "intermediate"),
        "round": data.get("current_round", 1),
        "max_rounds": data.get("max_rounds", 5),
        "current_input": user_args[-1],
        "messages": messages,
        "user_arguments": user_args,
        "ai_arguments": [m["content"] for m in messages if m.get("role") == "devil_advocate"],
        "evidence": [],
        "analysis": {},
        "counter": {},
        "scores": {},
        "evaluation": None,
        "status": "completed"
    }

    eval_result = debate_workflow.judge_immediately(state)
    data["evaluation"] = eval_result
    data["status"] = "completed"
    data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await StorageService.save_debate(debate_id, data)

    return eval_result


@router.get("/{debate_id}/evaluation", response_model=EvaluationSchema)
async def get_debate_evaluation(debate_id: str):
    data = await StorageService.get_debate(debate_id)
    if not data:
        raise HTTPException(status_code=404, detail="Debate session not found")
    if not data.get("evaluation"):
        raise HTTPException(status_code=404, detail="Debate has not been evaluated yet")
    return data["evaluation"]
