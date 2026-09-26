"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Scale,
  Gavel,
  ShieldAlert,
  Award,
  BookOpen,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2
} from "lucide-react";
import { api } from "@/lib/api";

interface CasePreset {
  id: string;
  title: string;
  category: string;
  party_a: string;
  party_b: string;
  description: string;
}

interface AdvocateExchange {
  counsel: string;
  speech: string;
  citations: string[];
}

interface RoundRecord {
  round: number;
  total_rounds: number;
  party_a: AdvocateExchange;
  party_b: AdvocateExchange;
  judge_interlocutory: string;
  verdict?: {
    winner: string;
    party_a_score: number;
    party_b_score: number;
    ratio_decidendi: string;
    order_summary: string;
  } | null;
}

export default function CourtroomPage() {
  const [topic, setTopic] = useState("kya engineering krna sahi hai");
  const [totalRounds, setTotalRounds] = useState(3);
  const [cases, setCases] = useState<CasePreset[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);

  // Trial state
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundsHistory, setRoundsHistory] = useState<RoundRecord[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoPlayRef = useRef<boolean>(false);
  const trialEndRef = useRef<HTMLDivElement>(null);

  // Sync autoPlayRef
  useEffect(() => {
    autoPlayRef.current = isAutoPlaying;
  }, [isAutoPlaying]);

  // Load featured case presets
  useEffect(() => {
    async function fetchCases() {
      try {
        const data = await api.getCourtroomCases();
        setCases(data);
      } catch (err: any) {
        // Fallback default presets if backend call is delayed
        setCases([
          {
            id: "case-engineering",
            title: "kya engineering krna sahi hai",
            category: "Career & Higher Education",
            party_a: "Advocate Sharma (Petitioner: In Favor)",
            party_b: "Advocate Verma (Respondent: Counter-Case)",
            description: "Scrutinizing whether a 4-year engineering degree provides viable career ROI amidst 80% market unhireability and AI coding automation."
          },
          {
            id: "case-ai-replace",
            title: "Should AI Replace Software Engineers?",
            category: "Technology & Labor Law",
            party_a: "Prosecution (AI Automation is Superior)",
            party_b: "Defense Counsel (Human Architecture Irreplaceable)",
            description: "Testing algorithmic code generation against human contextual design and legal liability."
          },
          {
            id: "case-remote-work",
            title: "Right to Remote Work vs In-Office Mandates",
            category: "Employment & Labor Law",
            party_a: "Counsel for Employees (Remote Work is a Right)",
            party_b: "Counsel for Employers (In-Office is Essential)",
            description: "Balancing employee autonomy against institutional cohesion and mentoring."
          }
        ]);
      } finally {
        setLoadingCases(false);
      }
    }
    fetchCases();
  }, []);

  // Auto-scroll on new exchanges
  useEffect(() => {
    if (trialEndRef.current && isTrialActive) {
      trialEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [roundsHistory, isSimulating]);

  // Start trial
  const startTrial = async (chosenTopic?: string) => {
    const motionTopic = (chosenTopic || topic).trim();
    if (!motionTopic) {
      setError("Please specify a motion or dispute topic for the Court to adjudicate.");
      return;
    }

    setError(null);
    setIsTrialActive(true);
    setCurrentRound(1);
    setRoundsHistory([]);
    setIsSimulating(true);

    try {
      const res = await api.simulateCourtroomRound({
        topic: motionTopic,
        round: 1,
        total_rounds: totalRounds,
        history: []
      });
      setRoundsHistory([res]);
      setCurrentRound(1);
    } catch (err: any) {
      setError(err.message || "Failed to convene Courtroom simulation.");
      setIsTrialActive(false);
    } finally {
      setIsSimulating(false);
    }
  };

  // Next Round / Exchange
  const progressNextRound = async () => {
    if (isSimulating) return;
    const nextRoundNum = currentRound + 1;
    if (nextRoundNum > totalRounds) return;

    setError(null);
    setIsSimulating(true);

    try {
      const res = await api.simulateCourtroomRound({
        topic: topic.trim(),
        round: nextRoundNum,
        total_rounds: totalRounds,
        history: roundsHistory
      });

      setRoundsHistory(prev => [...prev, res]);
      setCurrentRound(nextRoundNum);

      // If autoplaying and not finished, trigger next after 3.5s delay
      if (autoPlayRef.current && nextRoundNum < totalRounds) {
        setTimeout(() => {
          if (autoPlayRef.current) {
            progressNextRound();
          }
        }, 3500);
      } else if (nextRoundNum >= totalRounds) {
        setIsAutoPlaying(false);
      }
    } catch (err: any) {
      setError(err.message || "Interruption in courtroom proceedings.");
      setIsAutoPlaying(false);
    } finally {
      setIsSimulating(false);
    }
  };

  // Trigger Autoplay
  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
    } else {
      setIsAutoPlaying(true);
      if (!isTrialActive) {
        startTrial().then(() => {
          setTimeout(() => {
            if (autoPlayRef.current) {
              progressNextRound();
            }
          }, 3500);
        });
      } else if (currentRound < totalRounds) {
        progressNextRound();
      }
    }
  };

  // Reset trial
  const resetTrial = () => {
    setIsAutoPlaying(false);
    setIsTrialActive(false);
    setCurrentRound(0);
    setRoundsHistory([]);
    setError(null);
  };

  const latestRound = roundsHistory[roundsHistory.length - 1];
  const isConcluded = latestRound && latestRound.verdict != null;

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Judicial Simulation
                </span>
                <span className="text-xs text-zinc-400">Hon&apos;ble AI High Court</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Simulated Courtroom Trial: Two AI Advocates &amp; Presiding Judge
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/debate/new"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-900"
            >
              1-on-1 User Debate &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">

        {/* Case Motion Setup Bar */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/50 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5 mb-1.5">
                <Gavel className="w-3.5 h-3.5" />
                Case Motion Under Judicial Review
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isTrialActive}
                  placeholder="e.g., kya engineering krna sahi hai, or any real-life dispute..."
                  className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Trial controls */}
            <div className="flex flex-wrap items-center gap-3">
              {!isTrialActive ? (
                <>
                  <div className="flex items-center gap-2 bg-zinc-950/60 border border-zinc-800 px-3 py-2 rounded-xl text-xs">
                    <span className="text-zinc-400">Exchanges:</span>
                    <select
                      value={totalRounds}
                      onChange={(e) => setTotalRounds(Number(e.target.value))}
                      className="bg-transparent text-amber-300 font-semibold focus:outline-none"
                    >
                      <option value={2} className="bg-zinc-900">2 Rounds (Express)</option>
                      <option value={3} className="bg-zinc-900">3 Rounds (Standard Trial)</option>
                      <option value={5} className="bg-zinc-900">5 Rounds (Full Inquest)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => startTrial()}
                    disabled={isSimulating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-900/30 transition-all active:scale-95"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Convene Court</span>
                  </button>

                  <button
                    onClick={toggleAutoPlay}
                    disabled={isSimulating}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold transition-all border border-zinc-700 active:scale-95"
                  >
                    <Play className="w-4 h-4 text-emerald-400" />
                    <span>Auto-Play Trial</span>
                  </button>
                </>
              ) : (
                <>
                  {!isConcluded ? (
                    <>
                      <button
                        onClick={progressNextRound}
                        disabled={isSimulating || isAutoPlaying}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950 font-bold text-sm hover:from-amber-400 hover:to-yellow-400 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isSimulating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                            <span>Advocates Sparring...</span>
                          </>
                        ) : (
                          <>
                            <span>Next Exchange (Round {currentRound + 1})</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <button
                        onClick={toggleAutoPlay}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                          isAutoPlaying
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                        }`}
                      >
                        <Play className={`w-4 h-4 ${isAutoPlaying ? "text-emerald-400 animate-spin" : ""}`} />
                        <span>{isAutoPlaying ? "Auto-Advancing..." : "Auto-Play"}</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verdict Delivered</span>
                    </div>
                  )}

                  <button
                    onClick={resetTrial}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs border border-zinc-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Case</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick preset chips when not active */}
          {!isTrialActive && cases.length > 0 && (
            <div className="mt-4 pt-3 border-t border-zinc-800/60 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">Curated Real-Life Disputes:</span>
              {cases.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setTopic(c.title);
                    startTrial(c.title);
                  }}
                  className="text-xs px-3 py-1 rounded-full bg-zinc-800/80 hover:bg-amber-500/15 hover:border-amber-500/40 border border-zinc-700/80 text-zinc-300 hover:text-amber-300 transition-all text-left flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{c.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Courtroom Visual Bench Header */}
        {isTrialActive && (
          <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/20 via-zinc-900/60 to-zinc-950/80 p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-yellow-600/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner">
                  <Gavel className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-white tracking-tight">
                      Hon&apos;ble Bench of Adjudication
                    </h2>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-amber-300">
                      Round {currentRound} / {totalRounds}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Presiding Chief Justice (Impartial AI Jurist) observing logical warrants &amp; empirical rigor
                  </p>
                </div>
              </div>

              {/* Courtroom progress indicator */}
              <div className="flex items-center gap-2">
                {[...Array(totalRounds)].map((_, idx) => {
                  const rNum = idx + 1;
                  const isDone = rNum <= currentRound;
                  const isCurrent = rNum === currentRound;
                  return (
                    <div
                      key={rNum}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        isDone
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500"
                      } ${isCurrent ? "ring-2 ring-amber-400/30" : ""}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{rNum === 1 ? "Opening" : rNum === totalRounds ? "Verdict" : `Round ${rNum}`}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Judge Bench Observation */}
            {latestRound?.judge_interlocutory && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200/90 text-sm flex items-start gap-2.5 font-serif italic">
                <span className="text-base select-none">⚖️</span>
                <div className="flex-1 leading-relaxed">
                  {latestRound.judge_interlocutory}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dual Advocate Sparring Stream */}
        {isTrialActive && (
          <div className="flex flex-col gap-6">
            {roundsHistory.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                {/* Round Divider */}
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                    Trial Exchange &bull; Round {item.round} of {item.total_rounds}
                  </span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>

                {/* 2 Podiums Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column: Party A (Advocate Sharma / Petitioner) */}
                  <div className="flex flex-col rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/20 via-zinc-900/60 to-zinc-900/40 p-5 shadow-xl hover:border-blue-500/50 transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-bold text-xs">
                          ⚖️ A
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-blue-200">
                            {item.party_a.counsel}
                          </h3>
                          <span className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold">
                            Petitioner / Affirmative Case
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono">
                        Plea
                      </span>
                    </div>

                    {/* Speech Argument */}
                    <div className="mt-4 flex-1 text-sm text-zinc-200 leading-relaxed space-y-2 whitespace-pre-line font-normal">
                      {item.party_a.speech}
                    </div>

                    {/* Citations Pill Box */}
                    {item.party_a.citations && item.party_a.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-blue-500/10 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-blue-400/80 font-medium flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> Cited Authority:
                        </span>
                        {item.party_a.citations.map((cite, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono"
                          >
                            {cite}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Party B (Advocate Verma / Respondent) */}
                  <div className="flex flex-col rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 via-zinc-900/60 to-zinc-900/40 p-5 shadow-xl hover:border-rose-500/50 transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 font-bold text-xs">
                          🛡️ B
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-rose-200">
                            {item.party_b.counsel}
                          </h3>
                          <span className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold">
                            Respondent / Defense &amp; Counter-Claim
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono">
                        Cross-Exam
                      </span>
                    </div>

                    {/* Counter Speech */}
                    <div className="mt-4 flex-1 text-sm text-zinc-200 leading-relaxed space-y-2 whitespace-pre-line font-normal">
                      {item.party_b.speech}
                    </div>

                    {/* Citations Pill Box */}
                    {item.party_b.citations && item.party_b.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-rose-500/10 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-rose-400/80 font-medium flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> Empirical Defense:
                        </span>
                        {item.party_b.citations.map((cite, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono"
                          >
                            {cite}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Verdict Box if present in this round */}
                {item.verdict && (
                  <div className="mt-6 rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/40 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 mb-4 shadow-xl">
                        <Award className="w-8 h-8 animate-bounce" />
                      </div>

                      <span className="text-xs uppercase tracking-widest text-amber-400 font-extrabold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                        Official Courtroom Decree
                      </span>

                      <h2 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight">
                        FINAL JUDGMENT ORDER
                      </h2>

                      <p className="text-sm font-semibold text-amber-300 mt-1">
                        Winner Declared: <span className="underline decoration-amber-400">{item.verdict.winner}</span>
                      </p>
                    </div>

                    {/* Scores Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 max-w-xl mx-auto">
                      <div className="rounded-xl bg-blue-950/20 border border-blue-500/30 p-4 text-center">
                        <span className="text-xs text-blue-300 font-semibold block">Petitioner (Sharma)</span>
                        <div className="text-2xl font-black text-white mt-1">
                          {item.verdict.party_a_score.toFixed(1)}
                          <span className="text-xs text-zinc-400 font-normal"> / 100</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-rose-950/20 border border-rose-500/30 p-4 text-center">
                        <span className="text-xs text-rose-300 font-semibold block">Respondent (Verma)</span>
                        <div className="text-2xl font-black text-white mt-1">
                          {item.verdict.party_b_score.toFixed(1)}
                          <span className="text-xs text-zinc-400 font-normal"> / 100</span>
                        </div>
                      </div>
                    </div>

                    {/* Ratio Decidendi */}
                    <div className="mt-6 rounded-xl bg-zinc-950/80 border border-zinc-800 p-5 text-left">
                      <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-2 mb-2">
                        <Scale className="w-4 h-4" />
                        Ratio Decidendi (Legal &amp; Logical Grounds)
                      </h4>
                      <p className="text-sm text-zinc-300 leading-relaxed font-serif">
                        {item.verdict.ratio_decidendi}
                      </p>
                    </div>

                    {/* Order Decree */}
                    <div className="mt-4 rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 text-left font-mono text-xs text-amber-200/90 leading-relaxed">
                      {item.verdict.order_summary}
                    </div>

                    <div className="mt-6 flex justify-center gap-3">
                      <button
                        onClick={resetTrial}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-zinc-950 font-bold text-sm shadow-lg shadow-amber-900/30 transition-all active:scale-95 flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Try Another Dispute</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Simulating state indicator */}
            {isSimulating && (
              <div className="flex items-center justify-center gap-3 py-8 text-amber-400">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-semibold tracking-wide">
                  Both Advocates are examining precedents and formulating counter-claims...
                </span>
              </div>
            )}

            <div ref={trialEndRef} />
          </div>
        )}

        {/* Welcome / How It Works when idle */}
        {!isTrialActive && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Party A: Advocate Sharma</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Represents the Petitioner. Fiercely presents the affirmative case, citing structural value, career mobility, and upside warrants.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Party B: Advocate Verma</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Represents the Respondent. Cross-examines every assumption with real-world failure rates, 80% unemployability data, and market disruption.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Gavel className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Hon&apos;ble AI Judge</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Moderates each exchange with gavel strikes, evaluates deductive rigor, and issues a binding Judgment Order with comparative scoring.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
