import logging
from typing import Dict, Any, Optional
from app.agents.state import DebateGraphState
from app.agents.analyzer import argument_analyzer_node
from app.agents.generator import devil_advocate_generator_node
from app.agents.evaluator import response_evaluator_node, debate_judge_node
from app.rag.retriever import rag_retriever

logger = logging.getLogger(__name__)

# Check if LangGraph is available
try:
    from langgraph.graph import StateGraph, END
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False
    END = "__end__"

class DebateAgentWorkflow:
    """
    LangGraph-powered state workflow implementing the full 7-step Cognitive Agent architecture:
    START -> argument_analyzer -> evidence_retriever -> devil_advocate -> response_evaluator -> (debate_judge if completed -> END)
    """

    def __init__(self):
        self._compiled_graph = None
        if LANGGRAPH_AVAILABLE:
            self._build_langgraph()

    def _node_analyze(self, state: DebateGraphState) -> Dict[str, Any]:
        logger.info(f"LangGraph [Node 1 & 2]: Analyzing argument in round {state.get('round')}")
        analysis = argument_analyzer_node.analyze(state)
        return {"analysis": analysis}

    def _node_retrieve_evidence(self, state: DebateGraphState) -> Dict[str, Any]:
        logger.info(f"LangGraph [Node 3]: Retrieving empirical evidence for '{state.get('topic')}'")
        evidence = rag_retriever.retrieve_evidence(
            topic=state.get("topic", ""),
            query=state.get("current_input", "")
        )
        return {"evidence": evidence}

    def _node_generate_counter(self, state: DebateGraphState) -> Dict[str, Any]:
        logger.info(f"LangGraph [Node 4 & 5]: Generating counterargument for mode '{state.get('mode')}'")
        counter = devil_advocate_generator_node.generate(state)
        return {"counter": counter}

    def _node_evaluate_round(self, state: DebateGraphState) -> Dict[str, Any]:
        logger.info(f"LangGraph [Node 6]: Scoring round {state.get('round')}")
        scores = response_evaluator_node.evaluate_round(state)
        return {"scores": scores}

    def _node_judge_debate(self, state: DebateGraphState) -> Dict[str, Any]:
        logger.info(f"LangGraph [Node 7]: Adjudicating final debate results for {state.get('debate_id')}")
        evaluation = debate_judge_node.judge(state)
        return {"evaluation": evaluation, "status": "completed"}

    def _should_conclude(self, state: DebateGraphState) -> str:
        current_round = state.get("round", 1)
        max_rounds = state.get("max_rounds", 5)
        if current_round >= max_rounds:
            return "debate_judge"
        return END

    def _build_langgraph(self):
        try:
            builder = StateGraph(DebateGraphState)

            builder.add_node("argument_analyzer", self._node_analyze)
            builder.add_node("evidence_retriever", self._node_retrieve_evidence)
            builder.add_node("devil_advocate", self._node_generate_counter)
            builder.add_node("response_evaluator", self._node_evaluate_round)
            builder.add_node("debate_judge", self._node_judge_debate)

            builder.set_entry_point("argument_analyzer")
            builder.add_edge("argument_analyzer", "evidence_retriever")
            builder.add_edge("evidence_retriever", "devil_advocate")
            builder.add_edge("devil_advocate", "response_evaluator")

            builder.add_conditional_edges(
                "response_evaluator",
                self._should_conclude,
                {
                    "debate_judge": "debate_judge",
                    END: END
                }
            )
            builder.add_edge("debate_judge", END)

            self._compiled_graph = builder.compile()
            logger.info("LangGraph StateGraph successfully compiled.")
        except Exception as e:
            logger.warning(f"LangGraph compilation fallback: {e}")
            self._compiled_graph = None

    async def run_round(self, state: DebateGraphState) -> DebateGraphState:
        """
        Executes one full turn through the cognitive workflow.
        Works with compiled LangGraph or direct deterministic pipeline fallback.
        """
        # If compiled LangGraph is available, run graph
        if self._compiled_graph is not None:
            try:
                res = await self._compiled_graph.ainvoke(state)
                return res
            except Exception as e:
                logger.warning(f"LangGraph execution exception: {e}. Executing sequential pipeline.")

        # Pipeline execution
        # 1. Argument Analyzer & Weakness Detector
        analysis_res = self._node_analyze(state)
        state.update(analysis_res)

        # 2. Evidence Retriever
        evidence_res = self._node_retrieve_evidence(state)
        state.update(evidence_res)

        # 3. Devil's Advocate & Question Generator
        counter_res = self._node_generate_counter(state)
        state.update(counter_res)

        # 4. Response Evaluator
        eval_res = self._node_evaluate_round(state)
        state.update(eval_res)

        # 5. Check if debate judge should run
        if state.get("round", 1) >= state.get("max_rounds", 5):
            judge_res = self._node_judge_debate(state)
            state.update(judge_res)
        else:
            state["status"] = "active"

        return state

    def judge_immediately(self, state: DebateGraphState) -> Dict[str, Any]:
        """Adjudicates debate immediately (for /evaluate or /conclude)."""
        return debate_judge_node.judge(state)

debate_workflow = DebateAgentWorkflow()
