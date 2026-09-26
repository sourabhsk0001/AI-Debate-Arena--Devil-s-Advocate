"use client";

import React, { useState } from "react";
import { User, Flame, HelpCircle, ChevronDown, ChevronUp, Copy, Check, Swords, Award } from "lucide-react";
import ArgumentCard from "./ArgumentCard";
import { Turn, DebateMode } from "@/lib/api";

interface ChatMessageProps {
  turn: Turn;
  userPosition: string;
  mode?: DebateMode;
}

export default function ChatMessage({ turn, userPosition, mode = "devils_advocate" }: ChatMessageProps) {
  const [showDiagnostics, setShowDiagnostics] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPersonaConfig = () => {
    switch (mode) {
      case "socratic":
        return {
          title: "Socratic Inquirer",
          badge: "Mode 2 — Socratic",
          icon: <HelpCircle className="w-5 h-5 text-purple-200" />,
          avatarBg: "from-purple-600 to-indigo-800 border-purple-500/30",
          cardBorder: "border-purple-500/25 bg-purple-950/20",
          nameColor: "text-purple-400",
          badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
          questionHeader: "Socratic Inquiry:",
          questionBox: "bg-purple-950/40 border-purple-500/30 text-purple-100",
        };
      case "opponent":
        return {
          title: "Debate Opponent",
          badge: "Mode 3 — Opponent",
          icon: <Swords className="w-5 h-5 text-amber-200" />,
          avatarBg: "from-amber-600 to-orange-800 border-amber-500/30",
          cardBorder: "border-amber-500/25 bg-amber-950/20",
          nameColor: "text-amber-400",
          badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/20",
          questionHeader: "Cross-Examination Question:",
          questionBox: "bg-amber-950/40 border-amber-500/30 text-amber-100",
        };
      case "neutral_judge":
        return {
          title: "Neutral Adjudicator",
          badge: "Mode 4 — Neutral Judge",
          icon: <Award className="w-5 h-5 text-emerald-200" />,
          avatarBg: "from-emerald-600 to-teal-800 border-emerald-500/30",
          cardBorder: "border-emerald-500/25 bg-emerald-950/20",
          nameColor: "text-emerald-400",
          badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
          questionHeader: "Adjudicator Inquiry:",
          questionBox: "bg-emerald-950/40 border-emerald-500/30 text-emerald-100",
        };
      case "devils_advocate":
      default:
        return {
          title: "Devil's Advocate",
          badge: "Mode 1 — Devil's Advocate",
          icon: <Flame className="w-5 h-5 text-rose-200" />,
          avatarBg: "from-rose-600 to-red-800 border-rose-500/30",
          cardBorder: "border-rose-500/25 bg-rose-950/20",
          nameColor: "text-rose-400",
          badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
          questionHeader: "Cross-Examination Question:",
          questionBox: "bg-rose-950/40 border-rose-500/30 text-rose-100",
        };
    }
  };

  const persona = getPersonaConfig();

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

      {/* 2. AI Turn Response */}
      <div className="flex items-start gap-3 sm:gap-4 max-w-3xl mr-auto">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${persona.avatarBg} flex-shrink-0 flex items-center justify-center text-white shadow-lg border`}>
          {persona.icon}
        </div>

        <div className="space-y-3 max-w-2xl w-full">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${persona.nameColor}`}>{persona.title}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${persona.badgeColor}`}>
                {persona.badge}
              </span>
            </div>
            <button
              onClick={() => copyText(turn.ai_counterargument)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
              title="Copy output"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Response Text */}
          <div className={`glass-panel p-4.5 rounded-2xl rounded-tl-none text-zinc-100 text-sm leading-relaxed border ${persona.cardBorder}`}>
            <p className="whitespace-pre-line text-zinc-200">{turn.ai_counterargument}</p>

            {/* Piercing Question Callout */}
            {turn.ai_cross_examination_question && (
              <div className={`mt-4 p-3.5 rounded-xl border space-y-1 ${persona.questionBox}`}>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{persona.questionHeader}</span>
                </div>
                <p className="text-sm font-medium italic leading-snug">
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
