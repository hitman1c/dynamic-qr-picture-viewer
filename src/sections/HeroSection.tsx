import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import PhoneMockup from '../components/PhoneMockup';
import { revealDelay } from '../hooks/journey';

export default function HeroSection() {
  return (
    <section className="hero" id="home" data-progress aria-labelledby="hero-heading">
      <div className="hero-shapes" aria-hidden="true">
        <span className="shape shape-ring" />
        <span className="shape shape-circle" />
        <span className="shape shape-square" />
        <span className="shape shape-dots" />
        <span className="shape shape-blob" />
        <span className="float-chip float-chip-a" />
        <span className="float-chip float-chip-b" />
        <span className="float-tile" />
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-eyebrow reveal" data-from="up">
            One QR code. Always up to date.
          </p>
          <h1 id="hero-heading" className="reveal" data-from="up" style={revealDelay(80)}>
            Show your pictures, not just information.
          </h1>
          <p className="hero-lead reveal" data-from="up" style={revealDelay(160)}>
            Print one QR code and update the picture it displays whenever you need to. Perfect for
            menus, promotions, directions, price lists and more.
          </p>
          <div className="hero-actions reveal" data-from="up" style={revealDelay(240)}>
            <Link className="btn btn-cta" to="/dashboard">
              Get Started
              <Icon name="arrow-right" />
            </Link>
            <Link className="btn btn-outline-light" to="/#how-it-works">
              See How It Works
              <Icon name="arrow-down" />
            </Link>
          </div>
          <dl className="hero-facts reveal" data-from="up" style={revealDelay(320)}>
            <div>
              <dt>No app</dt>
              <dd>for customers</dd>
            </div>
            <div>
              <dt>1 code</dt>
              <dd>per picture</dd>
            </div>
            <div>
              <dt>0 reprints</dt>
              <dd>when things change</dd>
            </div>
          </dl>
          <Link className="scroll-cue" to="/#features" aria-label="Scroll to the features section">
            <Icon name="arrow-down" />
          </Link>
        </div>

        <div className="hero-visual reveal" data-from="scale" style={revealDelay(180)}>
          <PhoneMockup />
        </div>
      </div>

      <div className="hero-diagonal" aria-hidden="true" />
    </section>
  );
}
