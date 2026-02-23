/**
 * CitationsPanel – glassmorphism card showing the KB sources used.
 */
"use client";

import { useState } from "react";
import type { Citation } from "@/lib/api";

interface Props {
  citations: Citation[];
}

export default function CitationsPanel({ citations }: Props) {
  const [open, setOpen] = useState(false);

  if (!citations.length) return null;

  return (
    <div>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all"
        style={{
          background: "rgba(79,142,247,0.08)",
          border: "1px solid rgba(79,142,247,0.15)",
          color: "var(--accent-blue)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        {citations.length} source{citations.length !== 1 ? "s" : ""} used
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
          className={`w-2.5 h-2.5 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Expanded panel */}
      {open && (
        <div
          className="mt-2 rounded-2xl px-4 py-3 space-y-3 animate-fade-in"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--text-dim)" }}
          >
            Knowledge sources
          </p>
          {citations.map((c, i) => (
            <div key={i} className="flex gap-3">
              <div
                className="mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold text-white"
                style={{ background: "rgba(79,142,247,0.2)", color: "var(--accent-blue)" }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{c.title}</p>
                <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {c.snippet}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
