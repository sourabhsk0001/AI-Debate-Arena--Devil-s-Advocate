"use client";

import React from "react";
import { Flame, HelpCircle, Swords, Award } from "lucide-react";
import { DebateMode } from "@/types/debate";

interface ModeSelectorProps {
  value: DebateMode;
  onChange: (mode: DebateMode) => void;
}

export default function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const modes = [
    {
      id: "devils_advocate" as DebateMode,
      name: "Devil's Advocate",
      badge: "Adversarial",
      desc: "Challenges assumptions, exposes weaknesses, and provides counterarguments.",
      icon: <Flame className="w-4 h-4 text-rose-400" />,
      activeClass: "bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-950/40",
      dotClass: "bg-rose-500",
    },
    {
      id: "socratic" as DebateMode,
      name: "Socratic",
      badge: "Inquisitive",
      desc: "Primarily asks probing questions to examine definitions and logical conclusions.",
      icon: <HelpCircle className="w-4 h-4 text-purple-400" />,
      activeClass: "bg-purple-500/15 border-purple-500 text-white shadow-lg shadow-purple-950/40",
      dotClass: "bg-purple-500",
    },
    {
      id: "opponent" as DebateMode,
      name: "Opponent",
      badge: "Debater",
      desc: "Takes the opposite position and constructs the strongest formal debate case.",
      icon: <Swords className="w-4 h-4 text-amber-400" />,
      activeClass: "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-950/40",
      dotClass: "bg-amber-500",
    },
    {
      id: "neutral_judge" as DebateMode,
      name: "Neutral Judge",
      badge: "Adjudicator",
      desc: "Does not argue. Impartially audits Logic, Evidence, Rebuttal, and Clarity.",
      icon: <Award className="w-4 h-4 text-emerald-400" />,
      activeClass: "bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-950/40",
      dotClass: "bg-emerald-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {modes.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            value === m.id
              ? m.activeClass
              : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                {m.icon}
              </div>
              <span className="text-xs font-bold text-white">{m.name}</span>
            </div>
            {value === m.id && (
              <span className={`w-2 h-2 rounded-full ${m.dotClass}`} />
            )}
          </div>
          <p className="text-[11px] text-zinc-400 leading-snug">{m.desc}</p>
        </button>
      ))}
    </div>
  );
}
