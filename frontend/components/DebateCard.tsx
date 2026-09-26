"use client";

import React from "react";
import Link from "next/link";
import { Flame, HelpCircle, Swords, Award, ArrowRight, Calendar, Layers } from "lucide-react";
import { DebateSession, DebateMode } from "@/types/debate";

interface DebateCardProps {
  debate: DebateSession;
}

export default function DebateCard({ debate }: DebateCardProps) {
  const getModeInfo = (m: DebateMode) => {
    switch (m) {
      case "socratic":
        return {
          label: "Socratic",
          icon: <HelpCircle className="w-3.5 h-3.5 text-purple-400" />,
          color: "border-purple-500/30 bg-purple-500/10 text-purple-300",
        };
      case "opponent":
        return {
          label: "Opponent",
          icon: <Swords className="w-3.5 h-3.5 text-amber-400" />,
          color: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        };
      case "neutral_judge":
        return {
          label: "Neutral Judge",
          icon: <Award className="w-3.5 h-3.5 text-emerald-400" />,
          color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        };
      case "devils_advocate":
      default:
        return {
          label: "Devil's Advocate",
          icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
          color: "border-rose-500/30 bg-rose-500/10 text-rose-300",
        };
    }
  };

  const modeInfo = getModeInfo(debate.mode);
  const formattedDate = new Date(debate.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const score = debate.evaluation?.overall ?? 7.8;

  return (
    <Link
      href={`/debate/${debate.id}`}
      className="glass-panel p-5 rounded-2xl border border-surface-border hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group"
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${modeInfo.color}`}>
            {modeInfo.icon}
            <span>{modeInfo.label}</span>
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              debate.status === "completed"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}
          >
            {debate.status}
          </span>
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors leading-snug">
          {debate.topic}
        </h3>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <span className="text-zinc-500">Position:</span>
            <span className="font-semibold text-zinc-300 uppercase">
              {debate.position}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-zinc-500" />
            <span>{debate.max_rounds} Rounds</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-surface-border/50 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-zinc-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-3">
          {debate.evaluation && (
            <div className="flex items-center gap-1">
              <span className="text-zinc-500">Score:</span>
              <span className="font-mono font-bold text-amber-400">
                {score.toFixed(1)}/10
              </span>
            </div>
          )}

          <div className="text-rose-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold">
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
