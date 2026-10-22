import { useMemo, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { getDemoPictures } from '../site/sampleContent';
import { demoViewUrl } from '../site/demo';
import { revealDelay } from '../hooks/journey';

const DEMO_URL = demoViewUrl();

export default function DemoShowcase() {
  const pictures = useMemo(() => getDemoPictures(), []);
  const [activeId, setActiveId] = useState(pictures[0].id);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const active = pictures.find((picture) => picture.id === activeId) ?? pictures[0];

  function selectPicture(id: string) {
    if (id === activeId) return;
    setFading(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setActiveId(id);
      setFading(false);
    }, 180);
  }

  return (
    <div className="demo reveal" data-from="up">
      <div className="demo-copy">
        <p className="section-eyebrow light">Interactive demo</p>
        <h3 className="demo-title">Watch the picture change.</h3>
        <p className="demo-lead">
          Pick an example below. The phone shows a different picture each time — the QR code never
          moves and never changes.
        </p>
        <div
          className="demo-switcher"
          role="tablist"
          aria-label="Example pictures for the demo"
        >
          {pictures.map((picture, index) => (
            <button
              key={picture.id}
              type="button"
              role="tab"
              aria-selected={picture.id === activeId}
              className={
                picture.id === activeId ? 'demo-tab is-active' : 'demo-tab'
              }
              style={revealDelay(index * 40)}
              onClick={() => selectPicture(picture.id)}
            >
              {picture.label}
            </button>
          ))}
        </div>
        <p className="demo-caption" role="status">
          <strong>{active.label}.</strong> {active.caption} The phone shows a preview; the QR code
          opens the built-in FREE WIFI poster at its public address.
        </p>
        <p className="demo-promise">
          <span className="demo-promise-dot" aria-hidden="true" />
          New picture. Same QR code.
        </p>
      </div>

      <div className="demo-stage">
        <div className="demo-phone" aria-live="polite">
          <div className="demo-phone-notch" aria-hidden="true" />
          <div className="demo-phone-screen">
            <div className="demo-phone-bar" aria-hidden="true">
              <span>qr-picture-viewer</span>
              <span className="demo-phone-live">LIVE</span>
            </div>
            <img
              className={fading ? 'demo-phone-img is-fading' : 'demo-phone-img'}
              src={active.imageUrl}
              alt={`Example picture: ${active.label}`}
            />
          </div>
        </div>

        <div className="demo-qr-float">
          <div className="qr-frame demo-qr-frame">
            <QRCodeCanvas
              value={DEMO_URL}
              size={132}
              level="M"
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#0f172a"
            />
          </div>
          <p>Scan — always the latest picture</p>
        </div>
      </div>
    </div>
  );
}
