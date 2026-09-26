"use client";

import React from "react";
import { BookCheck, ExternalLink, ShieldCheck } from "lucide-react";
import { EvidenceItem } from "@/types/debate";

interface EvidenceCardProps {
  evidence: EvidenceItem[];
  title?: string;
}

export default function EvidenceCard({
  evidence,
  title = "Retrieved Evidence",
}: EvidenceCardProps) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="glass-panel rounded-2xl p-4 border border-blue-500/20 space-y-3">
      <div className="flex items-center justify-between border-b border-surface-border pb-2">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <BookCheck className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
          RAG Verified
        </span>
      </div>

      <div className="space-y-2.5">
        {evidence.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-surface/80 border border-surface-border space-y-1.5 hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white leading-tight">
                {item.title}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {Math.round(item.relevance_score * 100)}% match
              </span>
            </div>

            <p className="text-xs text-zinc-300 italic leading-relaxed">
              &ldquo;{item.chunk}&rdquo;
            </p>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-surface-border/40">
              <div className="flex items-center gap-1">
                <span className="text-zinc-500">Source:</span>
                <span className="text-zinc-300 font-medium">{item.source}</span>
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <span>Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
