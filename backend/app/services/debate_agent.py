import logging
from typing import Dict, Any, List
from app.services.rag_service import rag_service
from app.services.llm_service import llm_service
from app.models.debate import Turn, EvidenceItem

logger = logging.getLogger(__name__)

class DebateState:
    """Represents the LangGraph-style state through the agent pipeline."""
    def __init__(self, topic: str, user_position: str, difficulty: str, mode: str, round_number: int, total_rounds: int, user_argument: str, history: List[Dict[str, Any]]):
        self.topic = topic
        self.user_position = user_position
        self.difficulty = difficulty
        self.mode = mode
        self.round_number = round_number
        self.total_rounds = total_rounds
        self.user_argument = user_argument
        self.history = history
        self.retrieved_evidence: List[Dict[str, Any]] = []
        self.generated_output: Dict[str, Any] = {}

class DebateAgent:
    """
    Multi-step LangGraph / Cognitive Agent Workflow:
    Step 1: Retrieve RAG evidence relevant to argument and counter-stance.
    Step 2: Synthesize counterargument / questions / neutral adjudication according to mode.
    Step 3: Package into verified Turn entity.
    """
    async def run_round(
        self,
        topic: str,
        user_position: str,
        difficulty: str,
        round_number: int,
        total_rounds: int,
        user_argument: str,
        previous_turns: List[Dict[str, Any]],
        mode: str = "devils_advocate"
    ) -> Turn:
        state = DebateState(
            topic=topic,
            user_position=user_position,
            difficulty=difficulty,
            mode=mode,
            round_number=round_number,
            total_rounds=total_rounds,
            user_argument=user_argument,
            history=previous_turns
        )

        # Node 1: RAG Evidence Retrieval
        state.retrieved_evidence = rag_service.retrieve_evidence(
            query=user_argument,
            topic=topic,
            limit=2
        )

        # Node 2: Cognitive Reasoning & LLM Counter Generation based on Mode
        state.generated_output = await llm_service.generate_turn(
            topic=state.topic,
            user_position=state.user_position,
            round_number=state.round_number,
            total_rounds=state.total_rounds,
            difficulty=state.difficulty,
            mode=state.mode,
            user_argument=state.user_argument,
            previous_turns=state.history,
            retrieved_evidence=state.retrieved_evidence
        )

        # Node 3: Packaging Turn Object
        evidence_items = [
            EvidenceItem(
                title=e.get("title", ""),
                fact=e.get("fact", ""),
                source=e.get("source", ""),
                relevance_score=e.get("relevance_score", 0.9)
            )
            for e in state.retrieved_evidence
        ]

        turn = Turn(
            round_number=round_number,
            user_argument=user_argument,
            ai_counterargument=state.generated_output.get("counterargument", "Argument acknowledged."),
            ai_cross_examination_question=state.generated_output.get("cross_examination_question", "How do you substantiate this claim?"),
            identified_weaknesses=state.generated_output.get("identified_weaknesses", []),
            detected_fallacies=state.generated_output.get("detected_fallacies", []),
            retrieved_evidence=evidence_items
        )

        return turn

debate_agent = DebateAgent()
