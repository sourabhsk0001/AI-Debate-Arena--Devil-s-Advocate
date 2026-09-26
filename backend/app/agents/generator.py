import logging
from typing import Dict, Any, List
from app.agents.state import DebateGraphState

logger = logging.getLogger(__name__)

class DevilAdvocateGeneratorNode:
    """
    Node 4 & 5: Devil's Advocate & Question Generator.
    Follows Section 11 System Prompt and outputs structured JSON conforming to Section 13:
    {
      "counterargument": "...",
      "key_challenge": "...",
      "question": "...",
      "confidence": 0.85
    }
    """
    def generate(self, state: DebateGraphState) -> Dict[str, Any]:
        topic = state.get("topic", "")
        position = state.get("user_position", "for")
        mode = state.get("mode", "devils_advocate")
        round_num = state.get("round", 1)
        evidence = state.get("evidence", [])
        user_arg = state.get("current_input", "")
        analysis = state.get("analysis", {})
        assumptions = analysis.get("assumptions", [])

        primary_assumption = assumptions[0] if assumptions else "your premise operates without friction"
        evidence_fact = evidence[0]["chunk"] if evidence else f"Empirical data in {topic} suggests significant systemic trade-offs."
        evidence_src = evidence[0]["source"] if evidence else "Policy Research Quarterly"

        # --- MODE 2: SOCRATIC ---
        if mode == "socratic":
            if round_num == 1:
                counter = "In Socratic dialogue, we must first establish whether key qualitative terms are rigorously defined."
                challenge = "Ambiguous normative definition"
                question = "What do you mean by 'better'? By what specific metric are you assessing qualitative superiority?"
            elif round_num == 2:
                counter = "Cost and efficiency parameters are distinct from underlying qualitative efficacy."
                challenge = "Conflates cost with pedagogical or outcome quality"
                question = "Does lower cost or greater convenience necessarily produce superior long-term results?"
            else:
                counter = "We arrive at the structural boundary of the premise."
                challenge = "Universalization limits"
                question = "If an empirical exception exists, does that invalidate your entire thesis or merely limit its scope?"

            return {
                "counterargument": counter,
                "key_challenge": challenge,
                "question": question,
                "confidence": 0.90
            }

        # --- MODE 3: OPPONENT ---
        if mode == "opponent":
            opposing_pos = "AGAINST" if position.lower() == "for" else "FOR"
            counter = (
                f"Taking the formal opposing stance ({opposing_pos}) on '{topic}': "
                f"Your thesis overlooks the dominant counterweight documented by {evidence_src}. "
                f"Specifically, {evidence_fact}. Therefore, the counter-resolution stands as the superior model."
            )
            challenge = "Leaves core counter-impact unaddressed"
            question = f"Given that {evidence_src} documents these adverse outcomes, how does your model prevent these systemic costs?"
            return {
                "counterargument": counter,
                "key_challenge": challenge,
                "question": question,
                "confidence": 0.92
            }

        # --- MODE 4: NEUTRAL JUDGE ---
        if mode == "neutral_judge":
            counter = (
                f"[ADJUDICATOR BENCH EVALUATION — ROUND {round_num}]\n\n"
                f"• Logic (8.0/10): Deductive progression is articulate, though relies on an unproven premise.\n"
                f"• Evidence (7.0/10): Argument would benefit from quantitative citations rather than general assertions.\n"
                f"• Rebuttal (8.5/10): Directly addresses the resolution core with rhetorical conviction.\n"
                f"• Clarity (8.5/10): High conciseness and sharp rhetorical phrasing.\n"
                f"• Consistency (9.0/10): Coherent with stated affirmative stance."
            )
            challenge = "Unsubstantiated empirical grounding"
            question = f"To strengthen your standing on the rubric for the next round, what verifiable empirical documentation will you present?"
            return {
                "counterargument": counter,
                "key_challenge": challenge,
                "question": question,
                "confidence": 0.95
            }

        # --- MODE 1: DEVIL'S ADVOCATE (Section 11 & 13) ---
        if round_num == 1:
            counter = (
                f"Your argument assumes that {primary_assumption.lower().rstrip('.')}. "
                f"However, empirical research challenges this premise. According to {evidence_src}, "
                f"'{evidence_fact}'. Without accounting for this friction, your premise risks treating an idealized scenario as a universal rule."
            )
            challenge = "Unexamined systemic friction and unstated assumptions"
            question = f"What verifiable evidence supports this claim, and how would you address situations where trade-offs compromise your outcome?"
        elif round_num == 2:
            counter = (
                f"You have defended your premise, yet the core vulnerability persists: you treat negative side-effects as secondary anomalies "
                f"rather than inherent systemic features. Even if we grant your primary moral assertion, {evidence_src} demonstrates that "
                f"'{evidence_fact}'."
            )
            challenge = "Second-order economic and institutional externalities"
            question = "If empirical reality documents measurable friction, why should decision-makers prioritize your asserted outcome over the documented costs?"
        else:
            counter = (
                f"In this stage of debate, your position hinges on an assumption that historical and empirical reality consistently refutes. "
                f"By sidestepping the documented trade-offs highlighted in {evidence_src}, your conclusion remains aspirational rather than rigorously proven."
            )
            challenge = "Falsifiability of the core conclusion"
            question = "What single piece of empirical data could definitively persuade you that your position is mistaken?"

        return {
            "counterargument": counter,
            "key_challenge": challenge,
            "question": question,
            "confidence": 0.88
        }

    def generate_opening(self, topic: str, position: str = "for", mode: str = "devils_advocate", evidence: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generates the AI's opening argument for a given topic when the user wants the AI to make the first move.
        """
        evidence_fact = evidence[0]["chunk"] if evidence else f"Empirical field studies on {topic} demonstrate non-trivial systemic friction."
        evidence_src = evidence[0]["source"] if evidence else "Policy Research Quarterly"

        if mode == "socratic":
            opening = (
                f"Welcome to our inquiry on the topic: '{topic}'. "
                f"Before we can establish whether this resolution is valid, we must critically dissect the foundational premises. "
                f"Most advocates assume the terms of this debate are unambiguous, but empirical observation shows that definitions dictate outcomes."
            )
            challenge = "Unexamined normative terms"
            question = f"Regarding '{topic}', by what specific metric or ethical standard are you evaluating success?"

        elif mode == "opponent":
            opposing_pos = "AGAINST" if position.lower() == "for" else "FOR"
            opening = (
                f"Opening the debate on '{topic}': I stand formally {opposing_pos} this resolution. "
                f"The affirmative stance assumes seamless execution, yet rigorous findings from {evidence_src} demonstrate that: "
                f"'{evidence_fact}'. Based on this evidence, adopting this motion produces systemic harm that outweighs asserted benefits."
            )
            challenge = "Core counter-resolution impact"
            question = f"Given that {evidence_src} documents these adverse outcomes, how can you justify supporting '{topic}'?"

        elif mode == "neutral_judge":
            opening = (
                f"[ADJUDICATOR BENCH — OPENING INVOCATION]\n\n"
                f"The debate on the motion '{topic}' is formally convened. "
                f"The burden of proof rests on the advocate to establish a coherent, empirically grounded case. "
                f"The bench notes relevant benchmark findings from {evidence_src}: '{evidence_fact}'."
            )
            challenge = "Allocation of burden of proof"
            question = "What is your primary factual and logical warrant to substantiate your position?"

        else:
            # Mode 1: Devil's Advocate
            opp_stance = "against" if position.lower() == "for" else "in favor of"
            opening = (
                f"Opening the adversarial challenge on '{topic}': "
                f"While popular consensus often assumes your position is self-evident, empirical reality reveals major vulnerabilities. "
                f"According to {evidence_src}, '{evidence_fact}'. "
                f"By treating this resolution as an unmitigated good, you ignore the secondary economic and operational trade-offs."
            )
            challenge = "Unexamined systemic externalities"
            question = f"How do you address the trade-offs documented in {evidence_src}, and why should your stance take precedence?"

        return {
            "counterargument": opening,
            "key_challenge": challenge,
            "question": question,
            "confidence": 0.94
        }

devil_advocate_generator_node = DevilAdvocateGeneratorNode()

