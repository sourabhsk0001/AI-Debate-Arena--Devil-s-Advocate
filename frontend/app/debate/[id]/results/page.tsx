"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookCheck,
  RotateCcw,
  History,
  PlusCircle,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { DebateSession, DebateEvaluation } from "@/types/debate";
import { api } from "@/lib/api";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const debateId = params.id as string;

  const [session, setSession] = useState<DebateSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDebate(debateId);
        if (!data.evaluation) {
          const judged = await api.evaluateDebate(debateId);
          data.evaluation = judged;
        }
        setSession(data);
      } catch (err: any) {
        setError(err.message || "Failed to load evaluation.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [debateId]);

  useEffect(() => {
    if (session?.evaluation) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [session]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-sm font-semibold text-zinc-300">
          Adjudicator Bench Deliberating Final Verdict...
        </p>
      </div>
    );
  }

  if (!session || !session.evaluation) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-red-400" />
        <h2 className="text-lg font-bold text-white">Evaluation Not Available</h2>
        <p className="text-xs text-zinc-400">{error || "Could not retrieve scores."}</p>
        <Link
          href={`/debate/${debateId}`}
          className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-300 text-xs font-semibold"
        >
          Return to Debate
        </Link>
      </div>
    );
  }

  const evalData = session.evaluation;
  const scoreCards = [
    { label: "Logic", val: evalData.logic },
    { label: "Evidence", val: evalData.evidence },
    { label: "Rebuttal", val: evalData.rebuttal },
    { label: "Clarity", val: evalData.clarity },
    { label: "Consistency", val: evalData.consistency },
    { label: "Overall", val: evalData.overall },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* 1. TOP BANNER (Section 17: DEBATE COMPLETE) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 text-center border border-surface-border bg-gradient-to-b from-rose-950/20 to-surface/80 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 via-amber-600 to-red-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-rose-950/50">
          <Trophy className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
            DEBATE COMPLETE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
            {session.topic}
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 pt-1">
            <span>
              User Position: <strong className="text-zinc-200 uppercase">{session.position}</strong>
            </span>
            <span>•</span>
            <span>
              Rounds Completed: <strong className="text-zinc-200">{session.max_rounds}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. SCORE CARDS (Section 17: Logic, Evidence, Rebuttal, Clarity, Consistency, Overall) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {scoreCards.map((sc, idx) => (
          <div
            key={idx}
            className={`glass-panel p-4 rounded-2xl border text-center space-y-1 ${
              sc.label === "Overall"
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-surface-border hover:border-zinc-700"
            }`}
          >
            <div className="text-xs text-zinc-400 font-semibold">{sc.label}</div>
            <div className={`text-2xl font-black font-mono ${sc.label === "Overall" ? "text-amber-400" : "text-white"}`}>
              {typeof sc.val === "number" ? sc.val.toFixed(1) : sc.val}
              <span className="text-xs text-zinc-500 font-normal">/10</span>
            </div>
            <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                style={{ width: `${(Number(sc.val) / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 3. YOUR STRENGTHS & AREAS TO IMPROVE (Section 17) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Your Strengths */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Your Strengths</span>
          </div>
          <ul className="space-y-2">
            {evalData.strengths.map((str, idx) => (
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
            {evalData.weaknesses.map((w, idx) => (
              <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. STRONGEST ARGUMENTS & EVIDENCE YOU SHOULD CONSIDER (Section 17) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-2.5">
          <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Strongest Arguments</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Your most resilient point occurred when establishing foundational ethical necessity, which the opponent was unable to refute on moral grounds.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-surface-border space-y-2.5">
          <div className="flex items-center gap-2 text-zinc-200 font-bold text-sm">
            <BookCheck className="w-4 h-4 text-blue-400" />
            <span>Evidence You Should Consider</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Integrating longitudinal economic studies (e.g. Stanford HAI 2024 or Brookings Institute fiscal audits) would have prevented burden-of-proof vulnerabilities.
          </p>
        </div>
      </div>

      {/* 5. SUGGESTED PRACTICE (Section 17) */}
      {evalData.improvement_suggestions.length > 0 && (
        <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Suggested Practice</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {evalData.improvement_suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-zinc-300 leading-relaxed"
              >
                <span className="font-bold text-amber-400 mr-1.5">{idx + 1}.</span>
                {sug}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. BUTTONS (Section 17: "Debate Again", "View History", "New Debate") */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-surface-border">
        <Link
          href={`/debate/${session.id}`}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-200 text-xs font-bold transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Debate Again</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-200 text-xs font-bold transition-colors"
          >
            <History className="w-4 h-4" />
            <span>View History</span>
          </Link>

          <Link
            href="/debate/new"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-950/40 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Debate</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
