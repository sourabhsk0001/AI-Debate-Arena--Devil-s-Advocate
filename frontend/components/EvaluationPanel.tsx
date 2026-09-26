"use client";

import React from "react";
import { Activity, ShieldCheck, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { DebateEvaluation, ArgumentAnalysis } from "@/types/debate";

interface EvaluationPanelProps {
  evaluation?: DebateEvaluation | null;
  latestAnalysis?: ArgumentAnalysis | null;
  roundNumber?: number;
}

export default function EvaluationPanel({
  evaluation,
  latestAnalysis,
  roundNumber = 1,
}: EvaluationPanelProps) {
  // Use evaluation metrics if available, otherwise fallback to live estimates
  const logic = evaluation?.logic ?? 7.8;
  const evidence = evaluation?.evidence ?? 7.2;
  const clarity = evaluation?.clarity ?? 8.4;
  const rebuttal = evaluation?.rebuttal ?? 8.0;
  const consistency = evaluation?.consistency ?? 8.2;

  const metrics = [
    { label: "Logic", score: logic, color: "from-blue-500 to-indigo-500" },
    { label: "Evidence", score: evidence, color: "from-amber-500 to-yellow-500" },
    { label: "Clarity", score: clarity, color: "from-emerald-500 to-teal-500" },
    { label: "Rebuttal", score: rebuttal, color: "from-rose-500 to-red-500" },
    { label: "Consistency", score: consistency, color: "from-purple-500 to-violet-500" },
  ];

  const overallStrength = Math.round(
    ((logic + evidence + clarity + rebuttal + consistency) / 5) * 10
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-4 border border-surface-border space-y-3">
        <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4 text-rose-400" />
            <span>Live Analysis Panel</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-light text-zinc-400 border border-surface-border">
            Round {roundNumber}
          </span>
        </div>

        {/* Argument Strength Gauge */}
        <div className="space-y-1.5 bg-surface/60 p-3 rounded-xl border border-surface-border">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">Argument Strength</span>
            <span className="font-mono font-bold text-rose-400">{overallStrength}%</span>
          </div>
          <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 transition-all duration-700 rounded-full"
              style={{ width: `${overallStrength}%` }}
            />
          </div>
        </div>

        {/* 5 Evaluator Dimensions */}
        <div className="space-y-2 pt-1">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400">{m.label}</span>
                <span className="font-mono font-bold text-zinc-200">
                  {m.score.toFixed(1)}/10
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${m.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${(m.score / 10) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Diagnostics */}
      {latestAnalysis && (
        <div className="glass-panel rounded-2xl p-4 border border-surface-border text-xs space-y-3">
          <div className="flex items-center gap-2 text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Rhetorical Diagnostic</span>
          </div>

          {latestAnalysis.assumptions.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold text-amber-400 text-[11px]">
                Underlying Assumptions:
              </span>
              <ul className="text-zinc-400 space-y-0.5 list-disc list-inside">
                {latestAnalysis.assumptions.slice(0, 2).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {latestAnalysis.weaknesses.length > 0 && (
            <div className="space-y-1">
              <span className="font-semibold text-rose-400 text-[11px]">
                Vulnerabilities:
              </span>
              <ul className="text-zinc-400 space-y-0.5 list-disc list-inside">
                {latestAnalysis.weaknesses.slice(0, 2).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
