import { useEffect, useMemo, useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';

const STORAGE_KEY = 'dqr:location';

type Mode = 'link' | 'coords';

interface LocationDraft {
  mode: Mode;
  link: string;
  lat: string;
  lng: string;
}

const EMPTY: LocationDraft = { mode: 'link', link: '', lat: '', lng: '' };

function loadStored(): LocationDraft {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<LocationDraft>;
    return {
      mode: parsed.mode === 'coords' ? 'coords' : 'link',
      link: typeof parsed.link === 'string' ? parsed.link : '',
      lat: typeof parsed.lat === 'string' ? parsed.lat : '',
      lng: typeof parsed.lng === 'string' ? parsed.lng : '',
    };
  } catch {
    return EMPTY;
  }
}

function resolveLink(value: string): { url?: string; error?: string } {
  const trimmed = value.trim();
  if (!trimmed) return { error: 'Paste a Google Maps link or any location web address.' };
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { error: 'Only http and https links are supported.' };
    }
    if (!url.hostname.includes('.')) {
      return { error: 'That does not look like a valid web address.' };
    }
    return { url: url.toString() };
  } catch {
    return { error: 'That does not look like a valid web address.' };
  }
}

function resolveCoords(lat: string, lng: string): { url?: string; error?: string } {
  const latTrimmed = lat.trim();
  const lngTrimmed = lng.trim();
  if (!latTrimmed || !lngTrimmed) return { error: 'Enter both a latitude and a longitude.' };
  const latNumber = Number(latTrimmed);
  const lngNumber = Number(lngTrimmed);
  if (!Number.isFinite(latNumber) || !Number.isFinite(lngNumber)) {
    return { error: 'Latitude and longitude must be numbers.' };
  }
  if (latNumber < -90 || latNumber > 90) return { error: 'Latitude must be between -90 and 90.' };
  if (lngNumber < -180 || lngNumber > 180) {
    return { error: 'Longitude must be between -180 and 180.' };
  }
  return {
    url: `https://www.google.com/maps/search/?api=1&query=${latNumber},${lngNumber}`,
  };
}

export default function LocationQr() {
  const [draft, setDraft] = useState<LocationDraft>(() => loadStored());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* storage is optional */
    }
  }, [draft]);

  const resolved = useMemo(
    () =>
      draft.mode === 'link' ? resolveLink(draft.link) : resolveCoords(draft.lat, draft.lng),
    [draft],
  );

  const value = resolved.url ?? '';

  return (
    <section className="card location-card" aria-labelledby="location-heading">
      <h2 id="location-heading">4. Location QR code</h2>
      <p className="hint">
        Point a QR code at your shop, stall or venue. Paste a Google Maps (or other location) link, or
        enter the coordinates. Scanning the code opens the location in the phone&apos;s map app.
      </p>

      <div className="segmented" role="radiogroup" aria-label="How do you want to provide the location?">
        <button
          type="button"
          role="radio"
          aria-checked={draft.mode === 'link'}
          className={draft.mode === 'link' ? 'segment is-active' : 'segment'}
          onClick={() => setDraft((current) => ({ ...current, mode: 'link' }))}
        >
          Google Maps link
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={draft.mode === 'coords'}
          className={draft.mode === 'coords' ? 'segment is-active' : 'segment'}
          onClick={() => setDraft((current) => ({ ...current, mode: 'coords' }))}
        >
          Coordinates
        </button>
      </div>

      {draft.mode === 'link' ? (
        <div className="field">
          <label className="field-label" htmlFor="location-link">
            Location link
          </label>
          <input
            id="location-link"
            type="url"
            inputMode="url"
            placeholder="https://maps.app.goo.gl/…"
            value={draft.link}
            onChange={(event) => setDraft((current) => ({ ...current, link: event.target.value }))}
          />
        </div>
      ) : (
        <div className="coords-row">
          <div className="field">
            <label className="field-label" htmlFor="location-lat">
              Latitude
            </label>
            <input
              id="location-lat"
              type="number"
              step="any"
              min={-90}
              max={90}
              inputMode="decimal"
              placeholder="-26.2041"
              value={draft.lat}
              onChange={(event) => setDraft((current) => ({ ...current, lat: event.target.value }))}
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="location-lng">
              Longitude
            </label>
            <input
              id="location-lng"
              type="number"
              step="any"
              min={-180}
              max={180}
              inputMode="decimal"
              placeholder="28.0473"
              onChange={(event) => setDraft((current) => ({ ...current, lng: event.target.value }))}
            />
          </div>
        </div>
      )}

      {resolved.error ? (
        <p className="hint" role="status">
          {resolved.error}
        </p>
      ) : (
        <>
          <QRCodeDisplay value={value} fileName="dynamic-qr-location.png" />
          <a className="btn btn-secondary btn-block" href={value} target="_blank" rel="noreferrer">
            Open location
          </a>
          <p className="hint">
            Tip: a coordinates code always opens at the exact spot, even if the map link is later
            renamed. Share this code wherever the location is needed.
          </p>
        </>
      )}
    </section>
  );
}
