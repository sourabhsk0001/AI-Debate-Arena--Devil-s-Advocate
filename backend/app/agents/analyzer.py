import logging
import re
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
    def _is_hinglish(self, text: str) -> bool:
        hinglish_words = ["kya", "hai", "krna", "karna", "sahi", "kaise", "kyu", "kyun", "nahi", "hoga", "bhi", "toh", "accha", "acha"]
        tokens = set(re.findall(r'\b\w+\b', text.lower()))
        return len(tokens.intersection(hinglish_words)) >= 1

    def analyze(self, state: DebateGraphState) -> Dict[str, Any]:
        user_arg = state.get("current_input", "").strip()
        lower_arg = user_arg.lower()
        topic = state.get("topic", "")
        is_hinglish = self._is_hinglish(user_arg)

        # 1. Claim extraction
        first_sentence = user_arg.split(".")[0].strip() if "." in user_arg else user_arg
        claim = first_sentence if len(first_sentence) < 90 else first_sentence[:87] + "..."

        # 2. Domain & Assumptions extraction
        assumptions = []
        is_engineering = any(w in lower_arg for w in ["engineer", "engineering", "btech", "degree", "cs", "coding", "software"])
        is_question = user_arg.endswith("?") or lower_arg.startswith("kya") or lower_arg.startswith("is ") or lower_arg.startswith("should ")

        if is_hinglish:
            if is_engineering:
                assumptions.append("Maan kar chal rahe hain ki engineering degree aaj ke market me guaranteed job ya high package dilwayegi.")
                assumptions.append("AI aur code-generation tools ke impact ko secondary maan rahe hain.")
            elif is_question:
                assumptions.append("Yeh assume kiya ja raha hai ki is sawal ka ek sidha 'haan' ya 'na' me jawab ho sakta hai bina trade-offs ke.")
            else:
                assumptions.append("Assumes ki bina deep statistical data ke yeh claim ground reality par valid hai.")
        else:
            if is_engineering:
                assumptions.append("Assumes an engineering degree consistently provides positive career ROI despite high market saturation.")
                assumptions.append("Assumes generative AI will not compress entry-level developer compensation.")
            elif is_question:
                assumptions.append("Assumes the proposition has a binary favorable answer independent of individual aptitude and market conditions.")
            elif "because" in lower_arg:
                assumptions.append("Assumes direct causation between stated rationale and broader outcome.")
            else:
                assumptions.append("Assumes initial premise operates as a self-evident truth without qualification.")

        # 3. Strengths
        if is_hinglish:
            strengths = [
                "Real-world career aur practical viability par direct sawal uthaya hai.",
                "Debate ke core dilemma ko challenge kiya hai."
            ]
        else:
            strengths = [
                "Directly engages with real-world institutional dilemma.",
                "Presents an actionable debate premise."
            ]

        # 4. Weaknesses & Logical Issues
        weaknesses = []
        logical_issues = []

        if is_question:
            if is_hinglish:
                weaknesses.append("Bina apna paksh (stance) rakhe seedha sawal pucha hai, jisse burden of proof opposers par shift ho jata hai.")
            else:
                weaknesses.append("Phrased as an open-ended inquiry rather than establishing an affirmative warrant.")
            logical_issues.append("Unwarranted Assertion / Shifting Burden of Proof")
        elif len(user_arg.split()) < 15:
            if is_hinglish:
                weaknesses.append("Argument bahut chhota hai, jisme supporting data ya facts ki kami hai.")
            else:
                weaknesses.append("Superficial brevity lacking supporting warrants and historical precedent.")
            logical_issues.append("Unsubstantiated Premise")

        if not weaknesses:
            if is_hinglish:
                weaknesses.append("Second-order trade-offs aur adverse side-effects ko address nahi kiya gaya hai.")
            else:
                weaknesses.append("Vulnerable to second-order systemic externalities and economic counterweights.")

        if any(w in lower_arg for w in ["always", "never", "obviously", "everyone", "nobody", "sabse", "har koi"]):
            logical_issues.append("Hasty Generalization / Absolutism")
        if any(w in lower_arg for w in ["will lead to disaster", "slippery slope", "khatam ho jayega"]):
            logical_issues.append("Slippery Slope Fallacy")
        if any(w in lower_arg for w in ["either", "or else", "the only"]):
            logical_issues.append("False Dilemma")

        if not logical_issues:
            logical_issues.append("Unsubstantiated Premise")


        # 5. Evidence Needed
        if is_engineering:
            evidence_needed = [
                "National Employability Reports and fresher campus placement placement statistics.",
                "Impact analysis of generative AI and automated software tools on entry-level hiring."
            ]
        else:
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
