import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator';
import { getPicture } from '../services/pictureService';
import type { Picture } from '../types/picture';

type ViewState =
  | { status: 'loading' }
  | { status: 'ready'; picture: Picture }
  | { status: 'missing' }
  | { status: 'error'; message: string };

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export default function PictureViewPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<ViewState>({ status: 'loading' });
  const [imageFailed, setImageFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const load = useCallback(async () => {
    if (!id) {
      setState({ status: 'missing' });
      return;
    }
    setState({ status: 'loading' });
    setImageFailed(false);
    try {
      const picture = await getPicture(id);
      if (!picture) {
        setState({ status: 'missing' });
      } else {
        setState({ status: 'ready', picture });
      }
    } catch (error) {
      setState({ status: 'error', message: errorText(error) });
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load, reloadKey]);

  function retry() {
    setReloadKey((key) => key + 1);
  }

  const updatedAt =
    state.status === 'ready' && state.picture.updatedAt
      ? new Date(state.picture.updatedAt)
      : null;
  const updatedLabel =
    updatedAt && !Number.isNaN(updatedAt.getTime())
      ? updatedAt.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : null;

  return (
    <div className="view-page">
      {state.status === 'loading' && (
        <div className="view-centered">
          <LoadingIndicator label="Loading picture…" />
        </div>
      )}

      {state.status === 'missing' && (
        <div className="view-centered" role="alert">
          <h1>Picture not found</h1>
          <p className="tagline">
            This picture does not exist or has been removed. If you printed this QR code, ask the
            person who shared it to publish the picture again.
          </p>
          <button type="button" className="btn btn-secondary" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {state.status === 'error' && (
        <div className="view-centered" role="alert">
          <h1>Could not load the picture</h1>
          <p className="tagline">{state.message}</p>
          <button type="button" className="btn btn-secondary" onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {state.status === 'ready' && (
        <div className="view-picture">
          {imageFailed ? (
            <div className="view-centered" role="alert">
              <h1>Picture unavailable</h1>
              <p className="tagline">
                The picture address could not be loaded. It may have been removed.
              </p>
              <button type="button" className="btn btn-secondary" onClick={retry}>
                Try again
              </button>
            </div>
          ) : (
            <>
              <img
                className="view-img"
                src={state.picture.imageUrl}
                alt="Shared picture"
                onLoad={() => setImageFailed(false)}
                onError={() => setImageFailed(true)}
              />
              {updatedLabel && <p className="view-meta">Updated {updatedLabel}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
