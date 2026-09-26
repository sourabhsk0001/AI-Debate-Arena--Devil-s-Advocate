from typing import TypedDict, List, Dict, Any, Optional

class DebateGraphState(TypedDict):
    debate_id: str
    topic: str
    user_position: str
    mode: str
    difficulty: str
    round: int
    max_rounds: int
    current_input: str
    messages: List[Dict[str, Any]]
    user_arguments: List[str]
    ai_arguments: List[str]
    evidence: List[Dict[str, Any]]
    analysis: Dict[str, Any]
    counter: Dict[str, Any]
    scores: Dict[str, Any]
    evaluation: Optional[Dict[str, Any]]
    status: str
