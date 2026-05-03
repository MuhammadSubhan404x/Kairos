"use client";

import { useState, useEffect, useRef } from "react";
import { X, Copy, Check, Loader2, RefreshCw } from "lucide-react";
import type { RankedOpportunity, StudentProfile } from "@/lib/types";

interface Props {
  item: RankedOpportunity;
  profile: StudentProfile;
  onClose: () => void;
}

export default function CoverLetterModal({ item, profile, onClose }: Props) {
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const opp = item.opportunity;

  const startTimer = () => {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
  };
  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const generate = async () => {
    setLoading(true);
    setLetter("");
    startTimer();
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunity: opp, profile }),
      });
      const data = await res.json();
      setLetter(data.letter ?? "Failed to generate. Please try again.");
    } catch {
      setLetter("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      stopTimer();
    }
  };

  useEffect(() => { generate(); return () => stopTimer(); }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-slide-in">
      <div className="w-full max-w-2xl bg-[#141A2E] border border-violet-500/25 rounded-2xl shadow-2xl shadow-violet-500/10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-0.5">Cover Letter Draft</p>
            <h3 className="font-bold text-white text-sm leading-tight truncate max-w-xs">{opp.title}</h3>
            <p className="text-slate-500 text-xs">{opp.organization}</p>
          </div>
          <div className="flex items-center gap-2">
            {letter && !loading && (
              <>
                <button onClick={generate}
                  className="p-2 rounded-xl border border-white/10 hover:border-white/25 text-slate-400 hover:text-white transition-all"
                  title="Regenerate">
                  <RefreshCw size={14} />
                </button>
                <button onClick={copy}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/25 text-xs font-medium transition-all">
                  {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                </button>
              </>
            )}
            <button onClick={onClose}
              className="p-2 rounded-xl border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400">
              <Loader2 size={24} className="animate-spin text-violet-400" />
              <p className="text-sm">Drafting your cover letter...</p>
              {elapsed > 3 && (
                <p className="text-xs text-slate-600">{elapsed}s — AI is writing, almost there...</p>
              )}
            </div>
          ) : (
            <pre className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {letter}
            </pre>
          )}
        </div>

        <div className="px-6 py-3 border-t border-white/5 text-xs text-slate-600">
          AI-generated draft — review and personalize before sending.
        </div>
      </div>
    </div>
  );
}
