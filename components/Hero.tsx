"use client";

import { Zap, ArrowRight, Mail, Clock, FileText } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-6 py-24 text-center">
      <div className="animate-orb-1 absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="animate-orb-2 absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.08),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 glass border border-violet-500/30 rounded-full px-4 py-2 text-sm text-violet-300 mb-8">
          <Zap size={13} className="text-cyan-400" />
          <span>AI-Powered Opportunity Intelligence</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
          Stop Missing{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">
            Deadlines.
          </span>
          <br />
          <span className="text-white/90">Start Winning.</span>
        </h1>

        <p className="text-slate-400 text-xl mb-4 max-w-2xl mx-auto leading-relaxed">
          Paste your opportunity emails. Kairos scores every scholarship, internship, and fellowship
          against your profile — and tells you exactly what to apply to first.
        </p>

        <p className="text-slate-600 text-sm mb-10 max-w-xl mx-auto">
          Deterministic scoring engine. No guesswork. Every rank is backed by evidence you can read.
        </p>

        <button
          onClick={onGetStarted}
          className="group inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
        >
          <Mail size={18} />
          Analyze My Emails
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { icon: Mail,     value: "Up to 15",  label: "Emails analyzed" },
            { icon: Clock,    value: "< 10s",     label: "Ranked results" },
            { icon: FileText, value: "1-click",   label: "Cover letter draft" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass border border-violet-500/15 rounded-xl py-4 px-3">
              <Icon size={16} className="text-violet-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
