import { QRCodeCanvas } from 'qrcode.react';
import { createSampleMenuDataUrl } from '../site/sampleContent';
import { demoViewUrl } from '../site/demo';

const sampleMenu = createSampleMenuDataUrl();
const demoUrl = demoViewUrl();

interface PhoneMockupProps {
  showSign?: boolean;
}

export default function PhoneMockup({ showSign = true }: PhoneMockupProps) {
  return (
    <div className="phone-stage">
      <div
        className="phone"
        role="img"
        aria-label="Example phone screen showing a cafe menu opened from a printed QR code"
      >
        <div className="phone-screen">
          <div className="phone-status" aria-hidden="true">
            <span>9:41</span>
            <span className="phone-status-icons">
              <span className="phone-signal" />
              <span className="phone-battery" />
            </span>
          </div>
          <div className="phone-bar" aria-hidden="true">
            <span className="phone-lock" />
            <span className="phone-url">qr-picture-viewer</span>
            <span className="phone-live">LIVE</span>
          </div>
          <img className="phone-image" src={sampleMenu} alt="" aria-hidden="true" />
          <div className="phone-foot" aria-hidden="true">
            <span className="phone-dot" />
            <span>Updated just now</span>
            <span className="phone-scan">Scanned</span>
          </div>
        </div>
      </div>

      {showSign && (
        <div className="qr-sign" aria-hidden="true">
          <div className="qr-sign-code">
            <QRCodeCanvas
              value={demoUrl}
              size={88}
              level="M"
              marginSize={1}
              bgColor="#ffffff"
              fgColor="#10235f"
            />
          </div>
          <p>Scan for today&apos;s menu</p>
        </div>
      )}
    </div>
  );
}
