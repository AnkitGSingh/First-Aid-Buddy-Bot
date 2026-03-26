"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { sendChat, getHealth, type ChatResponse, type Citation } from "@/lib/api";
import EmergencyBanner from "@/components/EmergencyBanner";
import ChatMessage from "@/components/ChatMessage";
import CitationsPanel from "@/components/CitationsPanel";
import HistoryPanel from "@/components/HistoryPanel";
import { useChatHistory, type HistoryMessage, type ChatSession } from "@/hooks/useChatHistory";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  is_emergency?: boolean;
  emergency_number?: string;
  citations?: Citation[];
}

const REGIONS = [
  { code: "UK", label: "🇬🇧 UK (999)" },
  { code: "US", label: "🇺🇸 US (911)" },
  { code: "EU", label: "🇪🇺 EU (112)" },
];

const QUICK_QUESTIONS = [
  { icon: "🩸", text: "Severe bleeding that won't stop" },
  { icon: "💨", text: "Someone is choking" },
  { icon: "🔥", text: "How to treat a burn" },
  { icon: "💊", text: "Possible poisoning" },
  { icon: "🦴", text: "Suspected broken bone" },
  { icon: "🫀", text: "How to do CPR" },
];

function generateSessionId(): string {
  return "sess_" + (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11));
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState("UK");
  const [sessionId, setSessionId] = useState<string>(() => generateSessionId());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"quick" | "history">("quick");
  const { sessions, saveSession, deleteSession, clearHistory } = useChatHistory();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("fab_consent") === "1";
    setConsentGiven(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    getHealth()
      .then((h) => setBackendOnline(h.status === "ok" && h.api_key_configured))
      .catch(() => setBackendOnline(false));
  }, []);

  function acceptConsent() {
    sessionStorage.setItem("fab_consent", "1");
    setConsentGiven(true);
    inputRef.current?.focus();
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    await sendMessage(text);
  }

  function loadHistorySession(session: ChatSession) {
    setMessages(session.messages as Message[]);
    setRegion(session.region);
    setSessionId(session.id);
    setError(null);
    setLoading(false);
    setActiveTab("quick");
    setSidebarOpen(false);
  }

  async function sendMessage(text: string) {
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const messagesWithUser: Message[] = [...messages, userMsg];
    setMessages(messagesWithUser);
    setInput("");
    setLoading(true);
    setError(null);
    setSidebarOpen(false);

    try {
      const response: ChatResponse = await sendChat({
        message: text,
        session_id: sessionId,
        region,
      });
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        is_emergency: response.is_emergency,
        emergency_number: response.emergency_number,
        citations: response.citations,
      };
      const fullMessages: Message[] = [...messagesWithUser, assistantMsg];
      setMessages(fullMessages);
      saveSession(sessionId, fullMessages as HistoryMessage[], region);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const lastEmergency = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.is_emergency);

  const isEmpty = messages.length === 0;

  if (!mounted) {
    return (
      <div className="fixed inset-0" style={{ background: "var(--bg-base)" }} aria-hidden="true" />
    );
  }

  // ── Consent gate overlay ─────────────────────────────────────────────────────
  if (!consentGiven) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center px-4 py-6 overflow-y-auto"
        style={{ background: "rgba(240,250,249,0.97)", backdropFilter: "blur(12px)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-7 space-y-5 animate-fade-in my-auto"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-mid)",
            boxShadow: "0 24px 80px rgba(13,148,136,0.12)",
          }}
        >
          {/* Icon */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #0D9488, #0F766E)" }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" />
              </svg>
            </div>
            <h2 className="text-lg font-black" style={{ color: "var(--text-primary)" }}>Before you continue</h2>
          </div>

          {/* Disclaimer */}
          <div className="space-y-3 text-sm" style={{ color: "var(--text-muted)" }}>
            <p>
              <strong style={{ color: "var(--text-primary)" }}>First-Aid Buddy is not medical advice.</strong> It provides
              general first-aid guidance only and is not a substitute for professional medical care or
              emergency services.
            </p>
            <p style={{ color: "var(--accent-red)" }}>
              ⚠&nbsp;<strong>In any life-threatening emergency, call 999 (UK),
                911 (US), or 112 (EU) immediately</strong> — do not rely solely on this app.
            </p>
            <p>
              Your anonymised queries may be logged to improve guidance quality. No personally
              identifiable data is stored. By continuing you accept our{" "}
              <Link href="/privacy" className="underline" style={{ color: "var(--accent-teal)" }}>
                Privacy Policy
              </Link>.
            </p>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={acceptConsent}
            className="btn-primary w-full py-3 rounded-xl font-bold text-sm"
          >
            I understand — continue to First-Aid Buddy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>

      {/* ─────────────────────────────────────────────
          SIDEBAR (desktop always-visible, mobile overlay)
      ───────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:relative z-30 md:z-auto
          flex flex-col w-72 h-full shrink-0
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-subtle)",
          boxShadow: "2px 0 16px rgba(13,148,136,0.06)",
        }}
      >
        {/* Sidebar logo */}
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-4">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #0D9488, #0F766E)" }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>First-Aid Buddy</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>AI Emergency Assistant</p>
          </div>
        </div>

        {/* Region */}
        <div className="px-5 mb-5">
          <label
            htmlFor="region-select"
            className="text-[10px] font-semibold uppercase tracking-widest mb-1.5 block"
            style={{ color: "var(--text-dim)" }}
          >
            Region
          </label>
          <select
            id="region-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm outline-none"
            style={{
              background: "var(--bg-base)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-primary)",
            }}
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tab buttons */}
        <div className="flex px-5 mb-1 gap-1">
          {(["quick", "history"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all"
              style={{
                background: activeTab === tab ? "rgba(13,148,136,0.10)" : "transparent",
                color: activeTab === tab ? "var(--accent-teal)" : "var(--text-dim)",
                border: activeTab === tab ? "1px solid rgba(13,148,136,0.25)" : "1px solid transparent",
              }}
            >
              {tab === "history" ? `History${sessions.length ? ` (${sessions.length})` : ""}` : "Quick"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="px-5 flex-1 overflow-y-auto">
          {activeTab === "quick" ? (
            <ul className="space-y-1 pt-2">
              {QUICK_QUESTIONS.map((q) => (
                <li key={q.text}>
                  <button
                    type="button"
                    onClick={() => sendMessage(q.text)}
                    disabled={loading}
                    className="w-full text-left rounded-xl px-3 py-2.5 text-sm flex items-center gap-2.5 transition-all disabled:opacity-40"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-teal)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                    }}
                  >
                    <span className="text-base">{q.icon}</span>
                    <span className="leading-snug">{q.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="pt-2">
              <HistoryPanel
                sessions={sessions}
                activeSessionId={sessionId}
                onLoad={loadHistorySession}
                onDelete={deleteSession}
                onClearAll={clearHistory}
              />
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="px-5 py-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm rounded-xl px-3 py-2 transition-all hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to home
          </Link>
          <p className="mt-3 text-[10px] px-3 leading-relaxed" style={{ color: "var(--text-dim)" }}>
            This is not medical advice. Always call emergency services in life-threatening situations.
          </p>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────
          MAIN AREA
      ───────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 h-full">

        {/* Header */}
        <header
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            background: "rgba(255,255,255,0.92)",
            borderBottom: "1px solid var(--border-subtle)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
              type="button"
              className="md:hidden p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setSidebarOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0D9488, #0F766E)" }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" />
                </svg>
              </div>
              <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>First-Aid Buddy</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI status badge */}
            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full"
              aria-live="polite"
              aria-label={backendOnline === null ? "AI status: checking" : backendOnline ? "AI status: online" : "AI status: offline"}
              style={{
                background:
                  backendOnline === null
                    ? "rgba(234,179,8,0.1)"
                    : backendOnline
                      ? "rgba(22,163,74,0.1)"
                      : "rgba(220,38,38,0.1)",
                border: `1px solid ${backendOnline === null
                    ? "rgba(234,179,8,0.25)"
                    : backendOnline
                      ? "rgba(22,163,74,0.2)"
                      : "rgba(220,38,38,0.2)"
                  }`,
                color:
                  backendOnline === null
                    ? "#eab308"
                    : backendOnline
                      ? "#16a34a"
                      : "#dc2626",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                aria-hidden="true"
                style={{
                  background:
                    backendOnline === null ? "#eab308" : backendOnline ? "#16a34a" : "#dc2626",
                  boxShadow:
                    backendOnline === null
                      ? "0 0 6px #eab308"
                      : backendOnline
                        ? "0 0 6px #16a34a"
                        : "0 0 6px #dc2626",
                }}
              />
              {backendOnline === null ? "AI Checking…" : backendOnline ? "AI Online" : "AI Offline"}
            </span>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={() => { setMessages([]); setSessionId(generateSessionId()); setError(null); }}
                className="px-3 py-1.5 rounded-xl text-xs transition-all"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-muted)", background: "var(--bg-surface)" }}
                aria-label="Start a new chat"
              >
                New Chat
              </button>
            )}
          </div>
        </header>

        {/* Emergency banner */}
        {lastEmergency && (
          <div className="px-4 pt-3 shrink-0">
            <EmergencyBanner emergencyNumber={lastEmergency.emergency_number ?? "999"} />
          </div>
        )}

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4" role="log" aria-live="polite" aria-label="Chat messages">
          <h1 className="sr-only">First-Aid Buddy — AI Chat</h1>
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full text-center pb-12 animate-fade-in">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, rgba(13,148,136,0.12), rgba(22,163,74,0.10))", border: "1px solid rgba(13,148,136,0.20)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth={1.5} style={{ color: "#0D9488" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                What&apos;s the emergency?
              </h2>
              <p className="text-sm max-w-sm mb-8" style={{ color: "var(--text-muted)" }}>
                Describe the situation and I&apos;ll guide you through the right first-aid steps immediately.
              </p>
              {/* Chip suggestions */}
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {QUICK_QUESTIONS.slice(0, 4).map((q) => (
                  <button
                    key={q.text}
                    type="button"
                    onClick={() => sendMessage(q.text)}
                    disabled={loading}
                    className="chip"
                  >
                    <span>{q.icon}</span>
                    <span>{q.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-pop-in">
                <ChatMessage role={msg.role} content={msg.content} />
                {msg.role === "assistant" && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 ml-11">
                    <CitationsPanel citations={msg.citations} />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator — breathing teal pulse, not red */}
            {loading && (
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="relative shrink-0">
                  {/* Expanding teal rings */}
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      border: "2px solid rgba(13,148,136,0.6)",
                      animation: "ring-expand 1.2s ease-out infinite",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      border: "2px solid rgba(13,148,136,0.35)",
                      animation: "ring-expand 1.2s ease-out 0.4s infinite",
                    }}
                  />
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center animate-breathe"
                    style={{
                      background: "linear-gradient(135deg, #0D9488, #0F766E)",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="white"
                      className="w-4 h-4 animate-spin-cross"
                    >
                      <path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" />
                    </svg>
                  </div>
                </div>

                {/* Thinking bubble */}
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-2xl rounded-tl-sm"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: "0 2px 12px rgba(13,148,136,0.08)",
                  }}
                >
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm flex items-start gap-2 animate-fade-in"
                style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.20)", color: "#dc2626" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 mt-0.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                {error}
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div
          className="shrink-0 px-4 py-3"
          style={{
            background: "rgba(255,255,255,0.95)",
            borderTop: "1px solid var(--border-subtle)",
            backdropFilter: "blur(16px)",
          }}
        >
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
            <label htmlFor="emergency-input" className="sr-only">
              Describe the emergency or first-aid situation
            </label>
            <input
              ref={inputRef}
              id="emergency-input"
              name="emergency"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the emergency or first-aid situation…"
              aria-label="Describe the emergency or first-aid situation"
              autoComplete="off"
              spellCheck={false}
              disabled={loading}
              autoFocus
              className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50"
              style={{
                background: "var(--bg-base)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-teal)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(13,148,136,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary px-5 py-3 rounded-2xl font-semibold text-sm shrink-0 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              )}
              <span className="hidden sm:inline">{loading ? "Thinking…" : "Send"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
