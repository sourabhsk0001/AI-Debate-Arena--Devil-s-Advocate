"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Flame,
  Swords,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Award,
  Layers,
  Search,
  Zap,
} from "lucide-react";
import { TopicOption, DebateMode, api } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [topics, setTopics] = useState<TopicOption[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [position, setPosition] = useState<"for" | "against">("for");
  const [mode, setMode] = useState<DebateMode>("devils_advocate");
  const [difficulty, setDifficulty] = useState<"friendly" | "standard" | "brutal">("standard");
  const [rounds, setRounds] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getTopics().then((res) => {
      setTopics(res);
      if (res.length > 0) {
        setSelectedTopic(res[0].title);
      }
    });
  }, []);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTopic = customTopic.trim() || selectedTopic;
    if (!finalTopic) return;

    setLoading(true);
    try {
      const session = await api.createDebate(finalTopic, position, difficulty, rounds, mode);
      router.push(`/debate?id=${session.id}`);
    } catch (err) {
      console.error("Failed to start debate:", err);
      // Fallback redirect with query params
      const topicParam = encodeURIComponent(finalTopic);
      router.push(`/debate?topic=${topicParam}&pos=${position}&diff=${difficulty}&rounds=${rounds}&mode=${mode}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 py-4">
      {/* 1. Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Next-Generation Adversarial AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Test Your Convictions Against the{" "}
          <span className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
            Devil&apos;s Advocate
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Step into the AI Debate Arena. Defend your stance while our cognitive agent interrogates your assumptions, detects hidden fallacies, retrieves real-world counter-evidence, and scores your rhetorical skill.
        </p>
      </section>

      {/* 2. Interactive Debate Setup Card */}
      <section className="max-w-3xl mx-auto">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-surface-border shadow-2xl relative">
          <div className="flex items-center gap-3 border-b border-surface-border pb-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Debate Match Configuration</h2>
              <p className="text-xs text-zinc-400">Customize topic, stance, and opponent intensity</p>
            </div>
          </div>

          <form onSubmit={handleStart} className="space-y-6">
            {/* Topic Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Select or Custom Topic</span>
                <span className="text-[11px] text-zinc-500">Pick from presets or type your own</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  placeholder="Or enter any custom topic (e.g. 'Universal Basic Income will boost human flourishing')"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-surface-border text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:border-rose-500/60 transition-colors"
                />
              </div>

              {!customTopic && topics.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Quick Pick Featured Topics:
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {topics.slice(0, 3).map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setSelectedTopic(t.title)}
                        className={`p-3 rounded-xl text-left border text-xs transition-all ${
                          selectedTopic === t.title
                            ? "bg-rose-500/10 border-rose-500/50 text-white font-medium shadow-md shadow-rose-950/20"
                            : "bg-surface/50 border-surface-border text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{t.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-surface border border-surface-border text-zinc-400">
                            {t.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Position Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">
                Your Stance on the Topic
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPosition("for")}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    position === "for"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-950/30"
                      : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="text-sm">FOR</div>
                  <div className="text-[11px] opacity-80 mt-0.5">I advocate for this statement</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPosition("against")}
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    position === "against"
                      ? "bg-rose-500/20 border-rose-500 text-rose-300 font-bold shadow-lg shadow-rose-950/30"
                      : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="text-sm">AGAINST</div>
                  <div className="text-[11px] opacity-80 mt-0.5">I challenge this statement</div>
                </button>
              </div>
            </div>

            {/* 4 Debate Modes Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">
                  Select Debate Mode
                </label>
                <span className="text-[11px] text-zinc-500 font-mono">
                  4 AI Agent Personas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mode 1: Devil's Advocate */}
                <button
                  type="button"
                  onClick={() => setMode("devils_advocate")}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    mode === "devils_advocate"
                      ? "bg-rose-500/15 border-rose-500 text-white shadow-lg shadow-rose-950/40"
                      : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                        <Flame className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">Mode 1 — Devil&apos;s Advocate</span>
                    </div>
                    {mode === "devils_advocate" && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Challenges assumptions, gives rigorous counterarguments, asks tough questions, and remains respectful.
                  </p>
                </button>

                {/* Mode 2: Socratic */}
                <button
                  type="button"
                  onClick={() => setMode("socratic")}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    mode === "socratic"
                      ? "bg-purple-500/15 border-purple-500 text-white shadow-lg shadow-purple-950/40"
                      : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">Mode 2 — Socratic</span>
                    </div>
                    {mode === "socratic" && (
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Primarily asks probing questions to examine definitions and causal leaps (&quot;What do you mean by better?&quot;).
                  </p>
                </button>

                {/* Mode 3: Opponent */}
                <button
                  type="button"
                  onClick={() => setMode("opponent")}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    mode === "opponent"
                      ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-950/40"
                      : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Swords className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">Mode 3 — Opponent</span>
                    </div>
                    {mode === "opponent" && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Takes the opposite position and constructs the strongest reasonable tournament case against your stance.
                  </p>
                </button>

                {/* Mode 4: Neutral Judge */}
                <button
                  type="button"
                  onClick={() => setMode("neutral_judge")}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    mode === "neutral_judge"
                      ? "bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-950/40"
                      : "bg-surface border-surface-border text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Award className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">Mode 4 — Neutral Judge</span>
                    </div>
                    {mode === "neutral_judge" && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Does not argue. Objectively audits both sides across Logic, Evidence, Rebuttal, Clarity, and Consistency.
                  </p>
                </button>
              </div>
            </div>

            {/* Difficulty and Rounds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Difficulty */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  {mode === "neutral_judge" ? "Adjudicator Rigor" : "Agent Intensity"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["friendly", "standard", "brutal"] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 px-2 rounded-lg border text-xs capitalize text-center transition-all ${
                        difficulty === lvl
                          ? "bg-rose-600 text-white border-rose-500 font-bold shadow-md shadow-rose-950/40"
                          : "bg-surface border-surface-border text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rounds */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  Debate Length
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[3, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRounds(num)}
                      className={`py-2 rounded-lg border text-xs text-center transition-all ${
                        rounds === num
                          ? "bg-surface-light border-blue-500/50 text-blue-300 font-bold shadow-sm"
                          : "bg-surface border-surface-border text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {num} Rounds
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-bold text-base shadow-xl shadow-rose-950/50 transition-all flex items-center justify-center gap-2 group active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? "Preparing Arena..." : "Enter Debate Arena"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </section>

      {/* 3. Features & Architecture Showcase */}
      <section id="methodology" className="space-y-8 pt-8 border-t border-surface-border">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How The Devil&apos;s Advocate Operates
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Engineered with a multi-step LangGraph agent architecture and grounded RAG vector database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-sm font-bold text-white">Premise Extraction</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Deconstructs your argument into foundational claims, assumptions, and causal predictions.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-sm font-bold text-white">Fallacy Scanning</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Detects cognitive biases, slippery slopes, false dichotomies, and unwarranted absolutism in real time.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-sm font-bold text-white">RAG Evidence Grounding</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Queries an indexed vector evidence base to deploy peer-reviewed counter-facts and economic studies.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-surface-border space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="text-sm font-bold text-white">Impartial Judging</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Synthesizes debate transcripts through a 4-criteria rubric to evaluate logic, evidence, and persuasiveness.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Featured Topics Explorer */}
      <section id="topics" className="space-y-6 pt-6 border-t border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Curated Debate Arenas</h2>
            <p className="text-xs text-zinc-400">Explore hot-button topics with pre-seeded evidence datasets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-5 rounded-2xl border border-surface-border hover:border-rose-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-surface border border-surface-border text-zinc-400">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-rose-400 font-semibold uppercase">
                    {item.difficulty} mode
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs">
                <span className="text-zinc-500">{item.recommended_rounds} rounds</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTopic(item.title);
                    setCustomTopic("");
                    window.scrollTo({ top: 300, behavior: "smooth" });
                  }}
                  className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <span>Select Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
