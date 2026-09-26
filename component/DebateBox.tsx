"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, Award, RotateCcw, AlertCircle, ArrowRight } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { DebateSession, Turn, api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface DebateBoxProps {
  session: DebateSession;
  onSessionUpdate: (updated: DebateSession) => void;
}

export default function DebateBox({ session, onSessionUpdate }: DebateBoxProps) {
  const router = useRouter();
  const [argument, setArgument] = useState("");
  const [loading, setLoading] = useState(false);
  const [concluding, setConcluding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session.turns, loading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!argument.trim() || loading || session.status === "completed") return;

    setError(null);
    setLoading(true);
    const textToSend = argument.trim();
    setArgument("");

    try {
      const updated = await api.submitTurn(session.id, textToSend);
      onSessionUpdate(updated);

      if (updated.status === "completed") {
        router.push(`/results?id=${updated.id}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit argument. Please try again.");
      setArgument(textToSend); // restore on error
    } finally {
      setLoading(false);
    }
  };

  const handleConclude = async () => {
    if (concluding || session.turns.length === 0) return;
    setConcluding(true);
    setError(null);

    try {
      const updated = await api.concludeDebate(session.id);
      onSessionUpdate(updated);
      router.push(`/results?id=${updated.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to evaluate debate.");
      setConcluding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const wordCount = argument.split(/\s+/).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round(((session.current_round - 1) / session.total_rounds) * 100));

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-5xl mx-auto glass-panel rounded-2xl border border-surface-border overflow-hidden shadow-2xl">
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-5 border-b border-surface-border bg-surface/60 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {session.mode === "socratic"
                  ? "Mode 2 — Socratic"
                  : session.mode === "opponent"
                  ? "Mode 3 — Opponent"
                  : session.mode === "neutral_judge"
                  ? "Mode 4 — Neutral Judge"
                  : "Mode 1 — Devil's Advocate"}
              </span>
              <span className="text-xs text-zinc-400 capitalize">
                Intensity: {session.difficulty}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
              {session.topic}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-zinc-400">Your Position</div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                  session.user_position === "for"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {session.user_position}
              </span>
            </div>

            {session.turns.length > 0 && session.status !== "completed" && (
              <button
                onClick={handleConclude}
                disabled={concluding}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-colors disabled:opacity-50"
                title="Early submission for judge verdict"
              >
                {concluding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                <span>Judge Now</span>
              </button>
            )}
          </div>
        </div>

        {/* Round Progress Tracker */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              Round {Math.min(session.current_round, session.total_rounds)} of {session.total_rounds}
            </span>
            <span>{session.status === "completed" ? "Debate Concluded" : "In Progress"}</span>
          </div>
          <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500 rounded-full"
              style={{ width: `${session.status === "completed" ? 100 : progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Turns / Transcript Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {session.turns.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Opening Round</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {session.mode === "socratic"
                  ? "State your opening thesis. The Socratic Inquirer will probe your definitions and underlying premises."
                  : session.mode === "opponent"
                  ? "State your opening thesis. The Opponent will construct the strongest counter-resolution case against you."
                  : session.mode === "neutral_judge"
                  ? "State your opening thesis. The Neutral Judge will analyze your argument across Logic, Evidence, Rebuttal, Clarity, and Consistency."
                  : `State your strongest argument in favor of your position (${session.user_position.toUpperCase()}). The Devil's Advocate is poised to analyze your premises and cross-examine assumptions.`}
              </p>
            </div>
            <div className="text-[11px] text-zinc-500 bg-surface/50 border border-surface-border p-3 rounded-lg text-left w-full space-y-1">
              <div className="font-semibold text-zinc-400">Pro Tips for Debaters:</div>
              <div>• State clear premises before drawing conclusions.</div>
              <div>• Anticipate trade-offs rather than assuming frictionless results.</div>
              <div>• Use Ctrl + Enter to submit quickly.</div>
            </div>
          </div>
        ) : (
          session.turns.map((turn, idx) => (
            <ChatMessage
              key={idx}
              turn={turn}
              userPosition={session.user_position}
              mode={session.mode}
            />
          ))
        )}

        {/* AI Thinking Indicator */}
        {loading && (
          <div className="flex items-start gap-4 max-w-2xl py-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-white shadow-lg border border-rose-500/30">
              <Loader2 className="w-5 h-5 animate-spin text-rose-200" />
            </div>
            <div className="glass-panel-danger p-4 rounded-2xl rounded-tl-none border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>
                  {session.mode === "socratic"
                    ? "Socratic Inquirer is formulating a probing question..."
                    : session.mode === "opponent"
                    ? "Debate Opponent is preparing counter-case..."
                    : session.mode === "neutral_judge"
                    ? "Neutral Adjudicator is auditing Logic, Evidence, Rebuttal, Clarity & Consistency..."
                    : "Devil's Advocate is dismantling your argument..."}
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scanning for logical fallacies, querying vector evidence base, and preparing targeted cross-examination questions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Error Alert */}
      {error && (
        <div className="mx-4 sm:mx-6 p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* 4. Bottom Input Bar */}
      <div className="p-4 sm:p-5 border-t border-surface-border bg-surface/80">
        {session.status === "completed" ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-surface-border">
            <div className="flex items-center gap-2 text-zinc-200 text-sm">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="font-semibold">Debate Completed! Check the Official Scorecard.</span>
            </div>
            <button
              onClick={() => router.push(`/results?id=${session.id}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-900/30"
            >
              <span>View Evaluation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  session.turns.length === 0
                    ? `Present your opening thesis for why you are ${session.user_position.toUpperCase()} this resolution...`
                    : `Address the Devil's Advocate's question and defend your premise...`
                }
                rows={3}
                disabled={loading}
                className="w-full p-3.5 pr-14 rounded-xl bg-surface border border-surface-border text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/50 resize-none transition-all disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!argument.trim() || loading}
                className="absolute right-2.5 bottom-3.5 p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-30 disabled:hover:bg-rose-600 transition-all shadow-md shadow-rose-950/40"
                title="Send argument (Ctrl+Enter)"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-3">
                <span>{wordCount} words</span>
                <span className="text-zinc-600">•</span>
                <span className="hidden sm:inline">Press <kbd className="px-1 py-0.5 rounded bg-surface-light border border-surface-border text-zinc-300 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1 py-0.5 rounded bg-surface-light border border-surface-border text-zinc-300 font-mono text-[10px]">Enter</kbd> to submit</span>
              </div>
              <div className="text-zinc-500">
                AI Devil&apos;s Advocate responds instantly
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
