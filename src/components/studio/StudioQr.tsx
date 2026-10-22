import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { copyText, downloadQrPng } from '../../services/qrShare';
import { IconCopy, IconDownload, IconOpen } from './icons';

interface StudioQrProps {
  value: string;
  fileName: string;
  onEnlarge: () => void;
}

export default function StudioQr({ value, fileName, onEnlarge }: StudioQrProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCopy() {
    const ok = await copyText(value);
    setError(ok ? null : 'Could not copy the link automatically.');
    if (ok) setCopied(true);
  }

  return (
    <div className="studio-qr">
      <button
        type="button"
        className="studio-qr-zoom"
        onClick={onEnlarge}
        aria-label="Enlarge the QR code and open sharing options"
      >
        <span className="qr-frame">
          <QRCodeCanvas
            ref={canvasRef}
            value={value}
            size={184}
            level="M"
            marginSize={2}
            bgColor="#ffffff"
            fgColor="#0f172a"
          />
        </span>
        <span className="studio-qr-zoom-hint">Click to enlarge</span>
      </button>
      <code className="url-code">{value}</code>
      <div className="btn-row studio-qr-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setError(downloadQrPng(canvasRef.current, fileName))}
        >
          <IconDownload /> Download PNG
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCopy}>
          <IconCopy /> {copied ? 'Copied!' : 'Copy link'}
        </button>
        <a className="btn btn-secondary" href={value} target="_blank" rel="noreferrer">
          <IconOpen /> Open
        </a>
      </div>
      {error && (
        <p className="status-line status-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
