"use client";

import React from "react";
import { AlertTriangle, BookCheck, ShieldAlert, Sparkles, ExternalLink } from "lucide-react";
import { EvidenceItem } from "@/lib/api";

interface ArgumentCardProps {
  weaknesses?: string[];
  fallacies?: string[];
  evidence?: EvidenceItem[];
  title?: string;
}

export default function ArgumentCard({
  weaknesses = [],
  fallacies = [],
  evidence = [],
  title = "Argument Diagnostics",
}: ArgumentCardProps) {
  if (weaknesses.length === 0 && fallacies.length === 0 && evidence.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-xl p-4 border border-surface-border text-sm space-y-4 transition-all hover:border-zinc-700">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-2.5">
        <div className="flex items-center gap-2 text-zinc-200 font-semibold">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{title}</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
          AI Analysis
        </span>
      </div>

      {/* Logical Fallacies */}
      {fallacies.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Logical Fallacy Detection:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {fallacies.map((fallacy, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium"
              >
                {fallacy}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Exposed Vulnerabilities:</span>
          </div>
          <ul className="space-y-1 pl-1">
            {weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2 text-zinc-300 text-xs leading-relaxed">
                <span className="text-rose-500 font-bold mt-0.5">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* RAG Evidence Retrieved */}
      {evidence.length > 0 && (
        <div className="space-y-2 pt-1 border-t border-surface-border/50">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-400">
            <div className="flex items-center gap-1.5">
              <BookCheck className="w-3.5 h-3.5" />
              <span>RAG Counter-Evidence Retrieved:</span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Vector Grounded
            </span>
          </div>
          <div className="space-y-2">
            {evidence.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-surface/80 border border-blue-500/20 space-y-1 hover:border-blue-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {Math.round(item.relevance_score * 100)}% match
                  </span>
                </div>
                <p className="text-xs text-zinc-400 italic leading-snug">
                  &ldquo;{item.fact}&rdquo;
                </p>
                <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <span>Source:</span>
                  <span className="text-zinc-400 font-medium">{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
