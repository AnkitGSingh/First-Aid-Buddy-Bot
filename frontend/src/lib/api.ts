/**
 * First-Aid Buddy API client.
 * Talks to the FastAPI backend running on NEXT_PUBLIC_API_URL.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Citation {
  title: string;
  snippet: string;
}

export interface ChatRequest {
  message: string;
  session_id?: string;
  region?: string;
}

export interface ChatResponse {
  answer: string;
  is_emergency: boolean;
  emergency_number: string;
  citations: Citation[];
  session_id?: string;
  processing_ms?: number;
}

export interface HealthResponse {
  status: string;
  environment: string;
  region: string;
  api_key_configured: boolean;
  model: string;
}

/** Send a chat message and return the AI response. */
export async function sendChat(payload: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Chat request failed");
  }
  return res.json();
}

/** Check the backend health. */
export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}
