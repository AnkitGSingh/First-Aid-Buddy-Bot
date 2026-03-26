import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found — First-Aid Buddy",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "var(--bg-base)" }}>
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(184,134,11,0.15))", border: "1px solid rgba(212,175,55,0.25)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth={1.5} className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>

      <h1 className="text-4xl font-black text-white mb-3">Page Not Found</h1>
      <p className="text-base mb-8 max-w-sm" style={{ color: "var(--text-muted)" }}>
        The page you&apos;re looking for doesn&apos;t exist. It may have moved or the URL may be incorrect.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm"
        >
          ← Back to Home
        </Link>
        <Link
          href="/chat"
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{ border: "1px solid var(--border-mid)", color: "var(--text-muted)" }}
        >
          Open First-Aid Chat
        </Link>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-4 text-xs" style={{ color: "var(--text-dim)" }}>
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
        <Link href="/about" className="hover:text-white transition-colors">About</Link>
      </div>
    </div>
  );
}
