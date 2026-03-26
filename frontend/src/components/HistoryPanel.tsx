/**
 * HistoryPanel – renders saved chat sessions with load and delete actions.
 * Designed to sit inside the chat sidebar.
 */
"use client";

import type { ChatSession } from "@/hooks/useChatHistory";

interface Props {
  sessions: ChatSession[];
  activeSessionId: string;
  onLoad: (session: ChatSession) => void;
  onDelete: (sessionId: string) => void;
  onClearAll: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function HistoryPanel({
  sessions,
  activeSessionId,
  onLoad,
  onDelete,
  onClearAll,
}: Props) {
  if (sessions.length === 0) {
    return (
      <div className="px-3 py-6 text-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
          style={{ background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.15)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5" style={{ color: "var(--accent-teal)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>No saved chats yet</p>
        <p className="text-[10px] mt-1" style={{ color: "var(--text-dim)" }}>
          Your conversations will appear here after you chat.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Clear all */}
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-dim)" }}>
          {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </span>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Delete all saved chat history? This cannot be undone.")) {
              onClearAll();
            }
          }}
          className="text-[10px] px-2 py-0.5 rounded-md transition-all"
          style={{ color: "var(--text-dim)", border: "1px solid var(--border-subtle)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#DC2626"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.4)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-subtle)"; }}
          title="Delete all history"
        >
          Clear all
        </button>
      </div>

      {sessions.map((s) => {
        const isActive = s.id === activeSessionId;
        return (
          <div
            key={s.id}
            className="group relative flex items-start gap-2 rounded-xl px-3 py-2.5 transition-all cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`Load session: ${s.title}`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onLoad(s); } }}
            style={{
              background: isActive ? "rgba(13,148,136,0.10)" : "transparent",
              border: isActive ? "1px solid rgba(13,148,136,0.28)" : "1px solid transparent",
            }}
            onClick={() => onLoad(s)}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "rgba(13,148,136,0.05)";
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            {/* Emergency indicator dot */}
            {s.hadEmergency && (
              <span
                className="mt-1 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "#DC2626", boxShadow: "0 0 4px #DC2626", marginTop: "5px" }}
                title="This session contained an emergency"
              />
            )}

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p
                className="text-xs leading-snug truncate font-medium"
                style={{ color: isActive ? "var(--accent-teal)" : "var(--text-muted)" }}
              >
                {s.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                  {formatDate(s.updatedAt)}
                </span>
                <span className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                  {(() => {
                    const userMsgCount = s.messages.filter((m) => m.role === "user").length;
                    return `${userMsgCount} msg${userMsgCount !== 1 ? "s" : ""}`;
                  })()}
                </span>
                <span className="text-[10px] uppercase" style={{ color: "var(--text-dim)" }}>
                  · {s.region}
                </span>
              </div>
            </div>

            {/* Delete button — shown on hover */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Delete this chat session?")) onDelete(s.id);
              }}
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg"
              style={{ color: "var(--text-dim)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#DC2626"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-dim)"; }}
              title="Delete this session"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
