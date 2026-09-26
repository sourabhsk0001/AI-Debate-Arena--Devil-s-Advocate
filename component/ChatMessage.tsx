"use client";

import React, { useState } from "react";
import { User, Flame, HelpCircle, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import ArgumentCard from "./ArgumentCard";
import { Turn } from "@/lib/api";

interface ChatMessageProps {
  turn: Turn;
  userPosition: string;
}

export default function ChatMessage({ turn, userPosition }: ChatMessageProps) {
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 py-2">
      {/* Round Pill Divider */}
      <div className="flex items-center justify-center gap-3 my-4">
        <div className="h-px bg-surface-border flex-1" />
        <div className="px-3 py-1 rounded-full bg-surface border border-surface-border text-xs font-semibold text-zinc-400 uppercase tracking-widest">
          Round {turn.round_number}
        </div>
        <div className="h-px bg-surface-border flex-1" />
      </div>

      {/* 1. User Statement */}
      <div className="flex items-start gap-3 sm:gap-4 max-w-3xl ml-auto justify-end">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center justify-end gap-2 text-xs text-zinc-400">
            <span className="font-semibold text-blue-400">You ({userPosition.toUpperCase()})</span>
            <span>•</span>
            <span>{turn.user_argument.split(/\s+/).filter(Boolean).length} words</span>
          </div>

          <div className="glass-panel-user p-4 rounded-2xl rounded-tr-none text-zinc-100 text-sm leading-relaxed border border-blue-500/30">
            {turn.user_argument}
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex-shrink-0 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
          <User className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Devil's Advocate Counterargument */}
      <div className="flex items-start gap-3 sm:gap-4 max-w-3xl mr-auto">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 border border-rose-500/30">
          <Flame className="w-5 h-5 text-rose-200" />
        </div>

        <div className="space-y-3 max-w-2xl w-full">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-rose-400">Devil&apos;s Advocate</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 text-[10px] font-mono border border-rose-500/20">
                Opponent
              </span>
            </div>
            <button
              onClick={() => copyText(turn.ai_counterargument)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
              title="Copy rebuttal"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Rebuttal Text */}
          <div className="glass-panel-danger p-4.5 rounded-2xl rounded-tl-none text-zinc-100 text-sm leading-relaxed border border-rose-500/25">
            <p className="whitespace-pre-line text-zinc-200">{turn.ai_counterargument}</p>

            {/* Piercing Question Callout */}
            {turn.ai_cross_examination_question && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Cross-Examination Question:</span>
                </div>
                <p className="text-sm font-medium text-rose-100 italic leading-snug">
                  &ldquo;{turn.ai_cross_examination_question}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Diagnostics Accordion Toggle */}
          <div>
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors py-1"
            >
              <span>{showDiagnostics ? "Hide" : "Show"} argument diagnostics &amp; evidence</span>
              {showDiagnostics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDiagnostics && (
              <div className="mt-2">
                <ArgumentCard
                  weaknesses={turn.identified_weaknesses}
                  fallacies={turn.detected_fallacies}
                  evidence={turn.retrieved_evidence}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
