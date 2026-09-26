"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DebateBox from "@/component/DebateBox";
import { DebateSession, api } from "@/lib/api";
import { Loader2, ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

function DebateArenaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const debateId = searchParams.get("id");
  const topicParam = searchParams.get("topic");
  const posParam = searchParams.get("pos") as "for" | "against" | null;
  const diffParam = searchParams.get("diff") as "friendly" | "standard" | "brutal" | null;
  const roundsParam = searchParams.get("rounds");

  const [session, setSession] = useState<DebateSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initSession() {
      setLoading(true);
      setError(null);

      try {
        if (debateId) {
          const data = await api.getDebate(debateId);
          setSession(data);
        } else if (topicParam) {
          const newSession = await api.createDebate(
            topicParam,
            posParam || "for",
            diffParam || "standard",
            roundsParam ? parseInt(roundsParam, 10) : 3
          );
          setSession(newSession);
        } else {
          // Default debate match
          const defaultSession = await api.createDebate(
            "Governments Should Heavily Regulate Frontier AI Models",
            "for",
            "standard",
            3
          );
          setSession(defaultSession);
        }
      } catch (err: any) {
        setError(err.message || "Failed to initialize debate arena.");
      } finally {
        setLoading(false);
      }
    }

    initSession();
  }, [debateId, topicParam, posParam, diffParam, roundsParam]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-white">Summoning Devil&apos;s Advocate...</h3>
          <p className="text-xs text-zinc-400">Initializing cognitive debate engine and vector knowledge base</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Arena Initialization Failed</h3>
          <p className="text-xs text-zinc-400">{error || "Could not load debate session."}</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-300 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Arena Hub</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-2">
      <DebateBox
        session={session}
        onSessionUpdate={(updated) => setSession(updated)}
      />
    </div>
  );
}

export default function DebatePage() {
  return (
    <Suspense
      fallback={
        <div className="h-[70vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-rose-400" />
        </div>
      }
    >
      <DebateArenaContent />
    </Suspense>
  );
}
