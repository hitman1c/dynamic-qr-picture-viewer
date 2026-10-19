import { useEffect, type CSSProperties, type RefObject } from 'react';

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Stagger delay for a `.reveal` element. */
export function revealDelay(ms: number): CSSProperties {
  return { '--reveal-delay': `${ms}ms` } as CSSProperties;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Drives the scroll-linked journey variables for a page:
 *  - `--journey-progress` (0..1) on the root, for whole-page effects.
 *  - `--p` (0..1) on every `[data-progress]` element, for local parallax.
 * A single rAF-batched passive listener keeps this cheap.
 */
export function useJourneyScroll(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      root.style.setProperty('--journey-progress', clamp(-rect.top / total).toFixed(4));

      root.querySelectorAll<HTMLElement>('[data-progress]').forEach((element) => {
        const box = element.getBoundingClientRect();
        element.style.setProperty('--p', clamp(-box.top / Math.max(1, box.height)).toFixed(4));
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    if (prefersReducedMotion()) return;

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rootRef]);
}

/**
 * Reveals every `.reveal` element inside the root as it enters the viewport.
 * Elements are hidden by CSS only when motion is allowed, so reduced-motion
 * and no-JS users always see the content.
 */
export function useRevealScope(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      items.forEach((element) => element.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    );

    items.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [rootRef]);
}
