/**
 * EmergencyBanner – displayed whenever is_emergency is true.
 * Glassmorphism red glow card with pulsing border animation.
 */

interface Props {
  emergencyNumber: string;
}

export default function EmergencyBanner({ emergencyNumber }: Props) {
  return (
    <div
      role="alert"
      className="animate-pulse-emergency rounded-2xl px-5 py-4 flex items-start gap-4"
      style={{
        background: "rgba(240,71,71,0.12)",
        border: "1px solid rgba(240,71,71,0.5)",
      }}
    >
      {/* Siren icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(240,71,71,0.2)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#F04747" strokeWidth={1.8} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-black text-white uppercase tracking-wide">
            ⚠ Emergency Detected
          </span>
        </div>
        <p className="text-base font-bold" style={{ color: "#F87171" }}>
          Call <span className="text-white text-lg">{emergencyNumber}</span> immediately
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(248,113,113,0.75)" }}>
          This may be life-threatening. Follow the steps below while waiting for emergency services.
        </p>
      </div>
    </div>
  );
}
