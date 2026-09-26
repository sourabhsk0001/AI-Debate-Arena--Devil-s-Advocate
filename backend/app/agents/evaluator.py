import logging
from typing import Dict, Any, List, Optional
from app.agents.state import DebateGraphState
from app.core.config import settings

logger = logging.getLogger(__name__)

class ResponseEvaluatorNode:
    """
    Node 6: Response Evaluator.
    Computes running round scores and feedback based on the user's latest argument and analysis.
    """
    def evaluate_round(self, state: DebateGraphState) -> Dict[str, Any]:
        analysis = state.get("analysis", {})
        logical_issues = analysis.get("logical_issues", [])
        user_arg = state.get("current_input", "")
        word_count = len(user_arg.split())

        # Dynamic rubric scoring
        base_logic = 8.5
        if "Hasty Generalization / Absolutism" in logical_issues:
            base_logic -= 1.0
        if "False Dilemma" in logical_issues:
            base_logic -= 1.5
        if "Slippery Slope Fallacy" in logical_issues:
            base_logic -= 1.2
        if "Unsubstantiated Premise" in logical_issues:
            base_logic -= 0.8
        logic_score = max(5.0, min(10.0, round(base_logic, 1)))

        # Evidence scoring
        has_citations = any(c in user_arg.lower() for c in ["study", "research", "percent", "%", "data", "report", "according", "nber", "stanford"])
        evidence_score = 8.5 if has_citations else (6.5 if word_count > 30 else 5.5)

        # Rebuttal scoring
        rebuttal_score = 8.5 if word_count > 25 else 7.0

        # Clarity scoring
        clarity_score = 9.0 if (20 <= word_count <= 80) else 7.8

        # Consistency scoring
        consistency_score = 8.8

        round_scores = {
            "logic": logic_score,
            "evidence": evidence_score,
            "rebuttal": rebuttal_score,
            "clarity": clarity_score,
            "consistency": consistency_score,
            "round": state.get("round", 1)
        }

        return round_scores


class DebateJudgeNode:
    """
    Node 7: Debate Adjudicator & Final Judge.
    Evaluates completed debate across 5 criteria (0-10) and provides diagnostic feedback.
    """
    def judge(self, state: DebateGraphState) -> Dict[str, Any]:
        topic = state.get("topic", "")
        position = state.get("user_position", "for")
        user_args = state.get("user_arguments", [])
        if not user_args and state.get("current_input"):
            user_args = [state.get("current_input")]

        # Determine aggregate quality
        total_words = sum(len(a.split()) for a in user_args)
        combined_text = " ".join(user_args).lower()

        # 1. Logic (0-10)
        logic = 8.2
        if any(w in combined_text for w in ["always", "never", "obviously", "nobody"]):
            logic -= 0.5
        if len(user_args) >= 3:
            logic += 0.4
        logic = max(5.5, min(9.8, round(logic, 1)))

        # 2. Evidence (0-10)
        cites = sum(1 for kw in ["study", "percent", "%", "data", "report", "harvard", "stanford", "empirical", "survey"] if kw in combined_text)
        if cites >= 2:
            evidence = 8.5
        elif cites == 1:
            evidence = 7.5
        else:
            evidence = 6.8
        evidence = max(5.0, min(9.5, round(evidence, 1)))

        # 3. Rebuttal (0-10)
        rebuttal = 8.8 if total_words > 100 else 7.9
        rebuttal = max(6.0, min(9.8, round(rebuttal, 1)))

        # 4. Clarity (0-10)
        clarity = 8.6 if total_words > 50 else 7.8
        clarity = max(6.0, min(9.5, round(clarity, 1)))

        # 5. Consistency (0-10)
        consistency = 8.4
        consistency = max(6.0, min(9.8, round(consistency, 1)))

        # Overall composite
        overall = round((logic * 0.25 + evidence * 0.25 + rebuttal * 0.20 + clarity * 0.15 + consistency * 0.15), 1)

        # Strengths
        strengths = [
            f"Consistently championed the '{position.upper()}' stance on {topic}.",
            "Demonstrated strong rhetorical clarity under progressive adversarial cross-examination.",
            "Formulated distinct counter-warrants when challenged on core premises."
        ]

        # Weaknesses
        weaknesses = []
        if evidence < 8.0:
            weaknesses.append("Relied heavily on conceptual rationales rather than third-party empirical metrics.")
        if logic < 8.5:
            weaknesses.append("Occasional vulnerability to absolute formulations and unstated structural assumptions.")
        if not weaknesses:
            weaknesses.append("Could further anticipate opposing systemic second-order externalities.")

        # Improvement suggestions
        improvement_suggestions = [
            "Cite concrete statistical metrics or empirical case studies in opening arguments.",
            "Preemptively concede minor operational trade-offs to insulate your core principle.",
            "Formulate specific quantitative boundaries to test the falsifiability of counter-claims."
        ]

        return {
            "debate_id": state.get("debate_id", ""),
            "logic": logic,
            "evidence": evidence,
            "rebuttal": rebuttal,
            "clarity": clarity,
            "consistency": consistency,
            "overall": overall,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "improvement_suggestions": improvement_suggestions,
        }

response_evaluator_node = ResponseEvaluatorNode()
debate_judge_node = DebateJudgeNode()
