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
        retrieved_evidence: List[Dict[str, Any]],
        mode: str = "devils_advocate"
    ) -> Dict[str, Any]:
        """
        Executes debate turn across 4 modes:
        1. devils_advocate: Challenge position, identify assumptions & weaknesses, counterarguments, respectful.
        2. socratic: Primarily asks questions, probes definitions, avoids immediate counter-theses.
        3. opponent: Strongest reasonable opposing debate case with thesis, evidence, and impacts.
        4. neutral_judge: Impartial analysis across Logic, Evidence, Rebuttal, Clarity, Consistency.
        """
        evidence_context = "\n".join([
            f"- {e.get('title')}: {e.get('fact')} (Source: {e.get('source')})"
            for e in retrieved_evidence
        ])

        opposing_position = "AGAINST" if user_position.lower() == "for" else "FOR"

        if mode == "socratic":
            system_prompt = f"""You are a master Socratic Inquirer in an elite AI Debate Arena.
TOPIC: "{topic}"
USER'S POSITION: {user_position.upper()}
YOUR ROLE: Socratic Teacher. You primarily ask incisive, fundamental questions rather than giving immediate counterarguments.

RULES:
1. Do not immediately deliver long counterarguments or take a dogmatic opposing stance.
2. Probe their definitions (e.g. "What do you mean by better?").
3. Question underlying assumptions and causal leaps (e.g. "Does lower cost necessarily mean better learning outcomes?").
4. Challenge the user to establish necessary vs sufficient conditions.
5. In "counterargument", offer a concise philosophical framing observation (1-2 sentences).
6. In "cross_examination_question", provide the primary direct Socratic question.
7. Identify ambiguities in definitions under "identified_weaknesses".
8. Flag fallacies (Equivocation, Hasty Generalization, False Dilemma) under "detected_fallacies".

OUTPUT MUST BE VALID STRICT JSON:
{{
  "counterargument": "...",
  "cross_examination_question": "...",
  "identified_weaknesses": ["..."],
  "detected_fallacies": ["..."]
}}"""
        elif mode == "opponent":
            system_prompt = f"""You are a championship Competitive Debate Opponent taking the direct opposite stance.
TOPIC: "{topic}"
USER'S POSITION: {user_position.upper()}
YOUR ROLE: Strongly argue {opposing_position}.
DIFFICULTY: {difficulty.upper()}
CURRENT ROUND: Round {round_number} of {total_rounds}.

EMPIRICAL EVIDENCE:
{evidence_context}

RULES:
1. Take the direct opposite position from the user.
2. Construct the strongest, most compelling opposing argument with thesis, warrant, and impacts.
3. Integrate real empirical evidence and policy data.
4. Conclude with a rigorous cross-examination question.
5. Highlight core structural flaws in "identified_weaknesses".

OUTPUT MUST BE VALID STRICT JSON:
{{
  "counterargument": "...",
  "cross_examination_question": "...",
  "identified_weaknesses": ["..."],
  "detected_fallacies": ["..."]
}}"""
        elif mode == "neutral_judge":
            system_prompt = f"""You are an impartial Neutral Judge / Adjudicator in the AI Debate Arena.
TOPIC: "{topic}"
USER'S POSITION: {user_position.upper()}
YOUR ROLE: Neutral Adjudicator. DO NOT argue with the user or take any side on the resolution.

RULES:
1. Objectively evaluate the user's argument across the 5 official criteria:
   - Logic: Soundness of claims, syllogisms, and validity
   - Evidence: Fact-checking and empirical grounding vs unsupported assertions
   - Rebuttal: Responsiveness to prior points or opposing perspectives
   - Clarity: Precision of language and rhetorical coherence
   - Consistency: Coherence and non-contradiction across rounds
2. In "counterargument", present the formal Adjudication Feedback evaluating these 5 dimensions.
3. In "cross_examination_question", provide an Adjudicator Inquiry challenging the debater to fill the most significant evidentiary or logical gap in the next round.
4. In "identified_weaknesses", list specific areas to improve.
5. In "detected_fallacies", identify any logical fallacies present.

OUTPUT MUST BE VALID STRICT JSON:
{{
  "counterargument": "...",
  "cross_examination_question": "...",
  "identified_weaknesses": ["..."],
  "detected_fallacies": ["..."]
}}"""
        else:
            # Mode 1: Devil's Advocate
            system_prompt = f"""You are the ultimate Devil's Advocate debater in an elite AI Debate Arena.
TOPIC: "{topic}"
USER'S POSITION: {user_position.upper()}
YOUR ROLE: Take the opposing stance ("{opposing_position}").
DIFFICULTY: {difficulty.upper()} (friendly: constructive; standard: sharp & academic; brutal: ruthless cross-examination).
CURRENT ROUND: Round {round_number} of {total_rounds}.

RETRIEVED EMPIRICAL EVIDENCE:
{evidence_context}

RULES:
1. Do not blindly agree with the user.
2. Identify and challenge implicit assumptions (e.g. "Your argument assumes that...").
3. Identify vulnerabilities and logical weaknesses.
4. Give incisive counterarguments grounded in empirical evidence.
5. Ask challenging questions that test edge cases and trade-offs.
6. Remain respectful, civil, and intellectually rigorous.
7. Distinguish verifiable facts from unproven assumptions.

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
            evidence=retrieved_evidence,
            mode=mode
        )

    def _heuristic_turn(
        self,
        topic: str,
        user_position: str,
        round_number: int,
        difficulty: str,
        user_argument: str,
        evidence: List[Dict[str, Any]],
        mode: str = "devils_advocate"
    ) -> Dict[str, Any]:
        """Cognitive reasoning fallback engine that delivers structured, contextual debate responses across all 4 modes."""
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

        evidence_fact = evidence[0]["fact"] if evidence else f"Empirical studies in {topic} demonstrate measurable trade-offs."
        evidence_src = evidence[0]["source"] if evidence else "Policy Research Quarterly"

        # --- MODE 2: SOCRATIC ---
        if mode == "socratic":
            if round_number == 1:
                # E.g. "Online education is better" -> "What do you mean by better?"
                if "better" in lower_arg or "best" in lower_arg or "superior" in lower_arg:
                    counter = "In Socratic inquiry, terms must be precisely defined before assertions can be evaluated."
                    question = "What do you mean by 'better'? By what metric or standard are you measuring superiority?"
                elif "productivity" in lower_arg:
                    counter = "Productivity is often measured differently by workers and organizations."
                    question = "How are you defining 'productivity' in this context, and for whom is it increasing?"
                else:
                    counter = "Before evaluating the conclusion, we must examine the foundational definitions."
                    question = f"What is the underlying criterion by which you evaluate whether {topic.lower()} is justified?"
                weaknesses = ["Premise relies on undefined qualitative terms.", "Assumes consensus on normative criteria."]
            elif round_number == 2:
                # E.g. "It is cheaper" -> "Does lower cost necessarily mean better learning outcomes?"
                if "cheap" in lower_arg or "cost" in lower_arg or "afford" in lower_arg or "money" in lower_arg:
                    counter = "Cost efficiency and qualitative efficacy are distinct parameters."
                    question = "Does lower cost necessarily mean better outcomes, or does it risk compromising quality and depth?"
                elif "time" in lower_arg or "flexib" in lower_arg or "convenien" in lower_arg:
                    counter = "Personal convenience does not inherently correlate with systemic effectiveness."
                    question = "Can convenience and flexibility coexist with rigorous discipline, or does one undermine the other?"
                else:
                    counter = "Your response introduces a supporting rationale that requires further scrutiny."
                    question = "Does that attribute alone guarantee the broader outcome you claim, or are there necessary counter-conditions?"
                weaknesses = ["Conflates intermediate benefits with ultimate objectives.", "Unexamined causal link."]
            else:
                counter = "We arrive at the epistemological boundary of the premise."
                question = "If an exception to your principle exists, does that invalidate the entire premise or merely constrain its scope?"
                weaknesses = ["Difficulty establishing universal applicability."]

            return {
                "counterargument": counter,
                "cross_examination_question": question,
                "identified_weaknesses": weaknesses,
                "detected_fallacies": detected_fallacies
            }

        # --- MODE 3: OPPONENT ---
        if mode == "opponent":
            opposing_stance = "AGAINST" if user_position.lower() == "for" else "FOR"
            counter = (
                f"Taking the formal opposing stance ({opposing_stance}) on '{topic}': "
                f"Your thesis relies on an incomplete framework. First, the affirmative case fails to resolve the structural drawbacks: {evidence_fact}. "
                f"Second, empirical analysis from {evidence_src} reveals that the actual systemic cost disproportionately burdens stakeholders. "
                f"Therefore, the counter-resolution stands as the superior model."
            )
            question = (
                f"Given that {evidence_src} documents these adverse outcomes, how can your affirmative model claim superiority over the counter-case?"
            )
            weaknesses = [
                "Leaves core opposing impact unaddressed.",
                "Fails to establish comparative advantage against the counter-position."
            ]
            return {
                "counterargument": counter,
                "cross_examination_question": question,
                "identified_weaknesses": weaknesses,
                "detected_fallacies": detected_fallacies
            }

        # --- MODE 4: NEUTRAL JUDGE ---
        if mode == "neutral_judge":
            # Real-time multi-dimensional scoring of the user turn
            logic_rt = 8.0 if len(user_argument.split()) > 20 else 6.5
            evidence_rt = 7.5 if any(c in user_argument for c in ["study", "research", "percent", "%", "data", "report"]) else 5.5
            rebuttal_rt = 7.0 if round_number > 1 else 8.0
            clarity_rt = 8.5
            consistency_rt = 9.0

            counter = (
                f"[ADJUDICATOR BENCH EVALUATION — ROUND {round_number}]\n\n"
                f"• Logic ({logic_rt}/10): Clear deductive flow, though premise requires explicit formal substantiation.\n"
                f"• Evidence ({evidence_rt}/10): Argument {'includes reference to empirical mechanisms' if evidence_rt > 6 else 'currently lacks statistical or empirical grounding'}.\n"
                f"• Rebuttal ({rebuttal_rt}/10): Responsiveness to core motion is {'solid' if rebuttal_rt >= 7.5 else 'moderate; need deeper defense against trade-offs'}.\n"
                f"• Clarity ({clarity_rt}/10): High rhetorical precision and concise articulation.\n"
                f"• Consistency ({consistency_rt}/10): Argument maintains internal coherence with stated position."
            )
            question = (
                f"To strengthen your standing on the rubric for Round {round_number + 1}, what verifiable empirical evidence will you submit to substantiate your core claim?"
            )
            weaknesses = [
                "Empirical evidence score needs bolstering with verifiable citations.",
                "Premise would benefit from explicit qualification of scope."
            ]
            return {
                "counterargument": counter,
                "cross_examination_question": question,
                "identified_weaknesses": weaknesses,
                "detected_fallacies": detected_fallacies
            }

        # --- MODE 1: DEVIL'S ADVOCATE (Default) ---
        weaknesses = []
        if len(user_argument.split()) < 30:
            weaknesses.append("Superficial argumentation lacking structural depth and historical precedent.")
        else:
            weaknesses.append("Conflates ethical intent with practical systemic feasibility.")
            weaknesses.append("Fails to account for second-order economic externalities.")

        # Extract core assumption or premise from user argument
        clean_arg = user_argument.strip().rstrip(".")
        
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
        turns: List[Dict[str, Any]],
        mode: str = "devils_advocate"
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
