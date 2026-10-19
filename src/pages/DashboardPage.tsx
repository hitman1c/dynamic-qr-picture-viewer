import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import LoadingIndicator from '../components/LoadingIndicator';
import LocationQr from '../components/LocationQr';
import PasswordGate from '../components/PasswordGate';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { isDashboardUnlocked, lockDashboard } from '../services/dashboardAccess';
import { createFreeWifiPosterDataUrl } from '../services/imageService';
import {
  forgetPicture,
  isRemoteConfigured,
  loadPictureLibrary,
  selectPicture,
  createPicture,
  updatePicture,
  getOwnedPictureRef,
} from '../services/pictureService';
import type { LibraryPicture, PictureSource } from '../types/picture';

interface DraftImage {
  imageUrl: string;
  source: PictureSource;
  label: string;
}

type LibraryState =
  | { status: 'loading' }
  | { status: 'ready'; pictures: LibraryPicture[]; failedCount: number }
  | { status: 'error'; message: string };

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

function formatDate(value: string): string {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return 'recently';
  return new Date(time).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function resolveAppBaseUrl(): { baseUrl: string; pointsToLocalhost: boolean } {
  const configured = (import.meta.env.VITE_APP_BASE_URL as string | undefined)?.trim();
  const raw = configured || window.location.origin;
  let baseUrl = raw;
  let pointsToLocalhost = false;
  try {
    const parsed = new URL(raw);
    baseUrl = parsed.origin + parsed.pathname.replace(/\/+$/, '');
    const host = parsed.hostname;
    pointsToLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  } catch {
    pointsToLocalhost = true;
  }
  return { baseUrl, pointsToLocalhost };
}

export default function DashboardPage() {
  const [unlocked, setUnlocked] = useState(() => isDashboardUnlocked());

  useEffect(() => {
    document.body.classList.add('app-brand-theme');
    return () => document.body.classList.remove('app-brand-theme');
  }, []);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <Dashboard onLock={() => setUnlocked(false)} />;
}

function Dashboard({ onLock }: { onLock: () => void }) {
  const [libraryState, setLibraryState] = useState<LibraryState>({ status: 'loading' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);
  const [draft, setDraft] = useState<DraftImage | null>(null);
  const [publishing, setPublishing] = useState<'new' | 'replace' | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const { baseUrl, pointsToLocalhost } = resolveAppBaseUrl();

  useEffect(() => {
    let cancelled = false;
    setLibraryState({ status: 'loading' });
    loadPictureLibrary()
      .then((library) => {
        if (cancelled) return;
        setSelectedId(library.selectedId);
        setLibraryState({
          status: 'ready',
          pictures: library.pictures,
          failedCount: library.failedCount,
        });
      })
      .catch((error: unknown) => {
        if (!cancelled) setLibraryState({ status: 'error', message: errorText(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [loadKey]);

  const handleSelected = useCallback((imageUrl: string, source: PictureSource, label: string) => {
    setDraft({ imageUrl, source, label });
    setMessage(null);
  }, []);

  const handleUsePoster = useCallback(() => {
    setDraft({ imageUrl: createFreeWifiPosterDataUrl(), source: 'default', label: 'FREE WIFI poster' });
    setMessage(null);
  }, []);

  const pictures = libraryState.status === 'ready' ? libraryState.pictures : [];
  const selected = pictures.find((picture) => picture.id === selectedId) ?? null;
  const viewUrl = selected ? `${baseUrl}/view/${selected.id}` : '';

  async function handlePublishNew() {
    if (!draft) return;
    setPublishing('new');
    setMessage(null);
    try {
      const created = await createPicture(draft.imageUrl, draft.source, draft.label);
      setLibraryState((previous) =>
        previous.status === 'ready'
          ? {
              ...previous,
              pictures: [created, ...previous.pictures.filter((p) => p.id !== created.id)],
            }
          : previous,
      );
      setSelectedId(created.id);
      setDraft(null);
      setMessage({
        kind: 'success',
        text: 'Published. This picture has its own new QR code — download it below or scan it now.',
      });
    } catch (error) {
      setMessage({ kind: 'error', text: errorText(error) });
    } finally {
      setPublishing(null);
    }
  }

  async function handleReplaceSelected() {
    if (!draft || !selected) return;
    const ref = getOwnedPictureRef(selected.id);
    if (!ref) {
      setMessage({
        kind: 'error',
        text: 'This browser does not hold the edit key for that picture, so it cannot be replaced from here.',
      });
      return;
    }
    setPublishing('replace');
    setMessage(null);
    try {
      const updated = await updatePicture(selected.id, ref.editToken, draft.imageUrl, draft.source);
      if (!updated) {
        setMessage({
          kind: 'error',
          text: 'The picture service refused the update. Publish it as a new QR code instead.',
        });
        return;
      }
      setLibraryState((previous) =>
        previous.status === 'ready'
          ? {
              ...previous,
              pictures: previous.pictures.map((picture) =>
                picture.id === updated.id
                  ? {
                      ...picture,
                      imageUrl: updated.imageUrl,
                      source: updated.source,
                      updatedAt: updated.updatedAt || new Date().toISOString(),
                    }
                  : picture,
              ),
            }
          : previous,
      );
      setDraft(null);
      setMessage({
        kind: 'success',
        text: 'Picture replaced. The same QR code now shows the new picture.',
      });
    } catch (error) {
      setMessage({ kind: 'error', text: errorText(error) });
    } finally {
      setPublishing(null);
    }
  }

  function handleForget(id: string) {
    forgetPicture(id);
    if (libraryState.status !== 'ready') return;
    const remaining = libraryState.pictures.filter((picture) => picture.id !== id);
    setLibraryState({ ...libraryState, pictures: remaining });
    if (selectedId === id) {
      setSelectedId(remaining[0]?.id ?? null);
    }
    setMessage(null);
  }

  function handleShowQr(id: string) {
    selectPicture(id);
    setSelectedId(id);
    setMessage(null);
  }

  const previewSrc = draft?.imageUrl ?? selected?.imageUrl;
  const previewStatus = draft
    ? 'Selected but not published yet. Choose how to publish it below.'
    : selected
      ? `Live picture for this QR code. Added ${formatDate(selected.createdAt)}.`
      : undefined;

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-row">
          <div>
            <h1>Dynamic QR Picture Viewer</h1>
            <p className="tagline">
              One QR code per picture. Print a code, publish a new picture and get a new code &mdash;
              or replace an existing picture so its printed code shows the update.
            </p>
          </div>
          <div className="btn-row">
            <Link className="btn btn-secondary" to="/">
              Back to website
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                lockDashboard();
                onLock();
              }}
            >
              Lock dashboard
            </button>
          </div>
        </div>
      </header>

      {!isRemoteConfigured && (
        <div className="banner banner-warn" role="status">
          <strong>Local demo mode.</strong> No picture service is configured, so pictures are stored
          in this browser only. The QR codes will not show pictures on other devices until you
          configure the backend (see README).
        </div>
      )}

      {pointsToLocalhost && (
        <div className="banner banner-warn" role="status">
          <strong>This QR code points at localhost.</strong> Phones cannot open it. Deploy the app
          to a public HTTPS address (see README), or set <code>VITE_APP_BASE_URL</code> to your
          deployed address before building.
        </div>
      )}

      {libraryState.status === 'ready' && libraryState.failedCount > 0 && (
        <div className="banner banner-warn" role="status">
          <strong>{libraryState.failedCount} picture(s) could not be loaded</strong> and are hidden
          from the list. Check your connection and retry.
        </div>
      )}

      <main className="home-grid">
        <section className="card" aria-labelledby="choose-heading">
          <h2 id="choose-heading">1. Choose a picture</h2>
          <ImageUploader onImage={handleSelected} onError={(text) => setMessage({ kind: 'error', text })} />
          <ImagePreview src={previewSrc} alt="Preview of the selected picture" status={previewStatus} />
          <div className="btn-row">
            <button type="button" className="btn btn-ghost" onClick={handleUsePoster}>
              Use FREE WIFI poster
            </button>
            {draft && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setDraft(null);
                  setMessage(null);
                }}
              >
                Discard change
              </button>
            )}
          </div>
          <div className="btn-col">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={handlePublishNew}
              disabled={!draft || publishing !== null}
            >
              {publishing === 'new' ? 'Publishing…' : 'Publish as new QR code'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-block"
              onClick={handleReplaceSelected}
              disabled={!draft || !selected || publishing !== null}
            >
              {publishing === 'replace'
                ? 'Replacing…'
                : 'Replace selected picture (keep its QR)'}
            </button>
          </div>
          <p className="hint">
            Every <strong>Publish as new QR code</strong> creates its own picture with its own QR
            code. Use <strong>Replace</strong> when a printed code should keep working with a new
            image.
          </p>
          {message && (
            <p
              className={message.kind === 'success' ? 'status-line status-success' : 'status-line status-error'}
              role={message.kind === 'error' ? 'alert' : 'status'}
            >
              {message.text}
            </p>
          )}
        </section>

        <section className="card" aria-labelledby="qr-heading">
          <h2 id="qr-heading">2. QR code</h2>
          {libraryState.status === 'loading' && (
            <LoadingIndicator label="Loading your pictures and QR codes…" />
          )}
          {libraryState.status === 'error' && (
            <div className="status-line status-error" role="alert">
              <p>{libraryState.message}</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setMessage(null);
                  setLoadKey((key) => key + 1);
                }}
              >
                Retry
              </button>
            </div>
          )}
          {libraryState.status === 'ready' && selected && (
            <>
              <p className="library-selected-label">{selected.label}</p>
              <QRCodeDisplay
                value={viewUrl}
                fileName={`dynamic-qr-${selected.id.slice(0, 8)}.png`}
              />
              <a className="btn btn-secondary btn-block" href={viewUrl} target="_blank" rel="noreferrer">
                Open public viewing page
              </a>
              <p className="hint">
                This code belongs only to this picture. Other pictures in your list have their own
                codes — select one below to show its QR code here.
              </p>
            </>
          )}
          {libraryState.status === 'ready' && !selected && (
            <p className="hint">No picture selected. Publish a picture to get its QR code.</p>
          )}
        </section>
      </main>

      <section className="card library" aria-labelledby="library-heading">
        <h2 id="library-heading">3. Your pictures and their QR codes</h2>
        <p className="hint">
          Every picture keeps its own address, so every picture has its own QR code. Select one to
          show, download or open its code.
        </p>
        {libraryState.status === 'ready' && pictures.length === 0 && (
          <p className="hint">No pictures in this browser yet. Publish one above.</p>
        )}
        {pictures.map((picture) => (
          <article
            key={picture.id}
            className={picture.id === selectedId ? 'library-item is-selected' : 'library-item'}
          >
            <img className="library-thumb" src={picture.imageUrl} alt={picture.label} loading="lazy" />
            <div className="library-info">
              <p className="library-label">
                {picture.label}
                {picture.id === selectedId && <span className="library-badge">QR shown</span>}
              </p>
              <p className="library-meta">
                Added {formatDate(picture.createdAt)} · /view/{picture.id.slice(0, 8)}…
              </p>
            </div>
            <div className="library-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleShowQr(picture.id)}
                disabled={picture.id === selectedId}
              >
                Show QR
              </button>
              <a
                className="btn btn-secondary"
                href={`${baseUrl}/view/${picture.id}`}
                target="_blank"
                rel="noreferrer"
              >
                Open
              </a>
              <button type="button" className="btn btn-ghost" onClick={() => handleForget(picture.id)}>
                Forget
              </button>
            </div>
          </article>
        ))}
        {pictures.length > 0 && (
          <p className="hint">
            <strong>Forget</strong> only removes the picture from this browser — its published page
            and QR code keep working.
          </p>
        )}
      </section>

      <LocationQr />

      <footer className="page-footer">
        <p>Dynamic QR Picture Viewer</p>
        <p>
          <Link className="btn-ghost btn" to="/">
            Back to the website
          </Link>
        </p>
      </footer>
    </div>
  );
}
