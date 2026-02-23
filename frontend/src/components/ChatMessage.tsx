/**
 * ChatMessage – renders a single user or assistant bubble.
 * AI responses get a glassmorphism card with avatar.
 * User messages get a gradient pill aligned right.
 */

function renderContent(text: string) {
  // Very simple inline markdown: **bold**, bullet lists starting with - or •
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const isBullet = /^[-•*]\s/.test(line.trim());
    const formatted = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    if (isBullet) {
      return (
        <li
          key={i}
          className="ml-4 list-disc"
          dangerouslySetInnerHTML={{ __html: formatted.replace(/^[-•*]\s/, "") }}
        />
      );
    }
    return line.trim() ? (
      <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
    ) : (
      <span key={i} className="block h-2" />
    );
  });
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
            background: "linear-gradient(135deg, #4F8EF7 0%, #7C3AED 100%)",
            boxShadow: "0 4px 20px rgba(79,142,247,0.25)",
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
        style={{ background: "linear-gradient(135deg, #F04747, #FB923C)" }}
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
        }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-2"
          style={{ color: "var(--accent-blue)" }}
        >
          First-Aid Buddy
        </p>
        <div className="space-y-1">{renderContent(content)}</div>
      </div>
    </div>
  );
}
