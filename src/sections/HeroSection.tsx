import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Icon from '../components/Icon';
import PhoneInHand from '../components/PhoneInHand';
import { revealDelay } from '../hooks/journey';
import { demoViewUrl } from '../site/demo';

const DEMO_URL = demoViewUrl();

export default function HeroSection() {
  return (
    <section className="hero premium-hero" id="home" data-progress aria-labelledby="hero-heading">
      <span className="premium-hero-aurora" aria-hidden="true" />
      <span className="premium-hero-grid" aria-hidden="true" />
      <span className="premium-hero-vignette" aria-hidden="true" />

      <div className="premium-hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow reveal" data-from="up">
            Dynamic QR Picture Viewer
          </p>
          <h1 id="hero-heading" className="reveal" data-from="up" style={revealDelay(70)}>
            Your picture.
            <br />
            Your code.
            <br />
            Your control.
          </h1>
          <p className="hero-lead reveal" data-from="up" style={revealDelay(150)}>
            Share menus, promotions, price lists and more. Update the picture whenever you need to,
            while the QR code people already scanned keeps working.
          </p>

          <div className="hero-cta-row reveal" data-from="up" style={revealDelay(220)}>
            <Link className="hero-start" to="/dashboard">
              Get Started
              <Icon name="arrow-right" />
            </Link>
            <span className="hero-cta-note">
              <span className="hero-cta-dot" aria-hidden="true" />
              One permanent code
            </span>
          </div>

          <div className="hero-qr-block reveal" data-from="up" style={revealDelay(300)}>
            <div className="hero-qr-card">
              <QRCodeCanvas
                value={DEMO_URL}
                size={142}
                level="M"
                marginSize={2}
                bgColor="#ffffff"
                fgColor="#0b1626"
              />
            </div>
            <div className="hero-qr-meta">
              <p className="hero-qr-caption">Scan to see how it works</p>
              <p className="hero-qr-sub">Opens the live FREE WIFI demo picture</p>
              <p className="hero-scan-tag">SCAN. VIEW. UPDATE.</p>
            </div>
          </div>
        </div>

        <div className="hero-device reveal" data-from="scale" style={revealDelay(220)}>
          <PhoneInHand />
        </div>
      </div>

      <a className="premium-scroll-cue" href="#why" aria-label="Scroll to why QR Picture Viewer">
        <span className="premium-scroll-line" aria-hidden="true" />
        <span>Why one code is enough</span>
        <Icon name="arrow-down" />
      </a>
    </section>
  );
}
