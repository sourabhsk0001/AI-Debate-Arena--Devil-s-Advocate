"use client";

import React from "react";
import Link from "next/link";
import { Flame, ShieldAlert, Sparkles, LayoutDashboard, History, PlusCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center shadow-lg shadow-rose-900/30 group-hover:scale-105 transition-transform duration-200">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-rose-400 transition-colors">
                AI Debate Arena
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Devil&apos;s Advocate
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Think. Argue. Defend.
            </p>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
          <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            Dashboard
          </Link>
          <Link href="/debate/new" className="hover:text-white transition-colors flex items-center gap-1.5">
            <PlusCircle className="w-4 h-4 text-rose-400" />
            New Debate
          </Link>
          <Link href="/history" className="hover:text-white transition-colors flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-400" />
            History
          </Link>
        </nav>

        {/* Status & CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-surface-border text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 beacon-pulse" />
            <span>Agent Online</span>
          </div>

          <Link
            href="/debate/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-sm font-semibold shadow-md shadow-rose-900/20 transition-all hover:shadow-rose-900/40 active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Start Debate</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
