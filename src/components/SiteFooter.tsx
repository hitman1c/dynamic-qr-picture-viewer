import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="brand" aria-label="QR Picture Viewer home">
            <BrandMark />
            <span className="brand-name">QR Picture Viewer</span>
          </Link>
          <p className="footer-desc">
            One reusable QR code for the picture your customers need to see right now &mdash; menus,
            prices, promotions, hours and directions.
          </p>
          <Link to="/dashboard" className="btn btn-cta btn-sm">
            Get Started
          </Link>
        </div>

        <nav className="footer-col" aria-label="Explore the site">
          <h2>Explore</h2>
          <Link to="/#why">Why one code</Link>
          <Link to="/#features">Features</Link>
          <Link to="/#about">About the project</Link>
          <Link to="/#team">Meet the team</Link>
          <Link to="/#how-it-works">How it works</Link>
          <Link to="/#faq">FAQ</Link>
        </nav>

        <nav className="footer-col" aria-label="Owner links">
          <h2>For owners</h2>
          <Link to="/dashboard">Dashboard login</Link>
          <Link to="/#how-it-works">Publishing guide</Link>
          <Link to="/#faq">Common questions</Link>
          <a
            href="https://github.com/hitman1c/dynamic-qr-picture-viewer"
            target="_blank"
            rel="noreferrer"
          >
            Source code
          </a>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} QR Picture Viewer. All rights reserved.</p>
        <p>Built with React, TypeScript, Neon and Netlify.</p>
      </div>
    </footer>
  );
}
