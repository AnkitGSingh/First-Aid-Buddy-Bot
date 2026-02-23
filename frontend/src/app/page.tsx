import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6 text-center">
      {/* Hero */}
      <div className="mb-8">
        <div className="mb-4 text-6xl">🩺</div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          First‑Aid Buddy
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-600">
          Instant, AI-powered first-aid guidance backed by NHS, Red Cross, and St
          John Ambulance protocols. Get step-by-step advice with cited sources —
          right when you need it.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/chat"
        className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
      >
        Start First-Aid Chat →
      </Link>

      {/* Feature grid */}
      <div className="mt-14 grid max-w-2xl gap-6 sm:grid-cols-3">
        {[
          {
            icon: "⚡",
            title: "Emergency triage",
            body: "Instantly flags life-threatening situations and surfaces the correct emergency number for your region.",
          },
          {
            icon: "📚",
            title: "Cited sources",
            body: "Every answer references the exact knowledge-base document it came from, so you know it's trustworthy.",
          },
          {
            icon: "🌍",
            title: "Region-aware",
            body: "Adapts emergency numbers and guidance (UK by default, configurable per session).",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-left"
          >
            <div className="mb-2 text-3xl">{f.icon}</div>
            <h3 className="font-semibold text-gray-900">{f.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{f.body}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-12 max-w-md text-xs text-gray-400">
        ⚠ First-Aid Buddy provides general guidance only. In any emergency, call
        999 (UK) or your local emergency number immediately. This is not a
        substitute for professional medical advice.
      </p>
    </main>
  );
}
