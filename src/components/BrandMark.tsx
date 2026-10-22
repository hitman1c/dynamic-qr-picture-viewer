interface BrandMarkProps {
  className?: string;
  variant?: 'warm' | 'royal';
}

export default function BrandMark({ className = 'brand-mark', variant = 'warm' }: BrandMarkProps) {
  return (
    <span className={`${className} brand-mark-${variant}`} aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2" />
        <rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2" />
        <rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2" />
        <path d="M14 14h3v3h-3zM20 14h.5M14 20h.5M17.5 20H20v-3.5" />
      </svg>
    </span>
  );
}
