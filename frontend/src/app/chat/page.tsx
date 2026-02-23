"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";
import { sendChat, type ChatResponse, type Citation } from "@/lib/api";
import EmergencyBanner from "@/components/EmergencyBanner";
import ChatMessage from "@/components/ChatMessage";
import CitationsPanel from "@/components/CitationsPanel";

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
  return "sess_" + Math.random().toString(36).slice(2, 11);
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [region, setRegion] = useState("UK");
  const [sessionId] = useState<string>(() => generateSessionId());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    await sendMessage(text);
  }

  async function sendMessage(text: string) {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
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
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        is_emergency: response.is_emergency,
        emergency_number: response.emergency_number,
        citations: response.citations,
      };
      setMessages((prev) => [...prev, assistantMsg]);
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

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>

      {/* ─────────────────────────────────────────────
          SIDEBAR (desktop always-visible, mobile overlay)
      ───────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
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
        }}
      >
        {/* Sidebar logo */}
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-4">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{ background: "linear-gradient(135deg, #F04747, #FB923C)" }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">First-Aid Buddy</p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>AI Emergency Assistant</p>
          </div>
        </div>

        {/* Region */}
        <div className="px-5 mb-5">
          <label className="text-[10px] font-semibold uppercase tracking-widest mb-1.5 block" style={{ color: "var(--text-dim)" }}>
            Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-xl px-3 py-2 text-sm text-white outline-none"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code} style={{ background: "#0D1526" }}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick questions */}
        <div className="px-5 flex-1 overflow-y-auto">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-dim)" }}>
            Quick questions
          </p>
          <ul className="space-y-1">
            {QUICK_QUESTIONS.map((q) => (
              <li key={q.text}>
                <button
                  onClick={() => sendMessage(q.text)}
                  disabled={loading}
                  className="w-full text-left rounded-xl px-3 py-2.5 text-sm flex items-center gap-2.5 transition-all disabled:opacity-40"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
                    (e.currentTarget as HTMLButtonElement).style.color = "white";
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
        </div>

        {/* Back to home */}
        <div className="px-5 py-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm rounded-xl px-3 py-2 transition-all"
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
            background: "rgba(5,11,24,0.8)",
            borderBottom: "1px solid var(--border-subtle)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile only) */}
            <button
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
                style={{ background: "linear-gradient(135deg, #F04747, #FB923C)" }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" />
                </svg>
              </div>
              <span className="font-bold text-white text-sm">First-Aid Buddy</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full"
              style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ boxShadow: "0 0 6px #22c55e" }} />
              AI Active
            </span>
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="px-3 py-1.5 rounded-xl text-xs transition-all"
                style={{ border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
              >
                Clear
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
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isEmpty && (
            <div className="flex flex-col items-center justify-center h-full text-center pb-12 animate-fade-in">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "linear-gradient(135deg, rgba(240,71,71,0.2), rgba(251,146,60,0.2))", border: "1px solid rgba(240,71,71,0.2)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-red-400" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
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
                    onClick={() => sendMessage(q.text)}
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

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-start gap-3 animate-fade-in">
                {/* Avatar with spinning + and expanding ring */}
                <div className="relative shrink-0">
                  {/* Pulsing ring */}
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      border: "2px solid #F04747",
                      animation: "ring-expand 1.2s ease-out infinite",
                    }}
                  />
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      border: "2px solid #FB923C",
                      animation: "ring-expand 1.2s ease-out 0.4s infinite",
                    }}
                  />
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #F04747, #FB923C)",
                      boxShadow: "0 0 16px rgba(240,71,71,0.5)",
                    }}
                  >
                    {/* Spinning + cross */}
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
                style={{ background: "rgba(240,71,71,0.1)", border: "1px solid rgba(240,71,71,0.2)", color: "#f87171" }}
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
            background: "rgba(5,11,24,0.8)",
            borderTop: "1px solid var(--border-subtle)",
            backdropFilter: "blur(16px)",
          }}
        >
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the emergency or first-aid situation…"
              disabled={loading}
              autoFocus
              className="flex-1 rounded-2xl px-4 py-3 text-sm text-white placeholder-[color:var(--text-dim)] outline-none focus:ring-2 transition-all disabled:opacity-50"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-blue)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(79,142,247,0.15)";
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
