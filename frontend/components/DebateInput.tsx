"use client";

import React, { useState } from "react";
import { Send, Mic, Loader2 } from "lucide-react";

interface DebateInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

export default function DebateInput({
  onSend,
  disabled = false,
  loading = false,
  placeholder = "Address the Devil's Advocate's question and defend your premise...",
}: DebateInputProps) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled || loading) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoice = () => {
    // Voice speech-to-text placeholder / toggle
    setIsRecording(!isRecording);
  };

  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          disabled={disabled || loading}
          className="w-full p-3.5 pr-24 rounded-2xl bg-surface border border-surface-border text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/50 resize-none transition-all disabled:opacity-50"
        />

        <div className="absolute right-3 bottom-3.5 flex items-center gap-1.5">
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-2 rounded-xl transition-all ${
              isRecording
                ? "bg-red-600 text-white animate-pulse"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
            title="Voice input (Speech to text)"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!text.trim() || disabled || loading}
            className="p-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white disabled:opacity-30 transition-all shadow-md shadow-rose-950/40"
            title="Send argument (Ctrl+Enter)"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
        <div className="flex items-center gap-2">
          <span>{wordCount} words</span>
          <span>•</span>
          <span className="hidden sm:inline">
            Press <kbd className="px-1 py-0.5 rounded bg-surface-light border border-surface-border font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1 py-0.5 rounded bg-surface-light border border-surface-border font-mono text-[10px]">Enter</kbd> to submit
          </span>
        </div>
        <span className="text-zinc-500">Argument will be analyzed across 5 criteria</span>
      </div>
    </form>
  );
}
