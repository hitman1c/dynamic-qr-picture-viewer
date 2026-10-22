import type { ReactNode } from 'react';

interface IconProps {
  size?: number;
}

function Svg({ size = 18, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function IconPictures({ size }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
    </Svg>
  );
}

export function IconPin({ size }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </Svg>
  );
}

export function IconHelp({ size }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.8.4-1 .9-1 1.8" />
      <path d="M12 17.2h.01" />
    </Svg>
  );
}

export function IconUser({ size }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c1.4-3.2 4-4.8 7-4.8s5.6 1.6 7 4.8" />
    </Svg>
  );
}

export function IconClose({ size }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconDownload({ size }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M12 4v10" />
      <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
      <path d="M5 19h14" />
    </Svg>
  );
}

export function IconCopy({ size }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15" />
    </Svg>
  );
}

export function IconOpen({ size }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M8 16 16 8" />
      <path d="M9.5 8H16v6.5" />
    </Svg>
  );
}

export function IconReplace({ size }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M4 9a8 8 0 0 1 13.6-4.4L20 7" />
      <path d="M20 3.5V7h-3.5" />
      <path d="M20 15a8 8 0 0 1-13.6 4.4L4 17" />
      <path d="M4 20.5V17h3.5" />
    </Svg>
  );
}

export function IconUpload({ size }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M12 15V4" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15" />
    </Svg>
  );
}

export function IconWifi({ size }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M3.5 9.5a13 13 0 0 1 17 0" />
      <path d="M6.8 13a8.4 8.4 0 0 1 10.4 0" />
      <path d="M10 16.4a3.6 3.6 0 0 1 4 0" />
      <path d="M12 20h.01" />
    </Svg>
  );
}

export function IconCheck({ size }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  );
}
