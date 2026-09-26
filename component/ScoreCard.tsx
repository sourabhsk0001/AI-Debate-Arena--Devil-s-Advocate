"use client";

import React, { useEffect } from "react";
import { Award, Trophy, CheckCircle2, AlertTriangle, Lightbulb, RotateCcw, Share2, Flame, User, ArrowLeft } from "lucide-react";
import { FinalEvaluation, DebateSession } from "@/lib/api";
import Link from "next/link";
import confetti from "canvas-confetti";

interface ScoreCardProps {
  session: DebateSession;
  evaluation: FinalEvaluation;
}

export default function ScoreCard({ session, evaluation }: ScoreCardProps) {
  const isUserWinner = evaluation.winner === "user";
  const isDraw = evaluation.winner === "draw";

  useEffect(() => {
    if (isUserWinner) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback if canvas is unavailable
      }
    }
  }, [isUserWinner]);

  const metricList = [
    { label: "Logic & Reasoning", score: evaluation.metrics.logic_and_reasoning, max: 10 },
    { label: "Evidence & Facts", score: evaluation.metrics.evidence_and_facts, max: 10 },
    { label: "Rebuttal Effectiveness", score: evaluation.metrics.rebuttal_effectiveness, max: 10 },
    { label: "Persuasiveness & Clarity", score: evaluation.metrics.persuasiveness_and_clarity, max: 10 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Winner Banner */}
      <div
        className={`glass-panel rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden border ${
          isUserWinner
            ? "border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-surface/80"
            : isDraw
            ? "border-amber-500/40 bg-gradient-to-b from-amber-950/40 to-surface/80"
            : "border-rose-500/40 bg-gradient-to-b from-rose-950/40 to-surface/80"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl ${
              isUserWinner
                ? "bg-emerald-600 text-white shadow-emerald-900/50"
                : isDraw
                ? "bg-amber-600 text-white shadow-amber-900/50"
                : "bg-rose-600 text-white shadow-rose-950/50"
            }`}
          >
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-extrabold px-3 py-1 rounded-full bg-surface/80 border border-white/10 text-zinc-300">
              Official Adjudicator Decision
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              {isUserWinner
                ? "VICTORY: HUMAN DEBATER"
                : isDraw
                ? "DEADLOCK: MUTUAL DRAW"
                : "VICTORY: DEVIL'S ADVOCATE"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              {session.topic}
            </p>
          </div>

          {/* Head-to-head score comparison */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-4">
            <div className="p-4 rounded-2xl bg-surface/70 border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-zinc-300 font-semibold">You ({session.user_position})</span>
              </div>
              <span className="text-2xl font-black text-blue-400">
                {evaluation.overall_score_user}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface/70 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="text-xs text-zinc-300 font-semibold">AI Opponent</span>
              </div>
              <span className="text-2xl font-black text-rose-400">
                {evaluation.overall_score_ai}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Four Diagnostic Metric Gauges */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Adjudication Metric Breakdown</span>
          </div>
          <span className="text-xs text-zinc-400">Scale: 0 to 10.0</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metricList.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-surface/60 border border-surface-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300">{m.label}</span>
                <span className="font-mono font-bold text-amber-400">{m.score.toFixed(1)} / 10.0</span>
              </div>
              <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500 rounded-full transition-all duration-700"
                  style={{ width: `${(m.score / m.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Strengths, Weaknesses, Fallacies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstrated Strengths</span>
          </div>
          <ul className="space-y-2">
            {evaluation.user_strengths.map((item, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                <span className="text-emerald-500 font-bold mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Fallacies */}
        <div className="glass-panel rounded-2xl p-5 border border-rose-500/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Identified Flaws &amp; Fallacies</span>
          </div>

          {evaluation.fallacies_committed.length > 0 && (
            <div className="space-y-1">
              <div className="text-[11px] text-zinc-400 uppercase font-semibold">Flagged Fallacies:</div>
              <div className="flex flex-wrap gap-1.5">
                {evaluation.fallacies_committed.map((f, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <ul className="space-y-2 pt-1">
            {evaluation.user_weaknesses.map((item, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Verdict Summary & Coaching */}
      <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-rose-400" />
            <span>Adjudicator&apos;s Comprehensive Verdict</span>
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed bg-surface/50 p-4 rounded-xl border border-surface-border">
            {evaluation.verdict_summary}
          </p>
        </div>

        {evaluation.coaching_tips.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-surface-border">
            <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Debater Coaching Advice:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {evaluation.coaching_tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-zinc-300 leading-snug"
                >
                  <span className="font-bold text-amber-400 mr-1.5">{idx + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Navigation & Next Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <Link
          href={`/debate?id=${session.id}`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-300 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Review Full Debate Transcript</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Debate Match</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
