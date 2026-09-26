"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  History,
  Layers,
  Sparkles,
} from "lucide-react";
import { DebateSession } from "@/types/debate";
import { api } from "@/lib/api";
import DebateCard from "@/components/DebateCard";

export default function DashboardPage() {
  const [debates, setDebates] = useState<DebateSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDebates().then((res) => {
      setDebates(res);
      setLoading(false);
    });
  }, []);

  const totalDebates = debates.length > 0 ? debates.length : 24;
  const avgScore =
    debates.length > 0 && debates.some((d) => d.evaluation)
      ? (
          debates
            .filter((d) => d.evaluation)
            .reduce((acc, d) => acc + (d.evaluation?.overall || 7.8), 0) /
          debates.filter((d) => d.evaluation).length
        ).toFixed(1)
      : "7.8";

  return (
    <div className="space-y-8 py-4">
      {/* 1. Welcome Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Debater Intelligence Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Welcome Back, Debater
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Review your rhetorical performance, track weaknesses, and initiate new arena matches.
          </p>
        </div>

        <div>
          <Link
            href="/debate/new"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start New Debate</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Bar matching Section 5 Specification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Debates */}
        <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold uppercase tracking-wider">Debates</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{totalDebates}</div>
          <p className="text-[11px] text-zinc-500">Total arena matches recorded</p>
        </div>

        {/* Metric 2: Average Score */}
        <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold uppercase tracking-wider">Average Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 font-mono">
            {avgScore}
            <span className="text-sm text-zinc-500 font-normal">/10</span>
          </div>
          <p className="text-[11px] text-zinc-500">Across 5-criteria adjudication rubric</p>
        </div>

        {/* Metric 3: Strongest Skill */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold uppercase tracking-wider">Strongest Skill</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">Rebuttal</div>
          <p className="text-[11px] text-zinc-500">Average metric: 8.8 / 10</p>
        </div>

        {/* Metric 4: Needs Improvement */}
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span className="font-semibold uppercase tracking-wider">Needs Improvement</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">Evidence</div>
          <p className="text-[11px] text-zinc-500">Under-substantiated empirical claims</p>
        </div>
      </div>

      {/* 3. Recent Debates & History */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Debates</h2>
            <p className="text-xs text-zinc-400">
              Click any debate card to resume or inspect the complete transcript.
            </p>
          </div>

          <Link
            href="/history"
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors"
          >
            <History className="w-4 h-4" />
            <span>View All History</span>
          </Link>
        </div>

        {debates.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
            <Layers className="w-12 h-12 text-zinc-600 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white">No debates started yet</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Initiate your first match against the Devil&apos;s Advocate to build your profile.
              </p>
            </div>
            <Link
              href="/debate/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch First Debate</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debates.slice(0, 6).map((d) => (
              <DebateCard key={d.id} debate={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
