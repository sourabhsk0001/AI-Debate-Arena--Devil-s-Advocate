import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/component/Navbar";

export const metadata: Metadata = {
  title: "AI Debate Arena — Devil's Advocate",
  description: "Production GenAI application that challenges your arguments, detects fallacies, cites RAG evidence, and evaluates debate performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-zinc-100 antialiased selection:bg-rose-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-surface-border bg-surface/50 py-8 text-center text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300">AI Debate Arena</span>
              <span>•</span>
              <span>Devil&apos;s Advocate GenAI System</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <span>LangGraph Cognitive Engine</span>
              <span>•</span>
              <span>RAG Vector Grounding</span>
              <span>•</span>
              <span>Multi-Factor Judging</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
