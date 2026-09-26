"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";

interface TopicInputProps {
  value: string;
  onChange: (val: string) => void;
  error?: string | null;
  placeholder?: string;
  presetTopics?: string[];
  onSelectPreset?: (topic: string) => void;
}

export default function TopicInput({
  value,
  onChange,
  error,
  placeholder = "Should AI replace software engineers?",
  presetTopics = [],
  onSelectPreset,
}: TopicInputProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3.5 pr-10 rounded-xl bg-surface border text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none transition-all ${
            error
              ? "border-red-500/60 focus:ring-1 focus:ring-red-500/50"
              : "border-surface-border focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/50"
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

      {presetTopics.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Featured Topics:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {presetTopics.map((topic, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectPreset && onSelectPreset(topic)}
                className="px-3 py-1 rounded-lg bg-surface border border-surface-border text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
