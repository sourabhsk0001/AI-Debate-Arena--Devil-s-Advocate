"use client";

import React, { useState } from "react";
import { User, Bot, HelpCircle, ChevronDown, ChevronUp, Copy, Check, Sparkles } from "lucide-react";
import { DebateMessage as DebateMessageType, DebateMode } from "@/types/debate";
import EvidenceCard from "./EvidenceCard";

interface DebateMessageProps {
  message: DebateMessageType;
  userPosition?: string;
  mode?: DebateMode;
}

export default function DebateMessage({
  message,
  userPosition = "for",
  mode = "devils_advocate",
}: DebateMessageProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAIModeLabel = () => {
    switch (mode) {
      case "socratic":
        return "🤖 SOCRATIC INQUIRER";
      case "opponent":
        return "🤖 DEBATE OPPONENT";
      case "neutral_judge":
        return "⚖️ NEUTRAL JUDGE";
      case "devils_advocate":
      default:
        return "🤖 DEVIL'S ADVOCATE";
    }
  };

  if (isUser) {
    return (
      <div className="flex items-start gap-3 sm:gap-4 max-w-3xl ml-auto justify-end py-2">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center justify-end gap-2 text-xs text-zinc-400">
            <span className="font-bold text-blue-400">👤 YOU</span>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono border border-blue-500/20 uppercase">
              {userPosition}
            </span>
          </div>

          <div className="glass-panel-user p-4 rounded-2xl rounded-tr-none text-zinc-100 text-sm leading-relaxed border border-blue-500/30">
            {message.content}
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex-shrink-0 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
          <User className="w-5 h-5" />
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className="flex items-start gap-3 sm:gap-4 max-w-3xl mr-auto py-2">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 border border-rose-500/30">
        <Bot className="w-5 h-5 text-rose-200" />
      </div>

      <div className="space-y-3 max-w-2xl w-full">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-rose-400 tracking-wide">
              {getAIModeLabel()}
            </span>
            <span className="text-[10px] text-zinc-500">Round {message.round}</span>
          </div>
          <button
            type="button"
            onClick={() => copyText(message.content)}
            className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {/* Counterargument / Statement */}
        <div className="glass-panel-danger p-4 rounded-2xl rounded-tl-none text-zinc-100 text-sm leading-relaxed border border-rose-500/25 space-y-3">
          <p className="whitespace-pre-line text-zinc-200">{message.content}</p>

          {/* Cross Examination Question */}
          {message.counter?.question && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300 uppercase tracking-wider">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Challenging Question:</span>
              </div>
              <p className="text-sm font-medium text-rose-100 italic leading-snug">
                &ldquo;{message.counter.question}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Retrieved Evidence */}
        {message.evidence && message.evidence.length > 0 && (
          <EvidenceCard evidence={message.evidence} />
        )}

        {/* Concise Argument Analysis Accordion */}
        {message.analysis && (
          <div>
            <button
              type="button"
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-rose-400 transition-colors py-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{showAnalysis ? "Hide" : "View"} argument diagnostics</span>
              {showAnalysis ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAnalysis && (
              <div className="mt-2 p-3.5 rounded-xl bg-surface border border-surface-border text-xs space-y-2.5">
                {message.analysis.assumptions.length > 0 && (
                  <div>
                    <span className="font-semibold text-amber-400">Identified Assumptions:</span>
                    <ul className="list-disc list-inside text-zinc-300 space-y-0.5 mt-1">
                      {message.analysis.assumptions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {message.analysis.weaknesses.length > 0 && (
                  <div>
                    <span className="font-semibold text-rose-400">Exposed Weaknesses:</span>
                    <ul className="list-disc list-inside text-zinc-300 space-y-0.5 mt-1">
                      {message.analysis.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
