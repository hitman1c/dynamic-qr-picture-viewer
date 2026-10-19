import { useCallback, useEffect, useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import LoadingIndicator from '../components/LoadingIndicator';
import PasswordGate from '../components/PasswordGate';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { isDashboardUnlocked, lockDashboard } from '../services/dashboardAccess';
import { createFreeWifiPosterDataUrl } from '../services/imageService';
import {
  createPicture,
  ensureCurrentPicture,
  getPictureRef,
  isRemoteConfigured,
  updatePicture,
} from '../services/pictureService';
import type { OwnedPicture, PictureSource } from '../types/picture';

interface DraftImage {
  imageUrl: string;
  source: PictureSource;
}

type PageState =
  | { status: 'loading' }
  | { status: 'ready'; picture: OwnedPicture }
  | { status: 'error'; message: string };

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
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

export default function HomePage() {
  const [unlocked, setUnlocked] = useState(() => isDashboardUnlocked());

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return <Dashboard onLock={() => setUnlocked(false)} />;
}

function Dashboard({ onLock }: { onLock: () => void }) {
  const [pageState, setPageState] = useState<PageState>({ status: 'loading' });
  const [loadKey, setLoadKey] = useState(0);
  const [draft, setDraft] = useState<DraftImage | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);

  const { baseUrl, pointsToLocalhost } = resolveAppBaseUrl();

  useEffect(() => {
    let cancelled = false;
    setPageState({ status: 'loading' });
    ensureCurrentPicture()
      .then((picture) => {
        if (!cancelled) setPageState({ status: 'ready', picture });
      })
      .catch((error: unknown) => {
        if (!cancelled) setPageState({ status: 'error', message: errorText(error) });
      });
    return () => {
      cancelled = true;
    };
  }, [loadKey]);

  const handleSelected = useCallback((imageUrl: string, source: PictureSource) => {
    setDraft({ imageUrl, source });
    setMessage(null);
  }, []);

  const handleUsePoster = useCallback(() => {
    setDraft({ imageUrl: createFreeWifiPosterDataUrl(), source: 'default' });
    setMessage(null);
  }, []);

  async function handlePublish() {
    if (!draft) return;
    setPublishing(true);
    setMessage(null);
    try {
      const current = pageState.status === 'ready' ? pageState.picture : null;
      if (current) {
        const ref = getPictureRef();
        if (!ref) {
          throw new Error('No editable picture reference was found in this browser.');
        }
        const updated = await updatePicture(current.id, ref.editToken, draft.imageUrl, draft.source);
        if (!updated) {
          setMessage({
            kind: 'error',
            text: 'This picture could not be updated from this browser. Publish again or clear site data to start over.',
          });
          return;
        }
        setPageState({
          status: 'ready',
          picture: { ...current, imageUrl: updated.imageUrl, source: updated.source, updatedAt: updated.updatedAt || new Date().toISOString() },
        });
      } else {
        const created = await createPicture(draft.imageUrl, draft.source);
        setPageState({ status: 'ready', picture: created });
      }
      setDraft(null);
      setMessage({
        kind: 'success',
        text: 'Picture published. Scanning the same QR code now shows the new picture.',
      });
    } catch (error) {
      setMessage({ kind: 'error', text: errorText(error) });
    } finally {
      setPublishing(false);
    }
  }

  function handleDiscard() {
    setDraft(null);
    setMessage(null);
  }

  const picture = pageState.status === 'ready' ? pageState.picture : null;
  const previewSrc = draft?.imageUrl ?? picture?.imageUrl;
  const viewUrl = picture ? `${baseUrl}/view/${picture.id}` : '';
  const previewStatus = draft
    ? 'Selected but not published yet. Scanners still see the previous picture.'
    : picture
      ? 'Live picture. This is what people see when they scan the QR code.'
      : undefined;

  return (
    <div className="page">
      <header className="page-header">
        <div className="header-row">
          <div>
            <h1>Dynamic QR Picture Viewer</h1>
            <p className="tagline">
              One QR code, endless pictures. Print the code once, then replace the picture any time
              &mdash; scanning the same code always shows the latest image.
            </p>
          </div>
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
      </header>

      {!isRemoteConfigured && (
        <div className="banner banner-warn" role="status">
          <strong>Local demo mode.</strong> No picture service is configured, so pictures are stored
          in this browser only. The QR code will not show pictures on other devices until you
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
              <button type="button" className="btn btn-ghost" onClick={handleDiscard}>
                Discard change
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={handlePublish}
            disabled={!draft || publishing || pageState.status !== 'ready'}
          >
            {publishing
              ? 'Publishing…'
              : picture
                ? 'Update picture (keep same QR)'
                : 'Publish picture'}
          </button>
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
          <h2 id="qr-heading">2. Share the QR code</h2>
          {pageState.status === 'loading' && <LoadingIndicator label="Setting up your picture and QR code…" />}
          {pageState.status === 'error' && (
            <div className="status-line status-error" role="alert">
              <p>{pageState.message}</p>
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
          {pageState.status === 'ready' && (
            <>
              <QRCodeDisplay value={viewUrl} />
              <a className="btn btn-secondary btn-block" href={viewUrl} target="_blank" rel="noreferrer">
                Open public viewing page
              </a>
              <p className="hint">
                Keep this QR code. Replace the picture on the left and every future scan shows the
                new image &mdash; no reprint needed.
              </p>
            </>
          )}
        </section>
      </main>

      <footer className="page-footer">
        <p>Dynamic QR Picture Viewer</p>
      </footer>
    </div>
  );
}
