"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  History,
  Search,
  Filter,
  PlusCircle,
  Layers,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { DebateSession, DebateMode } from "@/types/debate";
import { api } from "@/lib/api";
import DebateCard from "@/components/DebateCard";

export default function HistoryPage() {
  const [debates, setDebates] = useState<DebateSession[]>([]);
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDebates().then((res) => {
      setDebates(res);
      setLoading(false);
    });
  }, []);

  const filteredDebates = debates.filter((d) => {
    // Search query
    if (search && !d.topic.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Mode filter
    if (modeFilter !== "all" && d.mode !== modeFilter) {
      return false;
    }
    // Status filter
    if (statusFilter !== "all" && d.status !== statusFilter) {
      return false;
    }
    // Score filter
    if (scoreFilter !== "all") {
      const score = d.evaluation?.overall ?? 7.8;
      if (scoreFilter === "high" && score < 8.0) return false;
      if (scoreFilter === "mid" && (score < 7.0 || score >= 8.0)) return false;
      if (scoreFilter === "low" && score >= 7.0) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Header & New Debate Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Debate Archives</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Debate History &amp; Transcripts
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Search, filter, and review all previous intellectual clashes and adjudications.
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

      {/* Search and Filters Bar (Section 18: Mode, Score, Date, Status) */}
      <div className="glass-panel p-4 rounded-2xl border border-surface-border space-y-3">
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by debate topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-surface-border text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-rose-500/60 transition-colors"
            />
          </div>

          {/* Mode Filter */}
          <div className="flex items-center gap-2">
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-surface border border-surface-border text-xs text-zinc-200 focus:outline-none focus:border-rose-500/60"
            >
              <option value="all">All Modes</option>
              <option value="devils_advocate">Devil&apos;s Advocate</option>
              <option value="socratic">Socratic</option>
              <option value="opponent">Opponent</option>
              <option value="neutral_judge">Neutral Judge</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-surface border border-surface-border text-xs text-zinc-200 focus:outline-none focus:border-rose-500/60"
            >
              <option value="all">All Statuses</option>
              <option value="active">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Score Filter */}
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-surface border border-surface-border text-xs text-zinc-200 focus:outline-none focus:border-rose-500/60"
            >
              <option value="all">All Scores</option>
              <option value="high">High (&gt;8.0)</option>
              <option value="mid">Mid (7.0 - 8.0)</option>
              <option value="low">Low (&lt;7.0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Debate Cards */}
      {filteredDebates.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No debates match your filters</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search criteria or clear the filters to view all records.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setModeFilter("all");
              setStatusFilter("all");
              setScoreFilter("all");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-xs font-semibold text-zinc-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDebates.map((d) => (
            <DebateCard key={d.id} debate={d} />
          ))}
        </div>
      )}
    </div>
  );
}
