import type { OwnedPicture, Picture, PictureRef, PictureSource } from '../types/picture';
import { createFreeWifiPosterDataUrl } from './imageService';

const dataApiUrl = (import.meta.env.VITE_NEON_DATA_API_URL as string | undefined)?.replace(
  /\/+$/,
  '',
);
const authUrl = (import.meta.env.VITE_NEON_AUTH_URL as string | undefined)?.replace(/\/+$/, '');

export const isRemoteConfigured = Boolean(dataApiUrl && authUrl);

const REF_STORAGE_KEY = 'dqr:picture-ref';
const LOCAL_PICTURES_KEY = 'dqr:pictures';

interface CreateRow {
  id: string;
  edit_token: string;
  image_url: string;
  source: PictureSource;
  created_at: string;
  updated_at: string;
}

interface PictureRow {
  id: string;
  image_url: string;
  source: PictureSource;
  created_at: string;
  updated_at: string;
}

interface UpdateRow {
  id: string;
  image_url: string;
  source: PictureSource;
  updated_at: string;
}

let tokenCache: { token: string; expiresAtMs: number } | null = null;

async function getAnonymousToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAtMs - Date.now() > 60_000) {
    return tokenCache.token;
  }
  const response = await fetch(`${authUrl}/token/anonymous`);
  if (!response.ok) {
    throw new Error(
      'Could not reach the picture service (sign-in step failed). Check your connection and try again.',
    );
  }
  const data = (await response.json()) as { token: string; expires_at: number };
  tokenCache = { token: data.token, expiresAtMs: data.expires_at * 1000 };
  return data.token;
}

async function callRpc<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  const send = async () => {
    const token = await getAnonymousToken();
    return fetch(`${dataApiUrl}/rpc/${fn}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  };

  let response = await send();
  if (response.status === 401) {
    tokenCache = null;
    response = await send();
  }
  if (!response.ok) {
    throw new Error(`Picture service error (HTTP ${response.status}). Please try again.`);
  }
  return (await response.json()) as T;
}

function newUuid(): string {
  return crypto.randomUUID();
}

function readPictureRef(): PictureRef | null {
  const raw = window.localStorage.getItem(REF_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PictureRef;
    if (typeof parsed.id === 'string' && typeof parsed.editToken === 'string') {
      return parsed;
    }
  } catch {
    // Ignore corrupted storage.
  }
  return null;
}

function writePictureRef(ref: PictureRef): void {
  window.localStorage.setItem(REF_STORAGE_KEY, JSON.stringify(ref));
}

function readLocalPictures(): Record<string, OwnedPicture> {
  const raw = window.localStorage.getItem(LOCAL_PICTURES_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, OwnedPicture>;
  } catch {
    return {};
  }
}

function writeLocalPictures(pictures: Record<string, OwnedPicture>): void {
  window.localStorage.setItem(LOCAL_PICTURES_KEY, JSON.stringify(pictures));
}

function toPicture(row: PictureRow): Picture {
  return {
    id: row.id,
    imageUrl: row.image_url,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function remoteCreate(imageUrl: string, source: PictureSource): Promise<OwnedPicture> {
  const editToken = newUuid();
  const rows = await callRpc<CreateRow[]>('create_picture', {
    p_image_url: imageUrl,
    p_source: source,
    p_edit_token: editToken,
  });
  const row = rows[0];
  if (!row) {
    throw new Error('The picture service did not return a picture. Please try again.');
  }
  return {
    id: row.id,
    imageUrl: row.image_url,
    source: row.source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    editToken: row.edit_token,
  };
}

async function remoteGet(id: string): Promise<Picture | null> {
  const rows = await callRpc<PictureRow[]>('get_picture', { p_id: id });
  const row = rows[0];
  return row ? toPicture(row) : null;
}

async function remoteUpdate(
  id: string,
  editToken: string,
  imageUrl: string,
  source: PictureSource,
): Promise<OwnedPicture | null> {
  const rows = await callRpc<UpdateRow[]>('update_picture', {
    p_id: id,
    p_edit_token: editToken,
    p_image_url: imageUrl,
    p_source: source,
  });
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    imageUrl: row.image_url,
    source: row.source,
    createdAt: '',
    updatedAt: row.updated_at,
    editToken,
  };
}

export function getPictureRef(): PictureRef | null {
  return readPictureRef();
}

export async function createPicture(
  imageUrl: string,
  source: PictureSource,
): Promise<OwnedPicture> {
  if (isRemoteConfigured) {
    const picture = await remoteCreate(imageUrl, source);
    writePictureRef({ id: picture.id, editToken: picture.editToken });
    return picture;
  }

  const now = new Date().toISOString();
  const picture: OwnedPicture = {
    id: newUuid(),
    imageUrl,
    source,
    createdAt: now,
    updatedAt: now,
    editToken: newUuid(),
  };
  const pictures = readLocalPictures();
  pictures[picture.id] = picture;
  writeLocalPictures(pictures);
  writePictureRef({ id: picture.id, editToken: picture.editToken });
  return picture;
}

export async function getPicture(id: string): Promise<Picture | null> {
  if (isRemoteConfigured) {
    return remoteGet(id);
  }
  const picture = readLocalPictures()[id];
  if (!picture) return null;
  return {
    id: picture.id,
    imageUrl: picture.imageUrl,
    source: picture.source,
    createdAt: picture.createdAt,
    updatedAt: picture.updatedAt,
  };
}

export async function updatePicture(
  id: string,
  editToken: string,
  imageUrl: string,
  source: PictureSource,
): Promise<OwnedPicture | null> {
  if (isRemoteConfigured) {
    return remoteUpdate(id, editToken, imageUrl, source);
  }

  const pictures = readLocalPictures();
  const existing = pictures[id];
  if (!existing || existing.editToken !== editToken) {
    return null;
  }
  const updated: OwnedPicture = {
    ...existing,
    imageUrl,
    source,
    updatedAt: new Date().toISOString(),
  };
  pictures[id] = updated;
  writeLocalPictures(pictures);
  return updated;
}

let currentPicturePromise: Promise<OwnedPicture> | null = null;

/**
 * Returns the current picture for this browser, creating the default
 * FREE WIFI poster on first run. The promise is memoized so React
 * StrictMode's double mount only creates one picture.
 */
export function ensureCurrentPicture(): Promise<OwnedPicture> {
  if (!currentPicturePromise) {
    currentPicturePromise = (async () => {
      const existingRef = readPictureRef();
      if (existingRef) {
        const existing = await getPicture(existingRef.id);
        if (existing) {
          return { ...existing, editToken: existingRef.editToken };
        }
      }
      return createPicture(createFreeWifiPosterDataUrl(), 'default');
    })().catch((error: unknown) => {
      currentPicturePromise = null;
      throw error;
    });
  }
  return currentPicturePromise;
}

export function resetCurrentPictureCache(): void {
  currentPicturePromise = null;
}
