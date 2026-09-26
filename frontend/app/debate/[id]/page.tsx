"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Flame,
  HelpCircle,
  Swords,
  Award,
  Layers,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Bot,
  Sparkles,
} from "lucide-react";
import { DebateSession, DebateMessage as DebateMessageType, DebateMode } from "@/types/debate";
import { api } from "@/lib/api";
import DebateMessage from "@/components/DebateMessage";
import DebateInput from "@/components/DebateInput";
import ProgressBar from "@/components/ProgressBar";
import EvaluationPanel from "@/components/EvaluationPanel";
import LoadingMessage from "@/components/LoadingMessage";
import ErrorMessage from "@/components/ErrorMessage";
import Button from "@/components/Button";

export default function DebateRoomPage() {
  const params = useParams();
  const router = useRouter();
  const debateId = params.id as string;

  const [session, setSession] = useState<DebateSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [concluding, setConcluding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load debate session
  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDebate(debateId);
        setSession(data);
      } catch (err: any) {
        setError(err.message || "Failed to load debate room.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [debateId]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [session?.messages, sending]);

  const handleSend = async (content: string) => {
    if (!session || sending || session.status === "completed") return;

    setError(null);
    setSending(true);

    try {
      const res = await api.sendMessage(session.id, content);
      setSession(res.debate);

      if (res.debate.status === "completed") {
        router.push(`/debate/${session.id}/results`);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong while generating the counterargument. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleAIOpen = async () => {
    if (!session || sending) return;
    setError(null);
    setSending(true);
    try {
      const res = await api.requestAIOpening(session.id);
      setSession(res.debate);
    } catch (err: any) {
      setError(err.message || "Failed to generate AI opening argument.");
    } finally {
      setSending(false);
    }
  };

  const handleConclude = async () => {
    if (!session || concluding || session.messages.length === 0) return;
    setConcluding(true);
    try {
      await api.evaluateDebate(session.id);
      router.push(`/debate/${session.id}/results`);
    } catch (err: any) {
      setError("Failed to conclude debate.");
      setConcluding(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        <p className="text-sm font-semibold text-zinc-300">Initializing Arena Stage...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center max-w-md mx-auto">
        <ShieldAlert className="w-12 h-12 text-red-400" />
        <h2 className="text-lg font-bold text-white">Debate Room Unavailable</h2>
        <p className="text-xs text-zinc-400">{error || "Could not find session."}</p>
        <Button variant="secondary" size="sm" onClick={() => router.push("/debate/new")}>
          Create New Debate
        </Button>
      </div>
    );
  }

  const latestAIMessage = [...session.messages].reverse().find((m) => m.role === "devil_advocate");

  const getModeBadge = (m: DebateMode) => {
    switch (m) {
      case "socratic":
        return { label: "Mode 2 — Socratic", color: "text-purple-300 bg-purple-500/10 border-purple-500/30" };
      case "opponent":
        return { label: "Mode 3 — Opponent", color: "text-amber-300 bg-amber-500/10 border-amber-500/30" };
      case "neutral_judge":
        return { label: "Mode 4 — Neutral Judge", color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30" };
      case "devils_advocate":
      default:
        return { label: "Mode 1 — Devil's Advocate", color: "text-rose-300 bg-rose-500/10 border-rose-500/30" };
    }
  };

  const badge = getModeBadge(session.mode);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
      {/* ======================================================== */}
      {/* 1. LEFT SIDE: Topic, Mode, Round, Progress, Position     */}
      {/* ======================================================== */}
      <aside className="lg:col-span-3 glass-panel rounded-3xl p-5 border border-surface-border flex flex-col justify-between space-y-6 overflow-y-auto">
        <div className="space-y-5">
          {/* Mode Badge */}
          <div className="space-y-1.5">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${badge.color}`}>
              {badge.label}
            </span>
            <div className="text-[11px] text-zinc-500 font-mono">
              Intensity: {session.difficulty}
            </div>
          </div>

          {/* Topic Motion */}
          <div className="space-y-1">
            <div className="text-[11px] uppercase font-bold tracking-wider text-zinc-500">
              Debate Motion
            </div>
            <h2 className="text-base font-extrabold text-white leading-snug">
              {session.topic}
            </h2>
          </div>

          {/* User Position */}
          <div className="space-y-1.5 bg-surface/70 p-3.5 rounded-2xl border border-surface-border">
            <div className="text-[11px] uppercase font-bold tracking-wider text-zinc-400">
              Your Position
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${
                  session.position === "for"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : session.position === "against"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                }`}
              >
                {session.position}
              </span>
              <span className="text-xs text-zinc-300">
                {session.position === "for"
                  ? "Affirmative Case"
                  : session.position === "against"
                  ? "Negative Counter"
                  : "Exploratory Stance"}
              </span>
            </div>
          </div>

          {/* Current Round & Progress Bar */}
          <div className="space-y-2 bg-surface/70 p-3.5 rounded-2xl border border-surface-border">
            <div className="text-[11px] uppercase font-bold tracking-wider text-zinc-400">
              Debate Progress
            </div>
            <ProgressBar
              currentRound={session.current_round}
              maxRounds={session.max_rounds}
              status={session.status}
            />
          </div>
        </div>

        {/* Early Conclude / Judge Button */}
        {session.messages.length > 0 && session.status !== "completed" && (
          <div className="pt-4 border-t border-surface-border">
            <Button
              variant="outline"
              size="sm"
              loading={concluding}
              onClick={handleConclude}
              icon={<Award className="w-4 h-4 text-amber-400" />}
              className="w-full text-xs"
            >
              Conclude &amp; Judge Now
            </Button>
          </div>
        )}
      </aside>

      {/* ======================================================== */}
      {/* 2. CENTER: Chat Messages & Bottom Input                   */}
      {/* ======================================================== */}
      <section className="lg:col-span-6 glass-panel rounded-3xl border border-surface-border flex flex-col justify-between overflow-hidden shadow-2xl">
        {/* Chat Feed */}
        <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {session.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                <Flame className="w-7 h-7" />
              </div>
              <div className="max-w-sm space-y-1.5">
                <h3 className="text-base font-bold text-white">Opening Argument</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Have the AI present the initial argument on <strong className="text-zinc-200">"{session.topic}"</strong> so you can challenge it, or type your own thesis below.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  loading={sending}
                  onClick={handleAIOpen}
                  icon={<Bot className="w-4 h-4" />}
                >
                  Let AI Make Opening Argument
                </Button>
              </div>
            </div>
          ) : (
            session.messages.map((msg) => (
              <DebateMessage
                key={msg.id}
                message={msg}
                userPosition={session.position}
                mode={session.mode}
              />
            ))
          )}

          {/* AI Thinking State */}
          {sending && <LoadingMessage />}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="px-4 pb-2">
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {/* Bottom Input */}
        <div className="p-4 sm:p-5 border-t border-surface-border bg-surface/80">
          {session.status === "completed" ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-surface-border">
              <div className="flex items-center gap-2 text-xs text-zinc-200 font-bold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Debate Concluded! Full Scorecard Ready.</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(`/debate/${session.id}/results`)}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                View Results
              </Button>
            </div>
          ) : (
            <DebateInput
              onSend={handleSend}
              loading={sending}
              placeholder={
                session.messages.length === 0
                  ? `State your opening thesis for why you are ${session.position.toUpperCase()} this motion...`
                  : `Address the Devil's Advocate's question and defend your premise...`
              }
            />
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. RIGHT SIDE: Live Analysis Panel (Section 7)           */}
      {/* ======================================================== */}
      <aside className="lg:col-span-3 overflow-y-auto space-y-4">
        <EvaluationPanel
          evaluation={session.evaluation}
          latestAnalysis={latestAIMessage?.analysis}
          roundNumber={session.current_round}
        />
      </aside>
    </div>
  );
}
