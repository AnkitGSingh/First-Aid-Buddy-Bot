import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookies Policy — First-Aid Buddy",
  description: "How First-Aid Buddy uses cookies and browser storage.",
};

export default function CookiesPage() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Cookies Policy</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Last Updated: February 24, 2026</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">What Are Cookies?</h2>
            <p>Cookies are small text files stored by your browser. This policy also covers similar browser-based storage technologies (sessionStorage, localStorage).</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">What We Store</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <th className="text-left py-2 pr-4 text-white font-semibold">Name</th>
                    <th className="text-left py-2 pr-4 text-white font-semibold">Type</th>
                    <th className="text-left py-2 pr-4 text-white font-semibold">Purpose</th>
                    <th className="text-left py-2 text-white font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="py-2 pr-4 font-mono text-white">fab_consent</td>
                    <td className="py-2 pr-4">sessionStorage</td>
                    <td className="py-2 pr-4">Remembers your consent acknowledgement so you don&apos;t see the disclaimer on every page navigation within a session.</td>
                    <td className="py-2">Browser session (cleared when browser/tab is closed)</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="py-2 pr-4 font-mono text-white">fab_history_*</td>
                    <td className="py-2 pr-4">localStorage</td>
                    <td className="py-2 pr-4">Stores your local chat session history so you can revisit previous conversations. All data stays in your browser only — it is never sent to our servers.</td>
                    <td className="py-2">Persistent until you clear browser data or use &quot;Clear all history&quot;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">What We Do NOT Use</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Advertising or tracking cookies</li>
              <li>Third-party analytics cookies (e.g., Google Analytics)</li>
              <li>Social media tracking pixels</li>
              <li>Cross-site tracking identifiers</li>
            </ul>
            <p className="mt-2">We do not sell your data to third parties or use it for marketing.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">How to Control or Delete Storage</h2>
            <p className="mb-2">You can clear all stored data at any time:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">In-app:</strong> Use the &quot;Clear all history&quot; button inside the chat History tab.</li>
              <li><strong className="text-white">In your browser:</strong> Open DevTools → Application → Storage → Clear site data.</li>
              <li><strong className="text-white">Via browser settings:</strong> Clear browsing data / cookies &amp; site data for this domain.</li>
            </ul>
            <p className="mt-3">Clearing storage will reset your consent flag (you&apos;ll see the disclaimer again) and delete your local chat history.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Changes to This Policy</h2>
            <p>We may update this Cookies Policy. The &quot;Last Updated&quot; date above will be revised. Continued use of the Service constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">Contact</h2>
            <p>Questions about this policy: <strong className="text-white">privacy@first-aid-buddy.app</strong></p>
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
