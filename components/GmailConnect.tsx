"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Mail, Loader2, CheckCircle, AlertCircle, LogOut, Download } from "lucide-react";

interface GmailConnectProps {
  onEmailsLoaded: (emails: string[]) => void;
}

export default function GmailConnect({ onEmailsLoaded }: GmailConnectProps) {
  const { data: session, status } = useSession();
  const [fetching, setFetching] = useState(false);
  const [fetched, setFetched] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    setFetching(true);
    setError(null);
    setFetched(null);
    try {
      const res = await fetch("/api/gmail");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch emails");
      onEmailsLoaded(data.emails);
      setFetched(data.count);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setFetching(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-slate-500 text-xs py-2 px-3">
        <Loader2 size={12} className="animate-spin" /> Checking Gmail connection...
      </div>
    );
  }

  // Not connected
  if (!session) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm px-4 py-3 rounded-xl transition-all shadow-md"
        >
          {/* Google G logo */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Connect Gmail
        </button>
        <p className="text-xs text-slate-600 text-center">
          Read-only access · No emails stored on any server
        </p>
      </div>
    );
  }

  // Connected
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
          <span className="text-xs text-slate-400 truncate">{session.user?.email}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1 text-xs text-slate-600 hover:text-red-400 transition-colors flex-shrink-0"
          title="Disconnect"
        >
          <LogOut size={11} /> Disconnect
        </button>
      </div>

      <button
        onClick={fetchEmails}
        disabled={fetching}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600/90 to-emerald-500/90 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
      >
        {fetching ? (
          <><Loader2 size={14} className="animate-spin" /> Fetching from Gmail...</>
        ) : (
          <><Download size={14} /> Import from Gmail</>
        )}
      </button>

      {fetched !== null && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <CheckCircle size={11} />
          {fetched} emails imported from your inbox
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={11} /> {error}
        </div>
      )}
    </div>
  );
}
