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
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

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
    }
  }

  const lastEmergency = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.is_emergency);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-gray-400 hover:text-gray-700 text-xl transition">
            ←
          </Link>
          <span className="text-2xl">🩺</span>
          <h1 className="font-bold text-gray-900">First-Aid Buddy</h1>
        </div>

        {/* Region selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="region" className="text-xs text-gray-500 hidden sm:block">
            Region:
          </label>
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700"
          >
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Emergency banner – shows when any response is a live emergency */}
      {lastEmergency && (
        <div className="px-4 pt-3">
          <EmergencyBanner
            emergencyNumber={lastEmergency.emergency_number ?? "999"}
          />
        </div>
      )}

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-2 pb-16">
            <span className="text-5xl">💬</span>
            <p className="font-medium text-gray-600">Ask any first-aid question</p>
            <p className="text-sm max-w-xs">
              e.g. "Someone swallowed bleach", "How do I treat a burn?",
              "My child is choking"
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id}>
            <ChatMessage role={msg.role} content={msg.content} />
            {msg.role === "assistant" && msg.citations && msg.citations.length > 0 && (
              <div className="mt-1 ml-3">
                <CitationsPanel citations={msg.citations} />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            ⚠ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 bg-white border-t border-gray-200 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the first-aid situation…"
          disabled={loading}
          className="flex-1 rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "…" : "Send"}
        </button>
      </form>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 py-1 bg-white border-t border-gray-100">
        Not a substitute for professional medical advice. Always call emergency services in life-threatening situations.
      </p>
    </div>
  );
}
