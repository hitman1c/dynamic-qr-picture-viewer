import { Link } from 'react-router-dom';
import Icon from './Icon';

interface CtaBandProps {
  title?: string;
  text?: string;
}

export default function CtaBand({
  title = 'Ready to put one code on everything?',
  text = 'Open the dashboard, publish a picture and download its QR code. Replace the picture later and every printed copy keeps working.',
}: CtaBandProps) {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="cta-band">
        <div className="cta-copy">
          <p className="section-eyebrow light">Get started</p>
          <h2 id="cta-heading">{title}</h2>
          <p>{text}</p>
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
