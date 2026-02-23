/**
 * ChatMessage – renders a single user or assistant bubble.
 */

interface Props {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm
          ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
          }`}
      >
        {!isUser && (
          <span className="mr-1 text-xs font-semibold text-blue-600 uppercase tracking-wide">
            First-Aid Buddy
          </span>
        )}
        <p className={!isUser ? "mt-0.5" : ""}>{content}</p>
      </div>
    </div>
  );
}
