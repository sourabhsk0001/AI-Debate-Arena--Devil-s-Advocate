"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Trophy, Award, CheckCircle2, AlertTriangle, Lightbulb, RotateCcw, History, PlusCircle } from "lucide-react";
import { DebateEvaluation, DebateSession } from "@/types/debate";
import confetti from "canvas-confetti";

interface ScoreCardProps {
  session: DebateSession;
  evaluation: DebateEvaluation;
}

export default function ScoreCard({ session, evaluation }: ScoreCardProps) {
  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Graceful fallback
    }
  }, []);

  const scores = [
    { label: "Logic", val: evaluation.logic },
    { label: "Evidence", val: evaluation.evidence },
    { label: "Rebuttal", val: evaluation.rebuttal },
    { label: "Clarity", val: evaluation.clarity },
    { label: "Consistency", val: evaluation.consistency },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* 1. Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 text-center border border-surface-border relative overflow-hidden bg-gradient-to-b from-rose-950/20 to-surface/80">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 text-white flex items-center justify-center shadow-xl shadow-rose-950/50">
            <Trophy className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
            DEBATE COMPLETE
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {session.topic}
          </h1>

          <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
            <span>Your Position: <strong className="text-zinc-200 uppercase">{session.position}</strong></span>
            <span>•</span>
            <span>Rounds Completed: <strong className="text-zinc-200">{session.max_rounds}</strong></span>
          </div>

          {/* Overall Composite Score */}
          <div className="mt-4 p-4 rounded-2xl bg-surface/80 border border-surface-border inline-flex items-center gap-3">
            <Award className="w-6 h-6 text-amber-400" />
            <div className="text-left">
              <div className="text-[11px] text-zinc-400 uppercase font-semibold">Overall Debate Rating</div>
              <div className="text-3xl font-black text-amber-400 font-mono">
                {evaluation.overall.toFixed(1)} / 10
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 5 Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {scores.map((s, idx) => (
          <div
            key={idx}
            className="glass-panel p-4 rounded-2xl border border-surface-border text-center space-y-1 hover:border-zinc-700 transition-colors"
          >
            <div className="text-xs text-zinc-400 font-semibold">{s.label}</div>
            <div className="text-2xl font-black text-white font-mono">
              {s.val}
              <span className="text-xs text-zinc-500 font-normal">/10</span>
            </div>
            <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                style={{ width: `${(s.val / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Strengths vs Areas to Improve */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Your Strengths</span>
          </div>
          <ul className="space-y-2">
            {evaluation.strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="glass-panel rounded-2xl p-5 border border-rose-500/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Areas to Improve</span>
          </div>
          <ul className="space-y-2">
            {evaluation.weaknesses.map((w, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Coaching / Improvement Suggestions */}
      {evaluation.improvement_suggestions.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Suggested Practice &amp; Strategic Refinements</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {evaluation.improvement_suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-zinc-300 leading-relaxed"
              >
                <span className="font-bold text-amber-400 mr-1.5">{idx + 1}.</span>
                {sug}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-surface-border">
        <Link
          href={`/debate/${session.id}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-300 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Review Transcript</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-300 text-xs font-semibold transition-colors"
          >
            <History className="w-4 h-4" />
            <span>View History</span>
          </Link>

          <Link
            href="/debate/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Debate</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
