"use client";

import React from "react";
import { Loader2, Flame } from "lucide-react";

interface LoadingMessageProps {
  message?: string;
  subtext?: string;
}

export default function LoadingMessage({
  message = "AI is thinking...",
  subtext = "Deconstructing argument claims, retrieving empirical evidence, and formulating cross-examination...",
}: LoadingMessageProps) {
  return (
    <div className="flex items-start gap-3 sm:gap-4 max-w-2xl py-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-white shadow-lg border border-rose-500/30 flex-shrink-0">
        <Loader2 className="w-5 h-5 animate-spin text-rose-200" />
      </div>

      <div className="glass-panel-danger p-4 rounded-2xl rounded-tl-none border border-rose-500/30 space-y-1.5 flex-1">
        <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>{message}</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">{subtext}</p>
      </div>
    </div>
  );
}
