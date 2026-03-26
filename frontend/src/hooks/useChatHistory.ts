/**
 * useChatHistory – persists and retrieves chat sessions from localStorage.
 *
 * Storage key: "fab_history"
 * Shape:       ChatSession[]  (sorted newest-first on read)
 *
 * Each session stores:
 *   id          – matches the sessionId used for the API call
 *   title       – first user message (truncated to 60 chars)
 *   region      – region code used in this session
 *   startedAt   – ISO timestamp of the first message
 *   updatedAt   – ISO timestamp of the last message
 *   hadEmergency – true if any message was flagged is_emergency
 *   messages    – full message array
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Citation } from "@/lib/api";

export interface HistoryMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  is_emergency?: boolean;
  emergency_number?: string;
  citations?: Citation[];
}

export interface ChatSession {
  id: string;
  title: string;
  region: string;
  startedAt: string;
  updatedAt: string;
  hadEmergency: boolean;
  messages: HistoryMessage[];
}

const STORAGE_KEY = "fab_history";
const MAX_SESSIONS = 50; // cap to keep localStorage tidy

// ─── helpers ────────────────────────────────────────────────────────────────

function readStorage(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    // Basic schema guard — drop any entry without a valid messages array
    return parsed.filter(
      (s: unknown) =>
        s !== null &&
        typeof s === "object" &&
        typeof (s as Record<string, unknown>).id === "string" &&
        Array.isArray((s as Record<string, unknown>).messages),
    ) as ChatSession[];
  } catch {
    return [];
  }
}

function writeStorage(sessions: ChatSession[]): void {
  try {
    if (sessions.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  } catch {
    // QuotaExceededError or private-browsing — fail silently
    // UI callers should not depend on this to confirm persistence
  }
}

// ─── hook ───────────────────────────────────────────────────────────────────

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  // isLoaded gates localStorage writes so they never fire during SSR/hydration
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    setSessions(
      readStorage()
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, MAX_SESSIONS),
    );
    setIsLoaded(true);
  }, []);

  // Persist to localStorage whenever sessions change — keeps all writes
  // outside React updater functions so there are no side-effect-in-render bugs
  // and the clearHistory/saveSession ordering is always serialised.
  useEffect(() => {
    if (isLoaded) {
      writeStorage(sessions);
    }
  }, [sessions, isLoaded]);

  /**
   * Upsert a session — create it if new, update messages + metadata if existing.
   * Call this after every assistant reply.
   */
  const saveSession = useCallback(
    (
      sessionId: string,
      messages: HistoryMessage[],
      region: string,
    ) => {
      if (messages.length === 0) return;

      setSessions((prev) => {
        const now = new Date().toISOString();
        const firstUserMsg = messages.find((m) => m.role === "user");
        const title = firstUserMsg
          ? firstUserMsg.content.slice(0, 60) + (firstUserMsg.content.length > 60 ? "\u2026" : "")
          : "Chat session";

        const hadEmergency = messages.some((m) => m.is_emergency);

        const existing = prev.find((s) => s.id === sessionId);
        let updated: ChatSession[];

        if (existing) {
          updated = prev.map((s) =>
            s.id === sessionId
              ? { ...s, messages, title, region, updatedAt: now, hadEmergency }
              : s,
          );
        } else {
          const newSession: ChatSession = {
            id: sessionId,
            title,
            region,
            startedAt: now,
            updatedAt: now,
            hadEmergency,
            messages,
          };
          updated = [newSession, ...prev];
        }

        // Apply cap to both in-memory state and (via the effect) on-disk storage
        return updated
          .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
          .slice(0, MAX_SESSIONS);
      });
    },
    [],
  );

  /** Delete a single session by id. */
  const deleteSession = useCallback((sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  /** Wipe all saved sessions. */
  const clearHistory = useCallback(() => {
    // setSessions([]) triggers the write-effect which calls writeStorage([]),
    // which removes the key. No direct localStorage call needed — this eliminates
    // the race condition where an in-flight saveSession updater could re-write
    // after a direct localStorage.removeItem().
    setSessions([]);
  }, []);

  return { sessions, isLoaded, saveSession, deleteSession, clearHistory };
}
