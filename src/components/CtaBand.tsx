import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Icon from './Icon';
import { demoViewUrl } from '../site/demo';

const CTA_QR_URL = demoViewUrl();

interface CtaBandProps {
  title?: string;
  text?: string;
}

export default function CtaBand({
  title = "Your next update doesn't need a new QR code.",
  text = 'Open the dashboard, publish a picture and download its QR code. Replace the picture later and every printed copy keeps working.',
}: CtaBandProps) {
  return (
    <section className="cta-section" id="cta-section" aria-labelledby="cta-heading">
      <div className="cta-band">
        <div className="cta-copy">
          <p className="section-eyebrow light">Your turn</p>
          <h2 id="cta-heading">{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-visual reveal" data-from="scale" aria-hidden="true">
          <div className="qr-frame cta-qr-frame">
            <QRCodeCanvas
              value={CTA_QR_URL}
              size={148}
              level="M"
              marginSize={2}
              bgColor="#ffffff"
              fgColor="#0f172a"
            />
          </div>
          <p>One code. Every update.</p>
        </div>
        <div className="cta-actions">
          <Link className="btn btn-cta" to="/dashboard">
            Get Started
            <Icon name="arrow-right" />
          </Link>
          <Link className="btn btn-outline-light" to="/#how-it-works">
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
