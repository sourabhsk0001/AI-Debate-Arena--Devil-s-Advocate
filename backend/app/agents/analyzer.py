import logging
from typing import Dict, Any, List
from app.agents.state import DebateGraphState

logger = logging.getLogger(__name__)

class ArgumentAnalyzerNode:
    """
    Node 1 & 2: Argument Analyzer & Weakness Detector.
    Returns structured JSON strictly conforming to Section 12:
    {
      "claim": "...",
      "assumptions": ["..."],
      "strengths": ["..."],
      "weaknesses": ["..."],
      "logical_issues": ["..."],
      "evidence_needed": ["..."]
    }
    """
    def analyze(self, state: DebateGraphState) -> Dict[str, Any]:
        user_arg = state.get("current_input", "").strip()
        lower_arg = user_arg.lower()
        topic = state.get("topic", "")

        # 1. Claim extraction
        first_sentence = user_arg.split(".")[0].strip() if "." in user_arg else user_arg
        claim = first_sentence if len(first_sentence) < 90 else first_sentence[:87] + "..."

        # 2. Assumptions extraction
        assumptions = []
        if "because" in lower_arg:
            assumptions.append("Assumes direct causation between stated rationale and broader outcome.")
        else:
            assumptions.append("Assumes initial premise operates as a self-evident truth without qualification.")

        if "remote" in lower_arg or "office" in lower_arg:
            assumptions.append("Assumes worker productivity can be uniformly maintained outside centralized facilities.")
        elif "ai" in lower_arg or "software" in lower_arg:
            assumptions.append("Assumes algorithmic capabilities cleanly substitute for human contextual synthesis.")
        else:
            assumptions.append("Assumes implementation trade-offs are negligible compared to primary benefits.")

        # 3. Strengths
        strengths = [
          "Articulates a clear, affirmative rhetorical thesis.",
          "Maintains direct alignment with chosen debate motion."
        ]

        # 4. Weaknesses & Logical Issues
        weaknesses = []
        logical_issues = []

        if len(user_arg.split()) < 25:
            weaknesses.append("Superficial brevity lacking supporting warrants and historical precedent.")
            logical_issues.append("Unsubstantiated Premise")
        else:
            weaknesses.append("Vulnerable to second-order systemic externalities and economic counterweights.")

        if any(w in lower_arg for w in ["always", "never", "obviously", "everyone", "nobody"]):
            logical_issues.append("Hasty Generalization / Absolutism")
        if any(w in lower_arg for w in ["will lead to disaster", "slippery slope", "inevitably destroy"]):
            logical_issues.append("Slippery Slope Fallacy")
        if any(w in lower_arg for w in ["either", "or else", "the only"]):
            logical_issues.append("False Dilemma")

        if not logical_issues:
            logical_issues.append("Unwarranted Absolutism")

        # 5. Evidence Needed
        evidence_needed = [
            f"Empirical field trials or peer-reviewed studies verifying {topic.lower()}.",
            "Longitudinal statistical analysis on adverse stakeholder trade-offs."
        ]

        analysis = {
            "claim": claim,
            "assumptions": assumptions,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "logical_issues": logical_issues,
            "evidence_needed": evidence_needed,
        }

        return analysis

argument_analyzer_node = ArgumentAnalyzerNode()
