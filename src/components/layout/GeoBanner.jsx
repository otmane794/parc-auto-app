
export default function GeoBanner() {
  return (
    <div className="relative h-14 w-full shrink-0 overflow-hidden bg-slate-900 sm:h-16">
      <svg viewBox="0 0 1600 180" preserveAspectRatio="none" className="h-full w-full">
        <rect width="1600" height="180" fill="#0f172a" />
        <rect x="0" y="0" width="140" height="180" fill="#1e293b" />
        <circle cx="40" cy="40" r="5" fill="#f1f5f9" />
        <circle cx="65" cy="40" r="5" fill="#f1f5f9" />
        <circle cx="90" cy="40" r="5" fill="#f1f5f9" />
        <rect x="180" y="0" width="90" height="180" fill="#f59e0b" opacity="0.9" />
        <path d="M180 0 L270 0 L270 90 Z" fill="#0f172a" opacity="0.15" />
        <rect x="290" y="0" width="150" height="180" fill="#fbcfe8" />
        <path d="M290 180 L365 40 L440 180 Z" fill="#db2777" />
        <rect x="460" y="0" width="140" height="180" fill="#0891b2" />
        <rect x="620" y="0" width="130" height="90" fill="#db2777" />
        <rect x="620" y="90" width="130" height="90" fill="#0f172a" />
        <path d="M770 0 L900 0 L835 90 Z" fill="#f59e0b" />
        <rect x="770" y="90" width="130" height="90" fill="#f59e0b" />
        <rect x="920" y="0" width="120" height="180" fill="#0891b2" />
        <rect x="1060" y="0" width="140" height="180" fill="#fbcfe8" />
        <path d="M1060 180 Q1130 90 1200 180 Z" fill="#db2777" />
        <rect x="1220" y="0" width="130" height="180" fill="#0f172a" />
        <path d="M1220 0 L1350 0 L1220 130 Z" fill="#f8fafc" opacity="0.08" />
        <rect x="1370" y="0" width="120" height="90" fill="#db2777" />
        <rect x="1370" y="90" width="120" height="90" fill="#fbcfe8" />
        <rect x="1510" y="0" width="90" height="180" fill="#0f172a" />
        <circle cx="1555" cy="90" r="26" fill="#0891b2" />
      </svg>
    </div>
  );
}
