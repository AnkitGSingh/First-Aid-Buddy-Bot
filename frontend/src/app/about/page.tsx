import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — First-Aid Buddy",
  description: "Learn about First-Aid Buddy — an open-source, AI-powered first-aid guidance tool built on Claude AI and NHS/Red Cross/St John Ambulance guidelines.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      {/* Nav */}
      <nav className="border-b px-6 py-4 max-w-4xl mx-auto flex items-center justify-between" style={{ borderColor: "var(--border-subtle)" }}>
        <Link href="/" className="flex items-center gap-2.5 text-white font-bold">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF37, #B8860B)" }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4"><path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" /></svg>
          </div>
          First-Aid Buddy
        </Link>
        <Link href="/" className="text-sm" style={{ color: "var(--text-muted)" }}>← Back to home</Link>
      </nav>

      {/* Content */}
      <main id="main-content" className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-3">About First-Aid Buddy</h1>
          <p className="text-base max-w-2xl" style={{ color: "var(--text-muted)" }}>
            An open-source AI tool designed to deliver step-by-step, cited first-aid guidance — in seconds, not search results.
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">What It Does</h2>
            <p>First-Aid Buddy takes a natural-language description of a first-aid situation and returns step-by-step guidance grounded in a curated knowledge base built from NHS, Red Cross, and St John Ambulance guidelines. Every response cites its source so you know exactly where the guidance comes from.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">How It Works</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { step: "1", title: "You describe the situation", body: "Type a free-text description of the emergency or first-aid need." },
                { step: "2", title: "Claude AI classifies it", body: "Anthropic's Claude AI classifies intent (emergency vs. general) and retrieves relevant guidance via RAG (Retrieval-Augmented Generation)." },
                { step: "3", title: "Cited guidance is returned", body: "You receive step-by-step instructions with source citations. Emergency situations always escalate with the correct regional emergency number." },
              ].map((item) => (
                <div key={item.step} className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-3 text-xs font-black" style={{ background: "linear-gradient(135deg, #D4AF37, #B8860B)", color: "white" }}>
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Technology Stack</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Frontend:</strong> Next.js (App Router), React, TypeScript, Tailwind CSS</li>
              <li><strong className="text-white">Backend:</strong> FastAPI (Python)</li>
              <li><strong className="text-white">AI Model:</strong> Anthropic Claude (via API)</li>
              <li><strong className="text-white">Architecture:</strong> RAG (Retrieval-Augmented Generation) grounded on first-aid knowledge base</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Guidelines Used</h2>
            <p className="mb-2">The knowledge base is curated from publicly available first-aid guidance published by:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>NHS (National Health Service, UK)</li>
              <li>British Red Cross</li>
              <li>St John Ambulance</li>
            </ul>
            <p className="mt-2 text-xs p-3 rounded-xl" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <strong className="text-white">Not affiliated with or endorsed by</strong> NHS, Red Cross, or St John Ambulance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Limitations You Should Know</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>This tool provides general guidance only — it is <strong className="text-white">not medical advice</strong></li>
              <li>AI models can make errors — always verify critical guidance with a qualified professional</li>
              <li>The knowledge base may not cover every scenario or the latest clinical updates</li>
              <li>In any life-threatening situation, call emergency services first</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Reporting an Issue or Incorrect Guidance</h2>
            <p className="mb-2">If you find incorrect, outdated, or potentially dangerous guidance, please report it immediately:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email: <strong className="text-white">safety@first-aid-buddy.app</strong></li>
              <li>Subject: &quot;Guidance Error Report&quot;</li>
            </ul>
            <p className="mt-2 text-xs p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <strong className="text-red-400">Note:</strong> Contact details are placeholders while the operator&apos;s legal identity is being finalised. This page will be updated when complete.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Open Source</h2>
            <p>First-Aid Buddy is open source and released under the MIT Licence. Contributions, issue reports, and forks are welcome via the project repository.</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t px-6 py-6 max-w-4xl mx-auto flex flex-wrap gap-4 items-center justify-between text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-dim)" }}>
        <span>© {new Date().getFullYear()} First-Aid Buddy. Not medical advice.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-white transition-colors" style={{ color: "var(--text-muted)" }}>Privacy</Link>
          <Link href="/terms" className="hover:text-white transition-colors" style={{ color: "var(--text-muted)" }}>Terms</Link>
          <Link href="/cookies" className="hover:text-white transition-colors" style={{ color: "var(--text-muted)" }}>Cookies</Link>
          <Link href="/about" className="hover:text-white transition-colors" style={{ color: "var(--text-muted)" }}>About</Link>
        </div>
      </footer>
    </div>
  );
}
