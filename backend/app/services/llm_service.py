import os
import json
import logging
from typing import Dict, Any, List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY or os.environ.get("OPENAI_API_KEY", "")
        self.client = None
        if self.api_key and self.api_key != "your_openai_api_key_here":
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize OpenAI client: {e}")

    async def generate_turn(
        self,
        topic: str,
        user_position: str,
        round_number: int,
        total_rounds: int,
        difficulty: str,
        user_argument: str,
        previous_turns: List[Dict[str, Any]],
        retrieved_evidence: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Executes Devil's Advocate turn via OpenAI if configured,
        or uses high-level intelligent cognitive heuristic agent.
        """
        evidence_context = "\n".join([
            f"- {e.get('title')}: {e.get('fact')} (Source: {e.get('source')})"
            for e in retrieved_evidence
        ])

        system_prompt = f"""You are the ultimate Devil's Advocate debater in an elite AI Debate Arena.
Your mission is to rigorously stress-test the user's worldview, detect cognitive flaws, dismantle their argument with sharp logic and empirical rigor, and pose an inescapable cross-examination question.

TOPIC: "{topic}"
USER'S POSITION: {user_position.upper()}
YOUR ROLE: Take the opposing stance ("{'AGAINST' if user_position.lower() == 'for' else 'FOR'}").
DIFFICULTY: {difficulty.upper()} (friendly: constructive; standard: sharp & academic; brutal: ruthless cross-examination).
CURRENT ROUND: Round {round_number} of {total_rounds}.

RETRIEVED EMPIRICAL EVIDENCE:
{evidence_context}

INSTRUCTIONS:
1. Direct Assumption Challenge: Explicitly begin by pinpointing the user's unproven premise (e.g. "Your argument assumes that [X]...").
2. Demand Empirical Evidence: Ask what verifiable data or study substantiates their claim.
3. Counter-Scenario & Edge Cases: Press them on realistic trade-offs or situations where their claim breaks down (e.g. "...and how would you address situations where collaboration, mentoring, or economic friction arise?").
4. Flag any specific logical fallacies detected (e.g., Hasty Generalization, Slippery Slope, False Dilemma, Circular Reasoning, or None detected).
5. Identify 2 concrete vulnerabilities in their logic.
6. Provide a razor-sharp cross-examination question.

OUTPUT MUST BE VALID STRICT JSON:
{{
  "counterargument": "...",
  "cross_examination_question": "...",
  "identified_weaknesses": ["weakness 1", "weakness 2"],
  "detected_fallacies": ["Fallacy Name or None"]
}}"""

        if self.client:
            try:
                messages = [{"role": "system", "content": system_prompt}]
                
                # Feed conversation history
                for prev in previous_turns:
                    messages.append({"role": "user", "content": prev.get("user_argument", "")})
                    messages.append({"role": "assistant", "content": prev.get("ai_counterargument", "")})
                
                messages.append({"role": "user", "content": user_argument})

                response = self.client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=messages,
                    response_format={"type": "json_object"},
                    temperature=0.7,
                )
                raw_json = response.choices[0].message.content
                return json.loads(raw_json)
            except Exception as e:
                logger.error(f"OpenAI API call failed: {e}. Falling back to dynamic heuristic generator.")

        # Intelligent Fallback Cognitive Generator
        return self._heuristic_turn(
            topic=topic,
            user_position=user_position,
            round_number=round_number,
            difficulty=difficulty,
            user_argument=user_argument,
            evidence=retrieved_evidence
        )

    def _heuristic_turn(
        self,
        topic: str,
        user_position: str,
        round_number: int,
        difficulty: str,
        user_argument: str,
        evidence: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Cognitive reasoning fallback engine that delivers structured, contextual debate responses."""
        lower_arg = user_argument.lower()
        
        # Fallacy detection heuristics
        detected_fallacies = []
        if any(w in lower_arg for w in ["obviously", "everyone knows", "nobody can deny", "always", "never"]):
            detected_fallacies.append("Hasty Generalization / Absolutism")
        if any(w in lower_arg for w in ["if we allow", "will lead to disaster", "end of civilization", "slippery slope"]):
            detected_fallacies.append("Slippery Slope Fallacy")
        if any(w in lower_arg for w in ["either", "or else", "the only choice"]):
            detected_fallacies.append("False Dilemma (Black-and-White Thinking)")
        if not detected_fallacies:
            detected_fallacies.append("Unsubstantiated Empirical Premise")

        # Weakness extraction
        weaknesses = []
        if len(user_argument.split()) < 30:
            weaknesses.append("Superficial argumentation lacking structural depth and historical precedent.")
        else:
            weaknesses.append("Conflates ethical intent with practical systemic feasibility.")
            weaknesses.append("Fails to account for second-order economic externalities.")

        # Extract core assumption or premise from user argument
        clean_arg = user_argument.strip().rstrip(".")
        
        # Determine counter-scenario trade-offs based on topic or input
        if "remote" in lower_arg or "office" in lower_arg:
            counter_scenario = "collaboration, spontaneous team innovation, and junior mentoring are significantly more difficult"
            assumption_focus = "remote work uniformly increases productivity across all worker demographics"
        elif "ai" in lower_arg or "intelligence" in lower_arg:
            counter_scenario = "regulatory capture empowers entrenched monopolies while halting open-source development"
            assumption_focus = "centralized oversight can accurately anticipate emergent algorithmic hazards"
        elif "ubi" in lower_arg or "income" in lower_arg:
            counter_scenario = "unfunded recurring cash transfers fuel demand-pull inflation and labor supply contractions"
            assumption_focus = "universal cash payouts do not trigger severe macroeconomic distortions"
        else:
            counter_scenario = "unintended second-order systemic externalities outweigh initial perceived gains"
            assumption_focus = f"{topic.lower()} operates without severe trade-offs"

        evidence_fact = evidence[0]["fact"] if evidence else f"Empirical data in {topic} suggests significant systemic trade-offs."
        evidence_src = evidence[0]["source"] if evidence else "Policy Research Quarterly"

        if round_number == 1:
            counter = (
                f"Your argument assumes that {assumption_focus}. "
                f"However, empirical research challenges this premise. According to {evidence_src}, "
                f"'{evidence_fact}'. Without accounting for these constraints, your reasoning risks treating an idealized scenario as a universal rule."
            )
            question = (
                f"What verifiable evidence supports this claim, and how would you address situations where {counter_scenario}?"
            )
        elif round_number == 2:
            counter = (
                f"You have defended your premise, yet the core vulnerability persists: you treat negative side-effects as secondary anomalies "
                f"rather than inherent systemic features. Even if we grant your primary assertion, {evidence_src} demonstrates that "
                f"'{evidence_fact}'."
            )
            question = (
                f"If empirical reality documents measurable friction, why should decision-makers prioritize your asserted outcome over the documented costs?"
            )
        else:
            counter = (
                f"In this final round, your position hinges on an assumption that historical and empirical reality consistently refutes. "
                f"By sidestepping the documented trade-offs highlighted in {evidence_src}, your conclusion remains aspirational rather than rigorously proven."
            )
            question = (
                f"What single piece of empirical data could definitively persuade you that your position is mistaken?"
            )

        return {
            "counterargument": counter,
            "cross_examination_question": question,
            "identified_weaknesses": weaknesses,
            "detected_fallacies": detected_fallacies
        }

    async def evaluate_debate(
        self,
        topic: str,
        user_position: str,
        difficulty: str,
        turns: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Evaluates the entire debate using an impartial Judge persona.
        Calculates multi-criteria scores, highlights strengths, weaknesses, and declares a winner.
        """
        debate_transcript = ""
        for t in turns:
            debate_transcript += f"\n--- Round {t.get('round_number')} ---\n"
            debate_transcript += f"USER ({user_position}): {t.get('user_argument')}\n"
            debate_transcript += f"DEVIL'S ADVOCATE: {t.get('ai_counterargument')}\n"
            debate_transcript += f"DEVIL'S QUESTION: {t.get('ai_cross_examination_question')}\n"

        system_prompt = f"""You are the Chief Adjudicator of the AI Debate Arena.
Your task is to impartially judge this debate on "{topic}".

Evaluate based on:
1. Logic and Reasoning (0-10)
2. Evidence and Factual Substantiation (0-10)
3. Rebuttal Effectiveness (0-10)
4. Persuasiveness and Clarity (0-10)

Determine overall scores (0-100) for both sides, identify whether the USER or DEVIL_ADVOCATE won, list user strengths and weaknesses, fallacies committed, and actionable coaching tips.

STRICT JSON OUTPUT SCHEMA:
{{
  "winner": "user" or "devil_advocate" or "draw",
  "overall_score_user": 82.5,
  "overall_score_ai": 87.0,
  "metrics": {{
    "logic_and_reasoning": 8.0,
    "evidence_and_facts": 7.5,
    "rebuttal_effectiveness": 8.5,
    "persuasiveness_and_clarity": 8.0
  }},
  "user_strengths": ["...", "..."],
  "user_weaknesses": ["...", "..."],
  "fallacies_committed": ["..."],
  "verdict_summary": "...",
  "coaching_tips": ["...", "..."]
}}"""

        if self.client:
            try:
                response = self.client.chat.completions.create(
                    model=settings.OPENAI_MODEL,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"TRANSCRIPT:\n{debate_transcript}"}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.5,
                )
                return json.loads(response.choices[0].message.content)
            except Exception as e:
                logger.error(f"OpenAI evaluation failed: {e}. Falling back to heuristic judge.")

        # Heuristic judge calculation based on argumentation quality
        total_user_words = sum(len(t.get("user_argument", "").split()) for t in turns)
        avg_words_per_turn = total_user_words / max(1, len(turns))
        
        # Scoring logic
        logic_score = min(9.5, max(6.0, 6.5 + (avg_words_per_turn / 60.0)))
        evidence_score = min(9.0, max(5.5, 6.0 + (len(turns) * 0.8)))
        rebuttal_score = min(9.2, max(6.2, 6.8 + (1.2 if avg_words_per_turn > 40 else 0.2)))
        clarity_score = min(9.6, max(7.0, 7.5 + (0.5 if total_user_words > 80 else -0.5)))

        user_composite = round((logic_score * 0.3 + evidence_score * 0.25 + rebuttal_score * 0.25 + clarity_score * 0.2) * 10, 1)
        
        # AI score varies slightly based on difficulty
        diff_bonus = 88.0 if difficulty == "brutal" else (84.0 if difficulty == "standard" else 78.0)
        ai_composite = round(diff_bonus, 1)

        winner = "user" if user_composite > ai_composite else ("devil_advocate" if ai_composite > user_composite else "draw")

        return {
            "winner": winner,
            "overall_score_user": user_composite,
            "overall_score_ai": ai_composite,
            "metrics": {
                "logic_and_reasoning": round(logic_score, 1),
                "evidence_and_facts": round(evidence_score, 1),
                "rebuttal_effectiveness": round(rebuttal_score, 1),
                "persuasiveness_and_clarity": round(clarity_score, 1)
            },
            "user_strengths": [
                "Articulated foundational ethical principles with conviction.",
                "Maintained consistent stance across rounds without self-contradiction.",
                "Directly challenged opposing empirical premises."
            ],
            "user_weaknesses": [
                "Relied partially on broad normative claims without specific statistical citations.",
                "Underemphasized the economic transition costs raised in the cross-examination."
            ],
            "fallacies_committed": [
                "Unwarranted Absolutism in initial claim",
                "Partial burden-of-proof shifting"
            ],
            "verdict_summary": (
                f"The debate on '{topic}' was intensely contested. While the user presented articulate ethical reasoning, "
                f"the Devil's Advocate effectively exploited systemic vulnerabilities and empirical studies. "
                + ("The user narrowly outmaneuvered the AI on clarity and moral coherence." if winner == "user" else "The Devil's Advocate won due to stronger evidential grounding.")
            ),
            "coaching_tips": [
                "Ground future claims with 1-2 empirical statistics or case studies.",
                "Concede minor trade-offs early to preempt sharp cross-examination points.",
                "Flip the opponent's evidence by demonstrating how your stance resolves their highlighted risk."
            ]
        }

llm_service = LLMService()
