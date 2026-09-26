# AI Debate Arena — Devil's Advocate

> **Production-Quality Adversarial GenAI Platform for Argument Stress-Testing, Fallacy Detection, and Multi-Factor Adjudication.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/DevOps-Docker%20Compose-2496ED?logo=docker)](https://www.docker.com/)

---

## 🏛️ System Architecture

```text
               ┌────────────────────────────────────────────────────────┐
               │              Next.js 14 Web Frontend                   │
               │   • Modern Cyber-Dark SaaS UI (Tailwind CSS)           │
               │   • Live Arena, Diagnostics Drawer, Scorecard          │
               └──────────────────────────┬─────────────────────────────┘
                                          │ REST / JSON
                                          ▼
               ┌────────────────────────────────────────────────────────┐
               │                 FastAPI Python Backend                 │
               │   • JWT Auth & Guest Session Management                │
               │   • Session State & Round Orchestration                │
               └──────────────┬───────────────────────────┬─────────────┘
                              │                           │
                              ▼                           ▼
        ┌───────────────────────────────┐   ┌───────────────────────────┐
        │  Cognitive Debate Agent       │   │  RAG Knowledge Base       │
        │  (LangGraph / OpenAI / Claude)│   │  (Empirical Vector Store) │
        │  • Fallacy Detection          │   │  • Stanford AI Reports    │
        │  • Vulnerability Scanning     │   │  • NBER / Brookings / IEA │
        │  • Cross-Examination Engine   │   │  • Semantic Similarity    │
        └──────────────┬────────────────┘   └───────────────────────────┘
                       │
                       ▼
        ┌───────────────────────────────┐   ┌───────────────────────────┐
        │   Chief Adjudicator Engine    │   │  Database Storage         │
        │   • Logic & Reasoning (0-10)  │   │  • MongoDB / Mongo Atlas  │
        │   • Evidence Grounding (0-10) │   │  • Resilient JSON Store   │
        │   • Rebuttal Strength (0-10)  │   └───────────────────────────┘
        │   • Clarity & Rhetoric (0-10) │
        └───────────────────────────────┘
```

---

## ✨ Key Features

1. **Adversarial Devil's Advocate Agent**:
   - Takes the counter-stance to challenge the user's worldview.
   - 3 difficulty levels: *Friendly Spar*, *Ivy League Debater*, and *Brutal Devil's Advocate*.
   - Generates incisive counterarguments and high-pressure cross-examination questions.

2. **Real-Time Cognitive Fallacy Scanner**:
   - Analyzes user statements for *Hasty Generalizations*, *Slippery Slope*, *False Dilemmas*, and *Unwarranted Absolutism*.

3. **RAG (Retrieval-Augmented Generation) Counter-Evidence**:
   - Automatically searches indexed empirical studies (Stanford HAI, Goldman Sachs, Brookings Institution, IEA, NBER) to refute weak claims with real data.

4. **Multi-Factor Scorecard & Adjudication**:
   - Evaluates rounds based on 4 rigorous debate criteria:
     - Logic & Reasoning (0–10)
     - Evidence & Factual Grounding (0–10)
     - Rebuttal Effectiveness (0–10)
     - Persuasiveness & Rhetorical Clarity (0–10)
   - Outputs winner declaration, strengths, vulnerabilities, and personalized debater coaching tips.

5. **Modern AI SaaS Design**:
   - Obsidian/Crimson visual theme, glassmorphism, responsive round progress indicators, and interactive cards.

---

## 🚀 Quickstart Guide

### Option 1: Running Locally

#### 1. Start the FastAPI Backend
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
*Backend Swagger Docs will be available at: `http://localhost:8000/docs`*

#### 2. Start the Next.js Frontend
```bash
# In the project root directory
npm install
npm run dev
```
*Frontend will be running at: `http://localhost:3000`*

---

### Option 2: Running with Docker Compose

```bash
docker-compose up --build
```
This boots up:
- Next.js frontend on `http://localhost:3000`
- FastAPI backend on `http://localhost:8000`
- MongoDB on port `27017`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `OPENAI_API_KEY` | OpenAI API Key (optional; intelligent heuristic engine activates if empty) | `None` |
| `OPENAI_MODEL` | OpenAI Model | `gpt-4o-mini` |
| `MONGODB_URI` | MongoDB Connection URI | `mongodb://localhost:27017` |
| `SECRET_KEY` | JWT Signing Secret | `your_secret_key` |
| `PORT` | API Server Port | `8000` |

### Frontend (`.env.local`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://127.0.0.1:8000` |

---

## 📡 API Reference

- `POST /api/auth/guest` — Generate instant guest debater token
- `GET /api/topics` — List featured debate topics & categories
- `POST /api/debates` — Create a new debate session
- `GET /api/debates/{id}` — Fetch debate session state
- `POST /api/debates/{id}/turn` — Submit debater rebuttal & trigger Devil's Advocate
- `POST /api/debates/{id}/conclude` — Adjudicate debate and compute scorecard
- `GET /api/evidence/search` — Query RAG empirical evidence base
- `GET /health` — Health check & service connectivity status
