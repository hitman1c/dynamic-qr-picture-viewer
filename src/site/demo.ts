export const DEMO_PICTURE_ID = 'demo';
export const DEMO_PICTURE_PATH = `/view/${DEMO_PICTURE_ID}`;

const FALLBACK_PUBLIC_ORIGIN = 'https://dynamic-qr-picture-viewer.netlify.app';

function isLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '0.0.0.0';
}

/**
 * Public address for the always-available FREE WIFI demonstration picture.
 * Builds the address from VITE_APP_BASE_URL when provided, skips localhost so
 * printed codes never point at a development machine, and otherwise uses the
 * deployed origin or the known public fallback.
 */
export function demoViewUrl(): string {
  const configured = (import.meta.env.VITE_APP_BASE_URL as string | undefined)?.trim();
  if (configured) {
    try {
      const parsed = new URL(configured);
      if (!isLocalHost(parsed.hostname)) {
        return `${parsed.origin}${DEMO_PICTURE_PATH}`;
      }
    } catch {
      // Fall through to the browser origin below.
    }
  }

  if (typeof window !== 'undefined' && !isLocalHost(window.location.hostname)) {
    return `${window.location.origin}${DEMO_PICTURE_PATH}`;
  }

  return `${FALLBACK_PUBLIC_ORIGIN}${DEMO_PICTURE_PATH}`;
}
