/**
 * ChatMessage – renders a single user or assistant bubble.
 * AI responses get a clean white glassmorphism card with avatar.
 * User messages get a teal gradient pill aligned right.
 *
 * SECURITY: All content is rendered as plain React nodes — never via
 * dangerouslySetInnerHTML — to prevent XSS from model-generated payloads.
 */
import React from "react";

/** Splits a line on **bold** markers and returns safe React nodes. */
function formatBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.+?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${i}-${part.slice(2, 10)}`}>{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );
}

function renderContent(text: string) {
  // Minimal markdown: **bold** and bullet lists (-, •, *). No HTML injection.
  // Consecutive bullet lines are collected and wrapped in a single <ul> to
  // produce valid HTML (bare <li> outside a list is invalid and breaks screen readers).
  const lines = text.split("\n");
  const output: React.ReactNode[] = [];
  let bulletBuffer: React.ReactNode[] = [];

  function flushBullets() {
    if (bulletBuffer.length > 0) {
      output.push(
        <ul key={`ul-${output.length}`} className="ml-4 list-disc space-y-0.5 my-1">
          {bulletBuffer}
        </ul>
      );
      bulletBuffer = [];
    }
  }

  lines.forEach((line, i) => {
    const isBullet = /^[-•*]\s/.test(line.trim());
    const cleanLine = isBullet ? line.trim().replace(/^[-•*]\s/, "") : line;
    const nodes = formatBold(cleanLine);

    if (isBullet) {
      bulletBuffer.push(<li key={i}>{nodes}</li>);
    } else {
      flushBullets();
      output.push(
        line.trim()
          ? <p key={i}>{nodes}</p>
          : <span key={i} className="block h-2" />
      );
    }
  });

  flushBullets();
  return output;
}

interface Props {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white"
          style={{
            background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)",
            boxShadow: "0 4px 20px rgba(13,148,136,0.25)",
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {/* AI avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: "linear-gradient(135deg, #0D9488, #0F766E)" }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" />
        </svg>
      </div>

      {/* Bubble */}
      <div
        className="flex-1 max-w-[90%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-primary)",
          boxShadow: "0 2px 12px rgba(13,148,136,0.08)",
        }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-2"
          style={{ color: "var(--accent-teal)" }}
        >
          First-Aid Buddy
        </p>
        <div className="space-y-1">{renderContent(content)}</div>
      </div>
    </div>
  );
}
