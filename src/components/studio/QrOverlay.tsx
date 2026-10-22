import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { copyText, downloadQrPng } from '../../services/qrShare';
import { IconClose, IconCopy, IconDownload, IconOpen } from './icons';

interface QrOverlayProps {
  value: string;
  fileName: string;
  onClose: () => void;
}

export default function QrOverlay({ value, fileName, onClose }: QrOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleCopy() {
    const ok = await copyText(value);
    setError(ok ? null : 'Could not copy the link automatically.');
    if (ok) setCopied(true);
  }

  return (
    <div className="qr-overlay" role="dialog" aria-modal="true" aria-label="QR code sharing">
      <button
        type="button"
        className="studio-scrim"
        aria-label="Close QR code"
        onClick={onClose}
      />
      <div className="qr-overlay-card">
        <button
          ref={closeRef}
          type="button"
          className="studio-icon-btn qr-overlay-close"
          onClick={onClose}
          aria-label="Close QR code"
        >
          <IconClose />
        </button>
        <p className="studio-kicker">Scan to open</p>
        <h2>Your picture, wherever it is printed.</h2>
        <div className="qr-frame qr-frame-xl">
          <QRCodeCanvas
            ref={canvasRef}
            value={value}
            size={296}
            level="M"
            marginSize={2}
            bgColor="#ffffff"
            fgColor="#0f172a"
          />
        </div>
        <code className="url-code">{value}</code>
        <div className="btn-row qr-overlay-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setError(downloadQrPng(canvasRef.current, fileName))}
          >
            <IconDownload /> Download QR (PNG)
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCopy}>
            <IconCopy /> {copied ? 'Copied!' : 'Copy link'}
          </button>
          <a className="btn btn-secondary" href={value} target="_blank" rel="noreferrer">
            <IconOpen /> Open page
          </a>
        </div>
        {error && (
          <p className="status-line status-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
