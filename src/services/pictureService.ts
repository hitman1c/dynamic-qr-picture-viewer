import type {
  LibraryPicture,
  OwnedPicture,
  OwnedPictureRef,
  Picture,
  PictureSource,
} from '../types/picture';
import { createFreeWifiPosterDataUrl } from './imageService';
import { DEMO_PICTURE_ID } from '../site/demo';

const dataApiUrl = (import.meta.env.VITE_NEON_DATA_API_URL as string | undefined)?.replace(
  /\/+$/,
  '',
);
const authUrl = (import.meta.env.VITE_NEON_AUTH_URL as string | undefined)?.replace(/\/+$/, '');

export const isRemoteConfigured = Boolean(dataApiUrl && authUrl);

const LIBRARY_KEY = 'dqr:picture-library';
const SELECTED_KEY = 'dqr:picture-selected';
const LEGACY_REF_KEY = 'dqr:picture-ref';
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

export interface PictureLibrary {
  pictures: LibraryPicture[];
  selectedId: string | null;
  failedCount: number;
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

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * A picture id is always a UUID. Anything else can never match a stored
 * picture, so treat it as "not found" instead of sending it to the database
 * (which would answer with a raw HTTP 400).
 */
export function isPictureId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function newUuid(): string {
  return crypto.randomUUID();
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

function isOwnedRef(value: unknown): value is OwnedPictureRef {
  if (!value || typeof value !== 'object') return false;
  const ref = value as Partial<OwnedPictureRef>;
  return (
    typeof ref.id === 'string' &&
    typeof ref.editToken === 'string' &&
    typeof ref.label === 'string' &&
    typeof ref.createdAt === 'string'
  );
}

function writeLibraryRefs(refs: OwnedPictureRef[]): void {
  window.localStorage.setItem(LIBRARY_KEY, JSON.stringify(refs));
}

function readSelectedId(): string | null {
  return window.localStorage.getItem(SELECTED_KEY);
}

function writeSelectedId(id: string | null): void {
  if (id) {
    window.localStorage.setItem(SELECTED_KEY, id);
  } else {
    window.localStorage.removeItem(SELECTED_KEY);
  }
}

function migrateLegacyRef(): OwnedPictureRef[] {
  const legacyRaw = window.localStorage.getItem(LEGACY_REF_KEY);
  if (!legacyRaw) return [];
  try {
    const legacy = JSON.parse(legacyRaw) as { id?: string; editToken?: string };
    if (typeof legacy.id !== 'string' || typeof legacy.editToken !== 'string') return [];
    const refs: OwnedPictureRef[] = [
      {
        id: legacy.id,
        editToken: legacy.editToken,
        label: 'Existing picture',
        createdAt: new Date().toISOString(),
      },
    ];
    writeLibraryRefs(refs);
    writeSelectedId(legacy.id);
    window.localStorage.removeItem(LEGACY_REF_KEY);
    return refs;
  } catch {
    return [];
  }
}

function readLibraryRefs(): OwnedPictureRef[] {
  const raw = window.localStorage.getItem(LIBRARY_KEY);
  if (raw !== null) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        const refs = parsed.filter(isOwnedRef);
        if (refs.length > 0) return refs;
      }
    } catch {
      // Fall through to the legacy migration below.
    }
  }
  return migrateLegacyRef();
}

function addLibraryRef(ref: OwnedPictureRef): void {
  const refs = readLibraryRefs().filter((existing) => existing.id !== ref.id);
  refs.unshift(ref);
  writeLibraryRefs(refs);
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
  if (!isPictureId(id)) return null;
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

export function getOwnedPictureRef(id: string): OwnedPictureRef | null {
  return readLibraryRefs().find((ref) => ref.id === id) ?? null;
}

/**
 * Creates a brand new picture with its own id (and therefore its own QR
 * code) and remembers it in this browser's library.
 */
export async function createPicture(
  imageUrl: string,
  source: PictureSource,
  label: string,
): Promise<LibraryPicture> {
  if (isRemoteConfigured) {
    const picture = await remoteCreate(imageUrl, source);
    addLibraryRef({
      id: picture.id,
      editToken: picture.editToken,
      label,
      createdAt: picture.createdAt,
    });
    writeSelectedId(picture.id);
    return { ...picture, label };
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
  addLibraryRef({ id: picture.id, editToken: picture.editToken, label, createdAt: now });
  writeSelectedId(picture.id);
  return { ...picture, label };
}

export async function getPicture(id: string): Promise<Picture | null> {
  if (id === DEMO_PICTURE_ID) {
    const now = new Date().toISOString();
    return {
      id: DEMO_PICTURE_ID,
      imageUrl: createFreeWifiPosterDataUrl(),
      source: 'default',
      createdAt: now,
      updatedAt: now,
    };
  }

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

/**
 * Replaces the image of an existing picture. The picture id does not change,
 * so a QR code that was already printed keeps working.
 */
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

/**
 * Forgets a picture in this browser only. The published picture and its QR
 * code keep working for everyone who already has them; this browser just
 * stops listing (and being able to edit) it.
 */
export function forgetPicture(id: string): void {
  const refs = readLibraryRefs().filter((ref) => ref.id !== id);
  writeLibraryRefs(refs);
  if (readSelectedId() === id) {
    writeSelectedId(refs[0]?.id ?? null);
  }
  const pictures = readLocalPictures();
  if (pictures[id]) {
    delete pictures[id];
    writeLocalPictures(pictures);
  }
}

async function loadLibrary(): Promise<PictureLibrary> {
  const refs = readLibraryRefs();

  if (refs.length === 0) {
    const poster = await createPicture(
      createFreeWifiPosterDataUrl(),
      'default',
      'FREE WIFI poster',
    );
    return { pictures: [poster], selectedId: poster.id, failedCount: 0 };
  }

  const results = await Promise.allSettled(
    refs.map(async (ref): Promise<LibraryPicture> => {
      const picture = await getPicture(ref.id);
      if (!picture) {
        throw new Error(`Picture ${ref.id} is no longer available.`);
      }
      return {
        ...picture,
        createdAt: ref.createdAt || picture.createdAt,
        updatedAt: picture.updatedAt || ref.createdAt,
        editToken: ref.editToken,
        label: ref.label,
      };
    }),
  );

  const pictures: LibraryPicture[] = [];
  let failedCount = 0;
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      pictures.push(result.value);
    } else {
      failedCount += 1;
    }
  });

  const storedSelected = readSelectedId();
  const selectedId = pictures.some((picture) => picture.id === storedSelected)
    ? storedSelected
    : (pictures[0]?.id ?? null);

  return { pictures, selectedId, failedCount };
}

let libraryPromise: Promise<PictureLibrary> | null = null;

/**
 * Loads every picture this browser owns, creating the default FREE WIFI
 * poster on first run. The promise is memoized so React StrictMode's double
 * mount only creates one picture.
 */
export function loadPictureLibrary(): Promise<PictureLibrary> {
  if (!libraryPromise) {
    libraryPromise = loadLibrary().catch((error: unknown) => {
      libraryPromise = null;
      throw error;
    });
  }
  return libraryPromise;
}

export function resetPictureLibraryCache(): void {
  libraryPromise = null;
}

export function selectPicture(id: string): void {
  writeSelectedId(id);
}
