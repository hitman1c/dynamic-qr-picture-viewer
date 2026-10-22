import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import LocationQr from '../components/LocationQr';
import PasswordGate from '../components/PasswordGate';
import QrOverlay from '../components/studio/QrOverlay';
import StudioDrawer from '../components/studio/StudioDrawer';
import StudioHelp from '../components/studio/StudioHelp';
import StudioLibrary from '../components/studio/StudioLibrary';
import StudioPhone from '../components/studio/StudioPhone';
import StudioPicker from '../components/studio/StudioPicker';
import StudioQr from '../components/studio/StudioQr';
import {
  IconPictures,
  IconPin,
  IconHelp,
  IconUser,
  IconCheck,
  IconClose,
} from '../components/studio/icons';
import { isDashboardUnlocked, lockDashboard } from '../services/dashboardAccess';
import { prefersReducedMotion, useRevealScope } from '../hooks/journey';
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
import { formatDate } from '../utils/format';
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

type DrawerKind = 'library' | 'location' | 'help' | null;

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

function useJourneyProgress(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      root.style.setProperty('--p', clamp(-rect.top / total).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    if (prefersReducedMotion()) {
      root.classList.add('is-reduced');
      return undefined;
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootRef]);
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
  const rootRef = useRef<HTMLDivElement>(null);
  useJourneyProgress(rootRef);
  useRevealScope(rootRef);

  const [libraryState, setLibraryState] = useState<LibraryState>({ status: 'loading' });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);
  const [draft, setDraft] = useState<DraftImage | null>(null);
  const [publishing, setPublishing] = useState<'new' | 'replace' | null>(null);
  const [message, setMessage] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [drawer, setDrawer] = useState<DrawerKind>(null);
  const [qrOverlay, setQrOverlay] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [publishGlow, setPublishGlow] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!accountOpen) return undefined;
    function handleClick(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [accountOpen]);

  const handleDraft = useCallback((imageUrl: string, source: PictureSource, label: string) => {
    setDraft({ imageUrl, source, label });
    setMessage(null);
  }, []);

  const handleUsePoster = useCallback(() => {
    setDraft({
      imageUrl: createFreeWifiPosterDataUrl(),
      source: 'default',
      label: 'FREE WIFI poster',
    });
    setMessage(null);
  }, []);

  const pictures = libraryState.status === 'ready' ? libraryState.pictures : [];
  const selected = pictures.find((picture) => picture.id === selectedId) ?? null;
  const viewUrl = selected ? `${baseUrl}/view/${selected.id}` : '';
  const hasPending = draft !== null;
  const isBusy = publishing !== null;

  function confirmDiscardDraft(): boolean {
    if (!draft) return true;
    return window.confirm(
      'Discard the picture you selected but have not published yet? Nothing will be saved.',
    );
  }

  async function handlePublishPrimary() {
    if (!draft || isBusy) return;
    setPublishing(selected ? 'replace' : 'new');
    setMessage(null);
    try {
      if (selected) {
        const ref = getOwnedPictureRef(selected.id);
        if (!ref) {
          setMessage({
            kind: 'error',
            text: 'This browser does not hold the edit key for that picture, so it cannot be replaced from here.',
          });
          setPublishing(null);
          return;
        }
        const updated = await updatePicture(
          selected.id,
          ref.editToken,
          draft.imageUrl,
          draft.source,
        );
        if (!updated) {
          setMessage({
            kind: 'error',
            text: 'The picture service refused the update. Try publishing as a new QR code from the Pictures drawer.',
          });
          setPublishing(null);
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
        setPublishGlow(true);
        setTimeout(() => setPublishGlow(false), 900);
        setMessage({
          kind: 'success',
          text: 'Picture replaced. The same QR code now shows the new picture.',
        });
      } else {
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
        setPublishGlow(true);
        setTimeout(() => setPublishGlow(false), 900);
        setMessage({
          kind: 'success',
          text: 'Published. This picture has its own QR code — download it, copy the link or scan it now.',
        });
      }
    } catch (error) {
      setMessage({ kind: 'error', text: errorText(error) });
    } finally {
      setPublishing(null);
    }
  }

  async function handlePublishNewFromDrawer() {
    if (!draft || isBusy) return;
    setDrawer(null);
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
        text: 'Published as a new QR code. The previous picture keeps its own code.',
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
    if (id !== selectedId && !confirmDiscardDraft()) return;
    selectPicture(id);
    setSelectedId(id);
    if (id !== selectedId) setDraft(null);
    setMessage(null);
    setDrawer(null);
  }

  function handleDiscardDraft() {
    if (!confirmDiscardDraft()) return;
    setDraft(null);
    setMessage(null);
  }

  function scrollToScene(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  }

  const previewSrc = draft?.imageUrl ?? selected?.imageUrl;
  const statusLabel = draft ? 'Draft' : selected ? 'Published' : 'Empty';
  const statusClass = draft
    ? 'studio-status is-draft'
    : selected
      ? 'studio-status is-live'
      : 'studio-status is-empty';

  return (
    <div className="journey-dashboard" ref={rootRef} data-progress>
      <div className="journey-dashboard-shapes" aria-hidden="true">
        <span className="jd-shape jd-ring" />
        <span className="jd-shape jd-circle" />
        <span className="jd-shape jd-square" />
        <span className="jd-shape jd-dots" />
      </div>

      <header className="studio-bar">
        <Link to="/" className="studio-brand">
          <span className="studio-brand-mark" aria-hidden="true">
            QR
          </span>
          <span className="studio-brand-name">Picture Studio</span>
        </Link>

        <nav className="studio-tools" aria-label="Studio tools">
          <button
            type="button"
            className={drawer === 'library' ? 'studio-tool is-active' : 'studio-tool'}
            onClick={() => setDrawer(drawer === 'library' ? null : 'library')}
            aria-expanded={drawer === 'library'}
            aria-controls="studio-library-drawer"
          >
            <IconPictures />
            <span>Pictures</span>
          </button>
          <button
            type="button"
            className={drawer === 'location' ? 'studio-tool is-active' : 'studio-tool'}
            onClick={() => setDrawer(drawer === 'location' ? null : 'location')}
            aria-expanded={drawer === 'location'}
            aria-controls="studio-location-drawer"
          >
            <IconPin />
            <span>Location</span>
          </button>
          <button
            type="button"
            className={drawer === 'help' ? 'studio-tool is-active' : 'studio-tool'}
            onClick={() => setDrawer(drawer === 'help' ? null : 'help')}
            aria-expanded={drawer === 'help'}
            aria-controls="studio-help-drawer"
          >
            <IconHelp />
            <span>Help</span>
          </button>
        </nav>

        <div className="studio-account" ref={accountRef}>
          <button
            type="button"
            className="studio-tool studio-account-btn"
            onClick={() => setAccountOpen((open) => !open)}
            aria-expanded={accountOpen}
            aria-haspopup="menu"
          >
            <IconUser />
            <span>Account</span>
          </button>
          {accountOpen && (
            <div className="studio-menu" role="menu">
              <Link
                className="studio-menu-item"
                to="/"
                role="menuitem"
                onClick={() => setAccountOpen(false)}
              >
                View website
              </Link>
              <button
                type="button"
                className="studio-menu-item"
                role="menuitem"
                onClick={() => {
                  lockDashboard();
                  onLock();
                }}
              >
                Lock dashboard
              </button>
            </div>
          )}
        </div>
      </header>

      {(!isRemoteConfigured || pointsToLocalhost) && (
        <div className="studio-notice" role="status">
          {!isRemoteConfigured && (
            <span>
              <strong>Local demo mode.</strong> Pictures are stored in this browser only.
            </span>
          )}
          {pointsToLocalhost && (
            <span>
              <strong>This QR code points at localhost</strong> — phones cannot open it. Deploy
              publicly or set <code>VITE_APP_BASE_URL</code>.
            </span>
          )}
        </div>
      )}

      {libraryState.status === 'ready' && libraryState.failedCount > 0 && (
        <div className="studio-notice" role="status">
          <strong>{libraryState.failedCount} picture(s) could not be loaded</strong> and are hidden.
        </div>
      )}

      <main className="journey-dashboard-main">
        <aside className="jd-stage" aria-label="Live preview">
          <div className="jd-stage-inner">
            <StudioPhone
              imageUrl={previewSrc}
              alt={draft ? 'Draft preview of the selected picture' : 'The currently published picture'}
              draft={Boolean(draft)}
              glowing={publishGlow}
            />
            <div className={publishGlow ? 'jd-qr-float is-glowing' : 'jd-qr-float'}>
              {libraryState.status === 'ready' && selected && viewUrl ? (
                <button
                  type="button"
                  className="jd-qr-btn"
                  onClick={() => setQrOverlay(true)}
                  aria-label="Enlarge the QR code and open sharing options"
                >
                  <span className="qr-frame">
                    <QRCodeCanvas
                      value={viewUrl}
                      size={120}
                      level="M"
                      marginSize={2}
                      bgColor="#ffffff"
                      fgColor="#0f172a"
                    />
                  </span>
                </button>
              ) : (
                <div className="qr-frame jd-qr-empty">
                  <span>QR</span>
                </div>
              )}
              <p>Your code never changes</p>
            </div>
          </div>
        </aside>

        <div className="jd-scenes">
          <section
            className="jd-scene reveal"
            data-from="up"
            id="jd-current"
            aria-labelledby="jd-current-heading"
          >
            <p className="jd-eyebrow">Your picture, everywhere</p>
            <h1 id="jd-current-heading">
              {selected ? selected.label : 'One picture. One code.'}
            </h1>
            <p className="jd-lead">
              {selected
                ? 'This is what people see when they scan your code. Change it whenever you need — the printed QR code keeps working.'
                : 'Publish your first picture to create a permanent QR code you can print once and update forever.'}
            </p>
            <div className="jd-status-row">
              <span className={statusClass}>
                {statusLabel === 'Published' && <IconCheck size={14} />}
                {statusLabel}
              </span>
              {selected && !draft && (
                <p className="jd-meta">Live · updated {formatDate(selected.updatedAt)}</p>
              )}
              {draft && (
                <p className="jd-meta is-draft">Draft preview · not published yet</p>
              )}
            </div>
            <div className="jd-actions">
              <button
                type="button"
                className="btn btn-cta"
                onClick={() => scrollToScene('jd-edit')}
                disabled={libraryState.status !== 'ready'}
              >
                {selected ? 'Change picture' : 'Add a picture'}
              </button>
              {selected && viewUrl && (
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => scrollToScene('jd-share')}
                >
                  Jump to QR code
                </button>
              )}
            </div>
            {libraryState.status === 'loading' && (
              <p className="jd-meta" role="status">
                Loading your pictures…
              </p>
            )}
            {libraryState.status === 'error' && (
              <div className="jd-error" role="alert">
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
          </section>

          <section
            className="jd-scene reveal"
            data-from="up"
            id="jd-edit"
            aria-labelledby="jd-edit-heading"
          >
            <p className="jd-eyebrow">Step 2 · Picture editing</p>
            <h2 id="jd-edit-heading">Choose the next picture.</h2>
            <p className="jd-lead">
              Upload a photo or paste a public image link. Nothing changes for people scanning the
              code until you press Publish.
            </p>
            <div className="jd-panel">
              <StudioPicker
                onImage={handleDraft}
                onError={(text) => setMessage({ kind: 'error', text })}
                onUsePoster={handleUsePoster}
                busy={isBusy}
              />
            </div>
            {draft && (
              <div className="jd-draft-bar">
                <p>
                  <strong>{draft.label}</strong> is ready as a draft. The live picture is unchanged.
                </p>
                <div className="jd-draft-actions">
                  <button type="button" className="btn btn-ghost" onClick={handleDiscardDraft}>
                    <IconClose size={14} /> Discard
                  </button>
                  <button
                    type="button"
                    className="btn btn-cta"
                    onClick={() => scrollToScene('jd-publish')}
                  >
                    Continue to publish
                  </button>
                </div>
              </div>
            )}
          </section>

          <section
            className="jd-scene reveal"
            data-from="up"
            id="jd-share"
            aria-labelledby="jd-share-heading"
          >
            <p className="jd-eyebrow">Step 3 · QR sharing</p>
            <h2 id="jd-share-heading">Your QR code.</h2>
            <p className="jd-lead">
              This code points at a stable address. Download it, copy the link, or open the public
              picture page. Replacing the picture later never changes this code.
            </p>
            <div className="jd-panel">
              {libraryState.status === 'ready' && selected && viewUrl && (
                <StudioQr
                  value={viewUrl}
                  fileName={`dynamic-qr-${selected.id.slice(0, 8)}.png`}
                  onEnlarge={() => setQrOverlay(true)}
                />
              )}
              {libraryState.status === 'ready' && !selected && (
                <p className="jd-meta">
                  Publish a picture first — then its QR code appears here and in the preview.
                </p>
              )}
            </div>
          </section>

          <section
            className="jd-scene reveal"
            data-from="up"
            id="jd-publish"
            aria-labelledby="jd-publish-heading"
          >
            <p className="jd-eyebrow">Step 4 · Publishing</p>
            <h2 id="jd-publish-heading">Publish the update.</h2>
            <p className="jd-lead">
              Confirm when you are ready. The backend confirms first — only then does the live
              picture change. Your QR code and picture address stay exactly the same.
            </p>
            <div className="jd-panel jd-publish-panel">
              <button
                type="button"
                className="studio-publish"
                onClick={handlePublishPrimary}
                disabled={!hasPending || isBusy}
              >
                {isBusy
                  ? publishing === 'replace'
                    ? 'Replacing…'
                    : 'Publishing…'
                  : hasPending && selected
                    ? 'Publish update (keep QR code)'
                    : 'Publish picture'}
              </button>
              {!hasPending && (
                <p className="jd-meta">
                  Choose a picture in Step 2 first. Publishing makes it live for everyone scanning
                  the code.
                </p>
              )}
              {hasPending && (
                <p className="jd-meta">
                  {selected
                    ? 'This will replace the live picture. The QR code will not change.'
                    : 'This will create a new picture with its own QR code.'}
                </p>
              )}
            </div>
            {message && (
              <p
                className={
                  message.kind === 'success'
                    ? 'status-line status-success studio-toast'
                    : 'status-line status-error studio-toast'
                }
                role={message.kind === 'error' ? 'alert' : 'status'}
              >
                {message.text}
              </p>
            )}
            <div className="jd-maker">
              <img
                className="jd-maker-photo"
                src="/sechaba.jpeg"
                alt="Sechaba, creator of the Dynamic QR Picture Viewer"
                width={56}
                height={56}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <div>
                <p className="jd-maker-label">Built by</p>
                <p className="jd-maker-name">Sechaba</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <StudioDrawer
        open={drawer === 'library'}
        title="Your pictures"
        onClose={() => setDrawer(null)}
      >
        <div id="studio-library-drawer">
          <StudioLibrary
            pictures={pictures}
            selectedId={selectedId}
            onSelect={handleShowQr}
            onForget={handleForget}
            onPublishNew={handlePublishNewFromDrawer}
          />
        </div>
      </StudioDrawer>

      <StudioDrawer
        open={drawer === 'location'}
        title="Location QR code"
        onClose={() => setDrawer(null)}
      >
        <div id="studio-location-drawer">
          <LocationQr />
        </div>
      </StudioDrawer>

      <StudioDrawer open={drawer === 'help'} title="Help" onClose={() => setDrawer(null)}>
        <div id="studio-help-drawer">
          <StudioHelp />
        </div>
      </StudioDrawer>

      {qrOverlay && viewUrl && selected && (
        <QrOverlay
          value={viewUrl}
          fileName={`dynamic-qr-${selected.id.slice(0, 8)}.png`}
          onClose={() => setQrOverlay(false)}
        />
      )}
    </div>
  );
}
