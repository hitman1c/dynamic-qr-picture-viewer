import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { prefersReducedMotion } from '../hooks/journey';

const RAIL_WIDTH = 72;
const MIN_VIEWPORT = 1360;
const SEGMENTS = 32;

function railPoint(t: number, height: number) {
  const mid = RAIL_WIDTH / 2;
  const amplitude = RAIL_WIDTH * 0.28;
  return {
    x: mid + Math.sin(t * Math.PI * 3) * amplitude,
    y: t * height,
  };
}

function railPath(height: number): string {
  let d = '';
  for (let i = 0; i <= SEGMENTS; i += 1) {
    const { x, y } = railPoint(i / SEGMENTS, height);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d.trim();
}

interface SnakeJourneyProps {
  rootRef: RefObject<HTMLElement | null>;
}

/**
 * A serpentine "journey" rail pinned in the left gutter. A glowing QR token
 * travels the curve as the visitor scrolls through the page, tying the
 * sections together. Hidden on narrow screens and for reduced-motion users.
 */
export default function SnakeJourney({ rootRef }: SnakeJourneyProps) {
  const [height, setHeight] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      setHeight(window.innerHeight);
      setEnabled(window.innerWidth >= MIN_VIEWPORT && !prefersReducedMotion());
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!enabled || height === 0) return;
    const root = rootRef.current;
    const path = pathRef.current;
    const token = tokenRef.current;
    if (!root || !path || !token) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      const point = railPoint(progress, height);
      token.style.transform = `translate3d(${(point.x - 17).toFixed(1)}px, ${(point.y - 17).toFixed(1)}px, 0)`;
      path.style.strokeDashoffset = String(1 - progress);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled, height, rootRef]);

  if (!enabled || height === 0) return null;

  return (
    <div className="snake-rail" aria-hidden="true">
      <svg
        className="snake-track"
        width={RAIL_WIDTH}
        height={height}
        viewBox={`0 0 ${RAIL_WIDTH} ${height}`}
        fill="none"
      >
        <defs>
          <linearGradient id="snakeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd23f" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#7aa2ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path
          className="snake-track-base"
          d={railPath(height)}
          stroke="rgba(29, 78, 216, 0.14)"
          strokeWidth="2"
        />
        <path
          ref={pathRef}
          d={railPath(height)}
          stroke="url(#snakeGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          className="snake-track-live"
        />
      </svg>

      <div className="snake-token" ref={tokenRef}>
        <span className="snake-token-glyph" />
      </div>
    </div>
  );
}
