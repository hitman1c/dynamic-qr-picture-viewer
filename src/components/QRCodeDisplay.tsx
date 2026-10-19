import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  fileName?: string;
}

export default function QRCodeDisplay({
  value,
  fileName = 'dynamic-qr-picture.png',
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!value) {
    return (
      <p className="status-line status-error" role="alert">
        The QR code cannot be generated yet.
      </p>
    );
  }

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError('The QR code is not ready to download yet.');
      return;
    }
    try {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      setError(null);
    } catch {
      setError('The QR code could not be downloaded in this browser.');
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setError(null);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      if (ok) {
        setError(null);
        setCopied(true);
      } else {
        setError('Could not copy automatically. Select the address below and copy it manually.');
      }
    }
  }

  return (
    <div className="qr-display">
      <div className="qr-frame">
        <QRCodeCanvas
          ref={canvasRef}
          value={value}
          size={224}
          level="M"
          marginSize={2}
          bgColor="#ffffff"
          fgColor="#0b1220"
        />
      </div>
      <code className="url-code">{value}</code>
      <div className="btn-row">
        <button type="button" className="btn btn-secondary" onClick={handleDownload}>
          Download QR (PNG)
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
      </div>
      {error && (
        <p className="status-line status-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
