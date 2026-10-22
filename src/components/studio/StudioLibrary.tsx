import type { LibraryPicture } from '../../types/picture';
import { formatDate } from '../../utils/format';

interface StudioLibraryProps {
  pictures: LibraryPicture[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onForget: (id: string) => void;
  onPublishNew: () => void;
}

export default function StudioLibrary({
  pictures,
  selectedId,
  onSelect,
  onForget,
  onPublishNew,
}: StudioLibraryProps) {
  if (pictures.length === 0) {
    return (
      <p className="hint">
        No pictures yet. Choose a picture on the studio canvas and publish it to create your first
        QR code.
      </p>
    );
  }

  return (
    <div className="studio-library">
      {pictures.map((picture) => (
        <article
          key={picture.id}
          className={
            picture.id === selectedId ? 'studio-library-item is-selected' : 'studio-library-item'
          }
        >
          <img
            className="studio-library-thumb"
            src={picture.imageUrl}
            alt={picture.label}
            loading="lazy"
          />
          <div className="studio-library-info">
            <p className="studio-library-label">
              {picture.label}
              {picture.id === selectedId && <span className="studio-badge">On canvas</span>}
            </p>
            <p className="studio-library-meta">
              Added {formatDate(picture.createdAt)} · /view/{picture.id.slice(0, 8)}…
            </p>
          </div>
          <div className="studio-library-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onSelect(picture.id)}
              disabled={picture.id === selectedId}
            >
              Show QR
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => onForget(picture.id)}>
              Forget
            </button>
          </div>
        </article>
      ))}
      <button type="button" className="btn btn-secondary" onClick={onPublishNew}>
        Publish as new QR code
      </button>
      <p className="hint">
        Every picture keeps its own address, so every picture has its own QR code.{' '}
        <strong>Forget</strong> only removes the picture from this browser — the published page and
        its QR code keep working.
      </p>
    </div>
  );
}
