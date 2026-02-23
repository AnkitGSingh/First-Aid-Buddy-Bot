/**
 * EmergencyBanner – displayed whenever is_emergency is true.
 * Pulses red to draw immediate attention.
 */

interface Props {
  emergencyNumber: string;
}

export default function EmergencyBanner({ emergencyNumber }: Props) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl bg-red-600 px-5 py-4 text-white shadow-lg animate-pulse"
    >
      <span className="text-3xl">🚨</span>
      <div>
        <p className="text-lg font-bold leading-tight">
          Emergency — Call {emergencyNumber} Now
        </p>
        <p className="text-sm opacity-90">
          This situation may be life-threatening. Follow the steps below while
          waiting for emergency services.
        </p>
      </div>
    </div>
  );
}
