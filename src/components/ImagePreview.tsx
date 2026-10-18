import { useEffect, useState } from 'react';

interface ImagePreviewProps {
  src: string | undefined;
  alt: string;
  status?: string;
}

export default function ImagePreview({ src, alt, status }: ImagePreviewProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src]);

  if (!src) {
    return (
      <div className="preview preview-empty">
        <p>No picture selected yet. The FREE WIFI poster stays live until you publish a change.</p>
      </div>
    );
  }

  return (
    <figure className="preview">
      {failed ? (
        <div className="preview-fallback" role="alert">
          <p>This image could not be displayed. It may have been removed or the address may be broken.</p>
        </div>
      ) : (
        <>
          {!loaded && <div className="preview-loading">Loading preview…</div>}
          <img
            className={loaded ? 'preview-img is-visible' : 'preview-img'}
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </>
      )}
      {status && <figcaption className="preview-status">{status}</figcaption>}
    </figure>
  );
}
