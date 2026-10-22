import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandMark from './BrandMark';
import Icon from './Icon';
import { prefersReducedMotion } from '../hooks/journey';

const sections = [
  { id: 'why', label: 'Why' },
  { id: 'how-it-works', label: 'How' },
  { id: 'features', label: 'Features' },
];

const secondaryLinks = [
  { id: 'about', label: 'About', hint: 'The project' },
  { id: 'team', label: 'Team', hint: 'Who built it' },
  { id: 'faq', label: 'FAQ', hint: 'Common questions' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const secondaryRef = useRef<HTMLDivElement>(null);

  const onHome = location.pathname === '/';

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!secondaryRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!onHome) return;
    const ids = ['home', ...sections.map((section) => section.id)];
    const elements = ids
      .map((id) => document.getElementById(id))
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

  const scrollTo = useCallback(
    (id: string) => {
      setOpen(false);
      setMenuOpen(false);
      if (onHome) {
        document.getElementById(id)?.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start',
        });
      } else {
        navigate(`/#${id}`);
      }
    },
    [onHome, navigate],
  );

  const goToSection = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      scrollTo(id);
    },
    [scrollTo],
  );

  const goHome = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (onHome) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
      setOpen(false);
      setMenuOpen(false);
    },
    [onHome],
  );

  return (
    <header className={`glass-nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="glass-nav-inner">
        <Link to="/" className="brand" aria-label="QR Picture Viewer home" onClick={goHome}>
          <BrandMark variant="royal" />
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
          <div className="nav-links">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`/#${section.id}`}
                className={active === section.id ? 'nav-link is-active' : 'nav-link'}
                aria-current={active === section.id ? 'true' : undefined}
                onClick={(event) => goToSection(event, section.id)}
              >
                {section.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <div className="nav-secondary" ref={secondaryRef}>
              <button
                type="button"
                className={menuOpen ? 'nav-menu-btn is-open' : 'nav-menu-btn'}
                aria-expanded={menuOpen}
                aria-controls="secondary-nav"
                aria-label="More pages"
                onClick={() => setMenuOpen((value) => !value)}
              >
                <Icon name="menu" />
              </button>
              {menuOpen && (
                <div className="nav-menu" id="secondary-nav">
                  {secondaryLinks.map((link) => (
                    <a
                      key={link.id}
                      href={`/#${link.id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollTo(link.id);
                      }}
                    >
                      <span>{link.label}</span>
                      <small>{link.hint}</small>
                    </a>
                  ))}
                  <Link to="/dashboard" className="nav-menu-login">
                    Owner login
                  </Link>
                </div>
              )}
            </div>

            <Link className="btn btn-cta btn-nav" to="/dashboard">
              Get Started
            </Link>
          </div>

          <div className="nav-mobile-extra">
            {secondaryLinks.map((link) => (
              <a
                key={link.id}
                href={`/#${link.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollTo(link.id);
                }}
              >
                {link.label}
              </a>
            ))}
            <Link to="/dashboard">Login</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
