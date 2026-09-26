"use client";

import React from "react";

interface ProgressBarProps {
  currentRound: number;
  maxRounds: number;
  status?: string;
  showLabels?: boolean;
}

export default function ProgressBar({
  currentRound,
  maxRounds,
  status = "active",
  showLabels = true,
}: ProgressBarProps) {
  const percent = Math.min(
    100,
    Math.round(((currentRound - (status === "completed" ? 0 : 1)) / maxRounds) * 100)
  );

  return (
    <div className="space-y-1.5 w-full">
      {showLabels && (
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Round {Math.min(currentRound, maxRounds)} of {maxRounds}
          </span>
          <span className="font-semibold text-rose-400">
            {status === "completed" ? "Debate Concluded" : `${percent}% Complete`}
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 transition-all duration-500 rounded-full"
          style={{ width: `${status === "completed" ? 100 : Math.max(10, percent)}%` }}
        />
      </div>
    </div>
  );
}
