// AI Debate Arena - Complete Typed Definitions

export type Position = "for" | "against" | "neutral";

export type DebateMode =
  | "devils_advocate"
  | "socratic"
  | "opponent"
  | "neutral_judge";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ArgumentAnalysis {
  claim: string;
  assumptions: string[];
  strengths: string[];
  weaknesses: string[];
  logical_issues: string[];
  evidence_needed: string[];
}

export interface AICounterargument {
  counterargument: string;
  key_challenge: string;
  question: string;
  confidence: number;
}

export interface EvidenceItem {
  title: string;
  source: string;
  chunk: string;
  url?: string;
  relevance_score: number;
}

export interface DebateMessage {
  id: string;
  debate_id: string;
  role: "user" | "devil_advocate";
  content: string;
  round: number;
  analysis?: ArgumentAnalysis;
  counter?: AICounterargument;
  evidence?: EvidenceItem[];
  created_at: string;
}

export interface DebateEvaluation {
  logic: number;
  evidence: number;
  rebuttal: number;
  clarity: number;
  consistency: number;
  overall: number;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
}

export interface DebateSession {
  id: string;
  user_id: string;
  topic: string;
  position: Position;
  mode: DebateMode;
  difficulty: Difficulty;
  max_rounds: number;
  current_round: number;
  status: "active" | "completed";
  messages: DebateMessage[];
  evaluation?: DebateEvaluation;
  created_at: string;
  updated_at: string;
}

export interface TopicPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultPosition: Position;
  recommendedRounds: number;
}
