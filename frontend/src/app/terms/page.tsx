import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — First-Aid Buddy",
  description: "Terms of service for using First-Aid Buddy AI first-aid guidance tool.",
};

export default function TermsPage() {
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
          <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Last Updated: December 7, 2025</p>
        </div>

        {/* Critical warning */}
        <div className="mb-8 p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <p className="text-sm font-bold text-red-400 mb-1">⚠ IMPORTANT MEDICAL DISCLAIMER — READ CAREFULLY</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            This Service is <strong className="text-white">NOT a substitute for professional medical advice</strong>, diagnosis, or treatment.
            In any life-threatening emergency, call <strong className="text-white">999</strong> (UK), <strong className="text-white">911</strong> (US), or <strong className="text-white">112</strong> (EU) immediately.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using First-Aid Buddy, you agree to be bound by these Terms of Service. If you do not agree, <strong className="text-white">DO NOT USE THIS SERVICE.</strong></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. NOT Medical Advice</h2>
            <div className="space-y-2 pl-4 border-l" style={{ borderColor: "var(--border-subtle)" }}>
              <p>The Service provides general educational and informational first-aid guidance only. It is <strong className="text-white">NOT</strong>:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>A replacement for professional medical advice or diagnosis</li>
                <li>Approved or validated by medical professionals or regulatory bodies</li>
                <li>Suitable for all individuals or situations</li>
                <li>A comprehensive guide to first aid or emergency response</li>
              </ul>
              <p className="pt-2"><strong className="text-white">In any emergency: call emergency services immediately.</strong> Do not rely solely on this Service. Follow instructions from emergency dispatchers and medical professionals.</p>
              <p>Use of this Service does <strong className="text-white">NOT</strong> create a doctor-patient relationship. No healthcare professional is involved in providing information through this Service.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. User Responsibilities</h2>
            <p className="mb-2">You agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Service responsibly and for lawful purposes only</li>
              <li>Verify information with qualified medical professionals</li>
              <li>Call emergency services for any emergency situation</li>
              <li>Accept full responsibility for actions taken based on information from this Service</li>
            </ul>
            <p className="mt-3">You agree NOT to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Service for medical diagnosis or treatment decisions</li>
              <li>Delay seeking professional medical care based on Service information</li>
              <li>Attempt to reverse engineer, hack, or compromise the Service</li>
              <li>Abuse the Service through excessive use, spam, or malicious input</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Limitation of Liability</h2>
            <p className="mb-2">TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE PROVIDERS SHALL NOT BE LIABLE FOR:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Any injury, illness, death, or damages arising from use of the Service</li>
              <li>Reliance on information provided by the Service</li>
              <li>Errors, omissions, or inaccuracies in the information</li>
              <li>Delays in seeking professional medical care</li>
            </ul>
            <p className="mt-2"><strong className="text-white">YOU USE THIS SERVICE ENTIRELY AT YOUR OWN RISK.</strong></p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. No Warranty</h2>
            <p>The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without any warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or accuracy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Third-Party Services</h2>
            <p>This Service uses Anthropic&apos;s Claude AI model. Your use is also subject to <a href="https://www.anthropic.com/legal/aup" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent-blue)" }}>Anthropic&apos;s Acceptable Use Policy (opens in new tab)</a> and <a href="https://www.anthropic.com/legal/terms" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent-blue)" }}>Anthropic&apos;s Terms of Service (opens in new tab)</a>. We are not responsible for the AI model&apos;s outputs.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Privacy</h2>
            <p>See our <Link href="/privacy" className="underline" style={{ color: "var(--accent-blue)" }}>Privacy Policy</Link> for details on data collection and use.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Geographic Limitations</h2>
            <p>The Service provides information for UK, US, and EU regions. Emergency numbers and first-aid guidance may vary by country. Always verify information is appropriate for your location.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Intellectual Property</h2>
            <p>The Service is released under the MIT Licence. See the <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent-blue)" }}>project repository (opens in new tab)</a> for details.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Governing Law</h2>
            <p>These Terms shall be governed by the laws of England and Wales, without regard to conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">11. Changes to Terms</h2>
            <p>We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">12. Contact</h2>
            <p>For questions about these Terms: <strong className="text-white">legal@first-aid-buddy.app</strong></p>
            <p className="mt-2 text-xs p-3 rounded-xl" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <strong className="text-white">Note:</strong> Contact details are placeholders while the operator&apos;s legal identity is being finalised.
            </p>
          </section>

          <section className="p-4 rounded-xl" style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.18)" }}>
            <h2 className="text-base font-bold text-white mb-3">Acknowledgment</h2>
            <p className="mb-2">By using this Service, you acknowledge that:</p>
            <ul className="space-y-1.5">
              {[
                "You have read and understood these Terms",
                "You agree to be bound by these Terms",
                "You understand this is NOT professional medical advice",
                "You will call emergency services for any emergency",
                "You use this Service entirely at your own risk",
                "You will not rely on this Service for medical decisions",
                "You accept full responsibility for your actions",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
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
