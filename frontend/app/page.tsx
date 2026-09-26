"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  ShieldAlert,
  ArrowRight,
  Brain,
  Sparkles,
  Award,
  Layers,
  Search,
  Scale,
  Cpu,
  Database,
  Terminal,
  CheckCircle,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      title: "Adversarial Stress-Testing",
      description:
        "The AI Devil's Advocate challenges your core premises, pinpoints unstated assumptions, and forces you to defend your convictions.",
    },
    {
      icon: <Brain className="w-5 h-5 text-purple-400" />,
      title: "Socratic Method & Opponent Modes",
      description:
        "Choose between 4 specialized debate personas: Devil's Advocate, Socratic Inquirer, Championship Opponent, or Neutral Judge.",
    },
    {
      icon: <Search className="w-5 h-5 text-blue-400" />,
      title: "RAG Vector Grounding",
      description:
        "Live semantic retrieval over empirical research and economic data ensures counterarguments are rooted in real-world facts, not hallucinations.",
    },
    {
      icon: <Award className="w-5 h-5 text-amber-400" />,
      title: "Multi-Criteria Adjudication",
      description:
        "Receive comprehensive evaluations on Logic, Evidence, Rebuttal, Clarity, and Consistency, complete with targeted coaching tips.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Pick Your Motion & Stance",
      desc: "Enter any resolution or select a trending topic. Choose whether you argue FOR, AGAINST, or NEUTRAL.",
    },
    {
      num: "02",
      title: "Face the Devil's Advocate",
      desc: "Exchange multi-round arguments. The AI interrogates your premises and poses rigorous cross-examination questions.",
    },
    {
      num: "03",
      title: "Receive Official Adjudication",
      desc: "Get an in-depth scorecard with radar breakdown, identified logical fallacies, and tailored debater improvement advice.",
    },
  ];

  const techStack = [
    { name: "Next.js 14", desc: "React Framework & App Router" },
    { name: "FastAPI", desc: "Python High-Performance Backend" },
    { name: "LangGraph", desc: "Cyclic State-Machine Agent Graph" },
    { name: "Vector RAG", desc: "ChromaDB & MongoDB Atlas Search" },
    { name: "Tailwind CSS", desc: "Modern Cyber-Dark SaaS Aesthetic" },
    { name: "Docker", desc: "Multi-Container Orchestration" },
  ];

  return (
    <div className="space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-bold uppercase tracking-widest shadow-lg shadow-rose-950/20">
          <Flame className="w-4 h-4 text-rose-400" />
          <span>Next-Generation Adversarial AI</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Think. Argue. Defend.
          </h1>
          <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-rose-400 via-red-300 to-amber-300 bg-clip-text text-transparent">
            Challenge your ideas with an AI Devil&apos;s Advocate.
          </p>
        </div>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          The ultimate intellectual training ground. Step into the arena to test your arguments against an uncompromising cognitive agent that uncovers hidden assumptions, exposes fallacies, and cites empirical counter-evidence.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/debate/new"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-bold text-base shadow-xl shadow-rose-950/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Start Debate</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-200 font-bold text-base transition-all text-center"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* 2. FEATURE CARDS */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Built for Intellectual Precision
          </h2>
          <p className="text-sm text-zinc-400">
            Engineered from the ground up to cultivate rigorous, persuasive argumentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-surface-border hover:border-rose-500/40 transition-all space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="space-y-10 py-6 border-t border-surface-border">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            How The Arena Operates
          </h2>
          <p className="text-sm text-zinc-400">
            A continuous loop of cognitive deconstruction, evidence grounding, and evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-3xl border border-surface-border relative space-y-3"
            >
              <span className="text-3xl font-black font-mono text-rose-500/40">
                {s.num}
              </span>
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TECHNOLOGY SECTION */}
      <section className="space-y-8 py-6 border-t border-surface-border">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Architecture &amp; Frameworks</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Production-Grade GenAI Stack
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-surface/70 border border-surface-border text-center space-y-1 hover:border-zinc-700 transition-colors"
            >
              <div className="text-sm font-bold text-white">{tech.name}</div>
              <div className="text-[11px] text-zinc-500 leading-tight">
                {tech.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CALL TO ACTION */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-rose-500/30 relative overflow-hidden bg-gradient-to-b from-rose-950/30 to-surface/80">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Defend Your Convictions?
          </h2>
          <p className="text-sm text-zinc-400">
            Start a debate session in seconds. Choose from featured topics or bring your own resolution.
          </p>
          <div className="pt-2">
            <Link
              href="/debate/new"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-950/50 transition-all hover:scale-105 active:scale-95"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Enter Arena Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
