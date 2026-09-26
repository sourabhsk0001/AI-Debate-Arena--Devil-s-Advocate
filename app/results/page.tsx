"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ScoreCard from "@/component/ScoreCard";
import { DebateSession, api } from "@/lib/api";
import { Loader2, Award, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const debateId = searchParams.get("id");

  const [session, setSession] = useState<DebateSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadResults() {
      if (!debateId) {
        setError("No debate ID provided.");
        setLoading(false);
        return;
      }

      try {
        const data = await api.getDebate(debateId);
        // If not evaluated yet, trigger evaluation
        if (!data.evaluation && data.turns.length > 0) {
          const judged = await api.concludeDebate(debateId);
          setSession(judged);
        } else {
          setSession(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load debate evaluation.");
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [debateId]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-white">Chief Adjudicator Deliberating...</h3>
          <p className="text-xs text-zinc-400">Analyzing transcripts, evaluating logic, and computing composite scorecard</p>
        </div>
      </div>
    );
  }

  if (error || !session || !session.evaluation) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">Evaluation Unavailable</h3>
          <p className="text-xs text-zinc-400">{error || "This debate has no evaluation records yet."}</p>
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-light border border-surface-border text-zinc-300 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Arena</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      <ScoreCard session={session} evaluation={session.evaluation} />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-[70vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
