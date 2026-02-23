import Link from "next/link";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    color: "text-red-400",
    glow: "rgba(240,71,71,0.15)",
    title: "Emergency Triage",
    body: "Instantly detects life-threatening situations and escalates with the correct emergency number for your region — UK, US, or EU.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
    color: "text-blue-400",
    glow: "rgba(79,142,247,0.15)",
    title: "AI-Powered Advice",
    body: "Claude AI classifies intent and generates step-by-step guidance tailored to the specific situation — not generic Q&A.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    color: "text-violet-400",
    glow: "rgba(139,92,246,0.15)",
    title: "Cited Sources",
    body: "Every response references the exact NHS / Red Cross knowledge-base document it came from. No hallucinations.",
  },
];

const STATS = [
  { value: "15", label: "first-aid topics" },
  { value: "999", label: "UK emergency ready" },
  { value: "AI", label: "Claude-powered" },
  { value: "0s", label: "ads, zero tracking" },
];

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--bg-base)" }}
    >
      {/* ── Ambient background blobs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-20 animate-float"
        style={{ background: "radial-gradient(circle, rgba(79,142,247,0.6) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-15 animate-float-slow"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(240,71,71,0.5) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      {/* Grid line overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Nav bar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: "linear-gradient(135deg, #F04747, #FB923C)" }}>
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" />
            </svg>
          </div>
          <span className="font-bold text-white text-lg tracking-tight">First-Aid Buddy</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ boxShadow: "0 0 6px #22c55e" }} />
            AI Online
          </span>
          <Link
            href="/chat"
            className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Open Chat →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 text-center px-6 pt-16 pb-20 max-w-4xl mx-auto animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
          style={{ background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)", color: "var(--accent-blue)" }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          NHS · Red Cross · St John Ambulance backed
        </div>

        <h1 className="text-5xl sm:text-7xl font-black leading-[1.05] tracking-tight mb-6 text-white">
          First aid,{" "}
          <span className="text-gradient">when it matters</span>
          <br />most.
        </h1>

        <p className="text-lg sm:text-xl text-[color:var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
          AI that triages emergencies, delivers step-by-step first-aid instructions, and cites every source — in seconds, not search results.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/chat"
            className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold shadow-2xl"
            style={{ boxShadow: "0 12px 40px rgba(79,142,247,0.4)" }}
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M10 3H14V10H21V14H14V21H10V14H3V10H10V3Z" />
            </svg>
            Start Emergency Chat
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: "1px solid var(--border-mid)", color: "var(--text-muted)" }}
          >
            API Docs ↗
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-px max-w-xl mx-auto"
          style={{ background: "var(--border-subtle)", borderRadius: "16px", overflow: "hidden" }}>
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-4 px-3"
              style={{ background: "var(--bg-surface)" }}>
              <span className="text-xl font-black text-white">{s.value}</span>
              <span className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature cards ── */}
      <section className="relative z-10 px-6 pb-16 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 group hover:scale-[1.02] transition-transform duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s`, boxShadow: `0 8px 32px ${f.glow}` }}
            >
              <div className={`mb-4 ${f.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <footer className="relative z-10 text-center px-6 py-8 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <p className="text-xs max-w-lg mx-auto" style={{ color: "var(--text-dim)" }}>
          ⚠ First-Aid Buddy provides general guidance only and is not a substitute for professional medical advice.
          In any emergency, call <strong className="text-white">999</strong> (UK) or your local emergency number immediately.
        </p>
      </footer>
    </main>
  );
}
