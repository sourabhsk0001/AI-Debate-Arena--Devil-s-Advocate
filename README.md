# AI Debate Arena — Devil's Advocate

> **Production-Quality Adversarial GenAI Platform for Argument Stress-Testing, Fallacy Detection, Empirical RAG Counter-Evidence, and Multi-Factor Adjudication.**

[![Next.js 14](https://img.shields.io/badge/Frontend-Next.js%2014%20(App%20Router)-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/AI%20Workflow-LangGraph-FF4F00?logo=langchain)](https://github.com/langchain-ai/langgraph)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/DevOps-Docker%20Compose-2496ED?logo=docker)](https://www.docker.com/)

---

## 🏛️ System Architecture

```text
                  ┌────────────────────────────────────────────────────────┐
                  │                 Next.js 14 Web Frontend                │
                  │   • Cyber-Dark AI SaaS Design (Obsidian & Crimson)     │
                  │   • Live Arena Transcript, Diagnostics, Scorecard      │
                  │   • Routes: /, /dashboard, /debate/new, /debate/[id],  │
                  │     /debate/[id]/results, /history                     │
                  └───────────────────────────┬────────────────────────────┘
                                              │ REST / JSON
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                  FastAPI Python Backend                │
                  │   • JWT Auth & Guest Session Management                │
                  │   • Full Section 20 REST API Spec                      │
                  │   • Resilient Storage (MongoDB Atlas + Fallback)       │
                  └───────────────────────────┬────────────────────────────┘
                                              │
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │            LangGraph Cognitive Architecture            │
                  │   START                                                │
                  │     ▼                                                  │
                  │   [1 & 2] argument_analyzer & weakness_detector        │
                  │     ▼                                                  │
                  │   [3] evidence_retriever (RAG Empirical Corpus)        │
                  │     ▼                                                  │
                  │   [4 & 5] devil_advocate & question_generator          │
                  │     ▼                                                  │
                  │   [6] response_evaluator (Rubric Scoring)              │
                  │     ▼                                                  │
                  │   (Rounds Complete? ──► [7] debate_judge ──► END)      │
                  └────────────────────────────────────────────────────────┘
```

---

## 🎭 4 Debate Modes

1. **Mode 1 — Devil's Advocate**:
   - Adversarially challenges user premises, identifies unstated assumptions, reveals vulnerabilities, and generates counter-warrants.
2. **Mode 2 — Socratic**:
   - Questions definitions, boundaries, and conflations without immediately presenting opposing factual assertions.
3. **Mode 3 — Opponent**:
   - Takes the strict formal opposing position (*For* vs *Against*) and constructs the strongest counter-resolution.
4. **Mode 4 — Neutral Judge**:
   - Bench adjudicator analyzing logic, evidence citations, rebuttal responsiveness, clarity, and consistency across each turn.

---

## 📊 5-Factor Adjudication Rubric (Section 16)

Evaluates user arguments on a 0–10 scale:
- **Logic**: Logical consistency, deductive validity, absence of informal fallacies.
- **Evidence**: Empirical grounding, verifiable data citations, statistical rigor.
- **Rebuttal**: Direct responsiveness to adversarial cross-examination.
- **Clarity**: Rhetorical conciseness, precision of language, persuasive framing.
- **Consistency**: Internal stability of core thesis across multiple debate rounds.

Plus qualitative feedback:
- **Strengths**: Observed structural merits.
- **Weaknesses**: Unaddressed counterweights.
- **Improvement Suggestions**: Actionable debater coaching advice.

---

## 📂 Project Structure

```text
ai-debate-arena/
├── frontend/                     # Next.js 14 App Router Frontend
│   ├── app/
│   │   ├── page.tsx              # Landing Page ("Think. Argue. Defend.")
│   │   ├── dashboard/page.tsx    # Debater Dashboard & Performance Metrics
│   │   ├── debate/new/page.tsx   # Debate Setup (Topic, Position, Mode, Intensity)
│   │   ├── debate/[id]/page.tsx  # 3-Column Live Arena & Diagnostics
│   │   ├── debate/[id]/results/  # Post-Debate Evaluation & Scorecards
│   │   └── history/page.tsx      # Filterable Match Archive
│   ├── components/               # 13 Production UI Components
│   ├── lib/api.ts                # Full API Client with Offline Fallback
│   └── types/debate.ts           # Comprehensive TypeScript Definitions
│
├── backend/                      # FastAPI Python Backend
│   ├── app/
│   │   ├── agents/               # LangGraph State & Cognitive Nodes
│   │   │   ├── analyzer.py       # Node 1 & 2: Claim & Weakness Detector
│   │   │   ├── generator.py      # Node 4 & 5: Counterargument & Question Generator
│   │   │   ├── evaluator.py      # Node 6 & 7: Round Scorer & Final Adjudicator
│   │   │   ├── graph.py          # StateGraph Orchestration Engine
│   │   │   └── state.py          # DebateGraphState TypedDict
│   │   ├── rag/
│   │   │   └── retriever.py      # Empirical RAG Retriever (Stanford, NBER, IEA)
│   │   ├── routers/
│   │   │   ├── auth.py           # /api/auth (Register, Login, Guest, Me)
│   │   │   ├── debates.py        # /api/debates (CRUD, Messages, Evaluate)
│   │   │   ├── rag.py            # /api/rag/search (Empirical Search)
│   │   │   └── topics.py         # /api/topics (Featured Motions)
│   │   ├── core/                 # Config, JWT, Storage Engine
│   │   ├── schemas/              # Pydantic Request & Response Schemas
│   │   └── main.py               # FastAPI App Lifespan & Middlewares
│   ├── tests/                    # Pytest Suite
│   │   ├── test_auth.py          # Auth & Token tests
│   │   ├── test_debates.py       # Debate session lifecycle tests
│   │   ├── test_messages.py      # Message turn & LangGraph state tests
│   │   ├── test_evaluation.py    # 5-factor scoring rubric tests
│   │   └── test_rag.py           # RAG retrieval tests
│   └── requirements.txt
│
└── docker-compose.yml            # Multi-container production deployment
```

---

## 🚀 Getting Started

### 1. Local Development

#### Start Backend:
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Swagger API docs: `http://localhost:8000/docs`

#### Start Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`

### 2. Run with Docker Compose
```bash
docker-compose up --build
```

### 3. Run Automated Tests
```bash
cd backend
pytest -v
```
