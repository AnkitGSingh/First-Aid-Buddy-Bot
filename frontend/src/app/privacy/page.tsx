import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — First-Aid Buddy",
  description: "How First-Aid Buddy collects, uses, and protects your information.",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-black text-white mb-2">Privacy Policy</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Last Updated: February 23, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

          <section>
            <p>This Privacy Policy explains how First-Aid Buddy (&quot;we&quot;, &quot;our&quot;, &quot;the Service&quot;) collects, uses, and protects information when you use our Service. <strong className="text-white">By using this Service, you consent to this Privacy Policy.</strong></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Information We Collect</h2>
            <div className="space-y-4 pl-4 border-l" style={{ borderColor: "var(--border-subtle)" }}>
              <div>
                <h3 className="font-semibold text-white">1.1 User Queries</h3>
                <p>The text of your first-aid questions is processed in real-time to provide guidance and is not stored permanently.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">1.2 API Usage Data</h3>
                <p>Your queries are sent to Anthropic&apos;s Claude API to generate responses. See <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent-blue)" }}>Anthropic&apos;s Privacy Policy (opens in new tab)</a>.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">1.3 Technical Information</h3>
                <p>Browser type, hashed IP (for rate limiting), and session identifiers are used to operate the Service. Session data is cleared when you close your browser.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Special Category (Health) Data</h2>
            <p>Because you may share health-related information in your queries, this data is treated as &quot;special category&quot; data under UK GDPR. We process it only as strictly necessary to provide the Service, for as short a time as possible, and we do not use it for any secondary purpose (including profiling or advertising). <strong className="text-white">Do not include names, addresses, or medical record numbers in your queries.</strong></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process your first-aid queries and generate AI responses</li>
              <li>Classify queries (emergency vs. general) to provide the right guidance</li>
              <li>Detect and prevent abuse; enforce rate limits</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Cookies &amp; Browser Storage</h2>
            <p>We use <code className="text-xs px-1 py-0.5 rounded" style={{ background: "var(--bg-card)" }}>sessionStorage</code> to remember your consent flag within a single browser session. No advertising or tracking cookies are set. See our <Link href="/cookies" className="underline" style={{ color: "var(--accent-blue)" }}>Cookies Policy</Link> for full details.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Queries:</strong> Not stored permanently — processed in real-time only.</li>
              <li><strong className="text-white">Session data:</strong> Cleared when your browser session ends.</li>
              <li><strong className="text-white">Technical logs:</strong> Retained up to 30 days for security/debugging; do not contain full query text.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Your Rights (UK/EU GDPR)</h2>
            <p className="mb-2">You have the right to: access your personal data, correct inaccurate data, request deletion, object to processing, data portability, and withdraw consent. Since we do not store queries long-term, there may be limited data to access or delete.</p>
            <p>To exercise your rights, contact: <strong className="text-white">privacy@first-aid-buddy.app</strong> (subject: &quot;Data Request&quot;). We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Third-Party Services</h2>
            <p>This Service uses Anthropic&apos;s Claude AI model. Your queries are sent to Anthropic and processed under their privacy policy. We are not responsible for Anthropic&apos;s data handling. Review <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent-blue)" }}>Anthropic&apos;s Privacy Policy (opens in new tab)</a> before use.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Children&apos;s Privacy</h2>
            <p>This Service is not intended for children under 13 (or 16 in the EU). If you are under 18, please use this Service with parental supervision. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Security</h2>
            <p>API keys are stored in server-side environment variables and are never transmitted to your browser. HTTPS encryption is used for all data in transit. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. The &quot;Last Updated&quot; date at the top will be revised. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">11. Contact</h2>
            <p>For privacy questions or data requests:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Email: <strong className="text-white">privacy@first-aid-buddy.app</strong></li>
              <li>Subject: &quot;Privacy Policy Inquiry&quot;</li>
              <li>Response time: within 30 days</li>
            </ul>
            <p className="mt-2 text-xs p-3 rounded-xl" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <strong className="text-white">Note:</strong> Contact details are placeholders while the operator&apos;s legal identity is being finalised. This notice will be updated when complete.
            </p>
          </section>

          <div className="pt-6 border-t text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-dim)" }}>
            <p>⚠ <strong className="text-white">Medical Emergency?</strong> Call <strong className="text-white">999</strong> (UK), <strong className="text-white">911</strong> (US), or <strong className="text-white">112</strong> (EU) immediately — not this Service.</p>
          </div>
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
