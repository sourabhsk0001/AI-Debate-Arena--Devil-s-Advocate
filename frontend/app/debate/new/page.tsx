"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Swords,
  ShieldAlert,
  ArrowRight,
  Flame,
  AlertCircle,
  HelpCircle,
  Award,
} from "lucide-react";
import { Position, DebateMode, Difficulty } from "@/types/debate";
import { api } from "@/lib/api";
import TopicInput from "@/components/TopicInput";
import ModeSelector from "@/components/ModeSelector";
import Button from "@/components/Button";

export default function NewDebatePage() {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [position, setPosition] = useState<Position>("for");
  const [mode, setMode] = useState<DebateMode>("devils_advocate");
  const [difficulty, setDifficulty] = useState<Difficulty>("intermediate");
  const [rounds, setRounds] = useState(5); // Section 8: default debate should contain 5 rounds
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const presetTopics = [
    "Should AI replace software engineers?",
    "Remote work is better than working from the office",
    "Universal Basic Income is essential in the era of automation",
    "Social media access should be banned for minors under 16",
    "Nuclear energy is indispensable for decarbonization",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Required Field Validations (Section 6: "Validate all required fields")
    if (!topic.trim()) {
      setError("Please enter or select a debate topic to proceed.");
      return;
    }
    if (topic.trim().length < 6) {
      setError("Debate topic must be at least 6 characters long.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const session = await api.createDebate(
        topic.trim(),
        position,
        mode,
        difficulty,
        rounds
      );
      router.push(`/debate/${session.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to initialize debate arena.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold uppercase tracking-wider">
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>New Match Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Configure Your Debate
        </h1>
        <p className="text-sm text-zinc-400 max-w-xl mx-auto">
          Specify your motion, stance, debate persona, and difficulty level before stepping into the arena.
        </p>
      </div>

      {/* Main Configuration Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-surface-border shadow-2xl relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Topic Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center justify-between">
              <span>Debate Topic / Motion *</span>
              <span className="text-[11px] font-normal text-zinc-500">Required</span>
            </label>
            <TopicInput
              value={topic}
              onChange={(val) => {
                setTopic(val);
                if (error) setError(null);
              }}
              error={error}
              placeholder="Should AI replace software engineers?"
              presetTopics={presetTopics}
              onSelectPreset={(t) => {
                setTopic(t);
                if (error) setError(null);
              }}
            />
          </div>

          {/* 2. Position Selector: For, Against, Neutral */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Your Position *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: "for" as Position,
                  label: "FOR",
                  sub: "Advocate Affirmative",
                  active: "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-emerald-950/30",
                },
                {
                  id: "against" as Position,
                  label: "AGAINST",
                  sub: "Advocate Negative",
                  active: "bg-rose-500/20 border-rose-500 text-rose-300 shadow-rose-950/30",
                },
                {
                  id: "neutral" as Position,
                  label: "NEUTRAL",
                  sub: "Explore Both Perspectives",
                  active: "bg-blue-500/20 border-blue-500 text-blue-300 shadow-blue-950/30",
                },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPosition(p.id)}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    position === p.id
                      ? `${p.active} font-bold shadow-lg`
                      : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="text-sm font-extrabold">{p.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5 leading-snug">{p.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center justify-between">
              <span>Debate Mode *</span>
              <span className="text-[11px] font-normal text-zinc-500">4 Agent Personas</span>
            </label>
            <ModeSelector value={mode} onChange={setMode} />
          </div>

          {/* 4. Difficulty: Beginner, Intermediate, Advanced */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
              Difficulty *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  { id: "beginner", label: "Beginner", desc: "Constructive feedback" },
                  { id: "intermediate", label: "Intermediate", desc: "Rigorous academic standard" },
                  { id: "advanced", label: "Advanced", desc: "Ruthless cross-examination" },
                ] as const
              ).map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setDifficulty(lvl.id)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    difficulty === lvl.id
                      ? "bg-rose-600 border-rose-500 text-white font-bold shadow-md shadow-rose-950/40"
                      : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="text-xs font-bold capitalize">{lvl.label}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Number of Rounds: 3, 5, 7, 10 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center justify-between">
              <span>Number of Rounds *</span>
              <span className="text-[11px] font-normal text-zinc-500">Default: 5 Rounds</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7, 10].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRounds(num)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    rounds === num
                      ? "bg-surface-light border-rose-500 text-rose-300 shadow-md"
                      : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {num} Rounds
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={<ShieldAlert className="w-5 h-5" />}
              className="w-full"
            >
              Start Debate
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
