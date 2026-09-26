import React from "react";
import Link from "next/link";
import { Flame, ShieldAlert, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold uppercase tracking-wider">
        <Flame className="w-3.5 h-3.5 text-rose-400" />
        <span>Next-Generation Adversarial AI</span>
      </div>

      <div className="space-y-3 max-w-3xl">
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Think. Argue. Defend.
        </h1>
        <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Challenge your ideas with an AI Devil&apos;s Advocate.
        </p>
      </div>

      <div className="pt-4 flex items-center gap-4">
        <Link
          href="/debate/new"
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Start Debate</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-300 font-semibold text-sm transition-all"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}
