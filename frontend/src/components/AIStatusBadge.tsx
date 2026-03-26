/**
 * AIStatusBadge – polls /health on mount and shows a live Online/Offline indicator.
 *
 * Used on the landing page (server component wrapping it is fine because this
 * component is itself "use client").
 */
"use client";

import { useEffect, useState } from "react";
import { getHealth } from "@/lib/api";

type Status = "loading" | "online" | "offline";

export default function AIStatusBadge() {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    getHealth()
      .then((h) => {
        if (!cancelled)
          setStatus(h.status === "ok" && h.api_key_configured ? "online" : "offline");
      })
      .catch(() => {
        if (!cancelled) setStatus("offline");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") return null;

  const online = status === "online";
  return (
    <span
      className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full"
      style={{
        background: online ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
        border: `1px solid ${online ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
        color: online ? "#22c55e" : "#ef4444",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{
          background: online ? "#22c55e" : "#ef4444",
          boxShadow: online ? "0 0 6px #22c55e" : "0 0 6px #ef4444",
        }}
      />
      {online ? "AI Online" : "AI Offline"}
    </span>
  );
}
