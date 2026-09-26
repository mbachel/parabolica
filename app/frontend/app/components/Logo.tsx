export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Parabolica logo"
    >
      {/* Outer ring - speedometer style */}
      <circle
        cx="32"
        cy="32"
        r="30"
        stroke="url(#logoGrad)"
        strokeWidth="3"
        fill="none"
      />
      {/* Speed marks */}
      <path
        d="M32 6 L32 12 M54 20 L49 24 M58 32 L52 32 M54 44 L49 40 M10 20 L15 24 M6 32 L12 32 M10 44 L15 40"
        stroke="url(#logoGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Checkered flag element */}
      <rect x="22" y="22" width="6" height="6" fill="var(--accent)" />
      <rect x="28" y="22" width="6" height="6" fill="var(--foreground)" />
      <rect x="34" y="22" width="6" height="6" fill="var(--accent)" />
      <rect x="22" y="28" width="6" height="6" fill="var(--foreground)" />
      <rect x="28" y="28" width="6" height="6" fill="var(--accent-2)" />
      <rect x="34" y="28" width="6" height="6" fill="var(--foreground)" />
      <rect x="22" y="34" width="6" height="6" fill="var(--accent)" />
      <rect x="28" y="34" width="6" height="6" fill="var(--foreground)" />
      <rect x="34" y="34" width="6" height="6" fill="var(--accent)" />
      {/* Needle/pointer */}
      <path
        d="M32 44 L28 52 L32 50 L36 52 Z"
        fill="var(--accent-3)"
      />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
