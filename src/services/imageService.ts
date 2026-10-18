import type { PictureSource } from '../types/picture';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const MAX_FILE_BYTES = 15 * 1024 * 1024;
export const MAX_STORED_DATA_URL_CHARS = 7_500_000;
export const MAX_REMOTE_URL_LENGTH = 4000;

const MAX_IMAGE_SIDE = 1400;
const JPEG_QUALITY = 0.85;
const LOAD_TIMEOUT_MS = 15_000;

export function isAcceptedImageType(type: string): boolean {
  return ACCEPTED_TYPES.includes(type);
}

export function acceptedTypeLabel(): string {
  return 'JPEG, PNG, WebP or GIF';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = window.setTimeout(() => {
      img.src = '';
      reject(new Error('The image took too long to load. Please try again.'));
    }, LOAD_TIMEOUT_MS);
    img.onload = () => {
      window.clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      reject(
        new Error(
          'That address does not point to a loadable image. Use a direct link to an image file (it should end in .jpg, .png, .webp or similar).',
        ),
      );
    };
    img.src = src;
  });
}

export async function fileToOptimizedDataUrl(file: File): Promise<string> {
  if (!isAcceptedImageType(file.type)) {
    throw new Error(`Unsupported file type. Please choose a ${acceptedTypeLabel()} image.`);
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('That file is larger than 15 MB. Please choose a smaller image.');
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const scale = Math.min(
      1,
      MAX_IMAGE_SIDE / Math.max(img.naturalWidth, img.naturalHeight),
    );
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas is not supported in this browser.');
    }
    ctx.drawImage(img, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    if (dataUrl.length > MAX_STORED_DATA_URL_CHARS) {
      throw new Error(
        'The optimized image is still too large to publish. Please choose a smaller image or a compressed photo.',
      );
    }
    return dataUrl;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function validateImageUrl(rawUrl: string): Promise<string> {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    throw new Error('Enter an image URL first.');
  }
  if (trimmed.length > MAX_REMOTE_URL_LENGTH) {
    throw new Error('That URL is too long.');
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Enter a valid URL, including https://');
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error('Image URLs must start with http:// or https://.');
  }

  await loadImage(trimmed);
  return trimmed;
}

function buildFreeWifiPosterSvg(): string {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img" aria-label="Free WiFi poster">',
    '  <defs>',
    '    <radialGradient id="bg" cx="50%" cy="36%" r="70%">',
    '      <stop offset="0%" stop-color="#16345e"/>',
    '      <stop offset="100%" stop-color="#081527"/>',
    '    </radialGradient>',
    '  </defs>',
    '  <rect width="1080" height="1080" fill="url(#bg)"/>',
    '  <g fill="none" stroke-linecap="round">',
    '    <path d="M356 471 A 260 260 0 0 1 724 471" stroke="#38bdf8" stroke-width="46"/>',
    '    <path d="M420 535 A 170 170 0 0 1 660 535" stroke="#7dd3fc" stroke-width="40"/>',
    '    <path d="M480 595 A 85 85 0 0 1 600 595" stroke="#e0f2fe" stroke-width="34"/>',
    '  </g>',
    '  <circle cx="540" cy="655" r="26" fill="#f8fafc"/>',
    '  <text x="540" y="820" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="118" font-weight="700" fill="#f8fafc" letter-spacing="4">FREE WIFI</text>',
    '  <text x="540" y="890" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="44" fill="#94a3b8">Scan this code to connect</text>',
    '  <rect x="250" y="930" width="580" height="110" rx="20" fill="#ffffff" fill-opacity="0.08" stroke="#38bdf8" stroke-opacity="0.45" stroke-width="2"/>',
    '  <text x="540" y="978" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#e2e8f0">Network: Guest WiFi</text>',
    '  <text x="540" y="1022" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#e2e8f0">Password: freewifi</text>',
    '</svg>',
  ].join('\n');
}

export function createFreeWifiPosterDataUrl(): string {
  const svg = buildFreeWifiPosterSvg();
  const encoded = btoa(svg);
  return `data:image/svg+xml;base64,${encoded}`;
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export type { PictureSource };
