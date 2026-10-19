import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandMark from './BrandMark';
import { prefersReducedMotion } from '../hooks/journey';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'about', label: 'About' },
  { id: 'team', label: 'Team' },
  { id: 'faq', label: 'FAQ' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const linksRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const onHome = location.pathname === '/';

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    const place = () => {
      const link = linkRefs.current[active];
      const container = linksRef.current;
      const indicator = indicatorRef.current;
      if (!link || !container || !indicator) return;
      const containerBox = container.getBoundingClientRect();
      const linkBox = link.getBoundingClientRect();
      indicator.style.width = `${linkBox.width + 18}px`;
      indicator.style.transform = `translateX(${linkBox.left - containerBox.left - 9}px)`;
      indicator.style.opacity = '1';
    };
    const frame = requestAnimationFrame(place);
    window.addEventListener('resize', place);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', place);
    };
  }, [active, scrolled, open]);

  const goToSection = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      setOpen(false);
      if (onHome) {
        document
          .getElementById(id)
          ?.scrollIntoView({
            behavior: prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start',
          });
      } else {
        navigate(`/#${id}`);
      }
    },
    [onHome, navigate],
  );

  const goHome = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (onHome) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
      setOpen(false);
    },
    [onHome],
  );

  return (
    <header className={`glass-nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="glass-nav-inner">
        <Link to="/" className="brand" aria-label="QR Picture Viewer home" onClick={goHome}>
          <BrandMark />
          <span className="brand-name">QR Picture Viewer</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={open ? 'nav-toggle-icon is-open' : 'nav-toggle-icon'} aria-hidden="true" />
        </button>

        <nav id="site-nav" className="glass-nav-panel" aria-label="Main">
          <div className="nav-links" ref={linksRef}>
            <span className="nav-indicator" ref={indicatorRef} aria-hidden="true" />
            {sections.map((section) => (
              <a
                key={section.id}
                href={`/#${section.id}`}
                ref={(element) => {
                  linkRefs.current[section.id] = element;
                }}
                className={active === section.id ? 'nav-link is-active' : 'nav-link'}
                aria-current={active === section.id ? 'true' : undefined}
                onClick={(event) => goToSection(event, section.id)}
              >
                {section.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <Link className="nav-login" to="/dashboard">
              Login
            </Link>
            <Link className="btn btn-cta btn-nav" to="/dashboard">
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
