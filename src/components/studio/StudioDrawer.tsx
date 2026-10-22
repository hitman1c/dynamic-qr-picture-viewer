import { useEffect, useRef, type ReactNode } from 'react';
import { IconClose } from './icons';

interface StudioDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function StudioDrawer({ open, title, onClose, children }: StudioDrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      restoreRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="studio-layer">
      <button
        type="button"
        className="studio-scrim"
        aria-label={`Close ${title}`}
        onClick={onClose}
      />
      <section className="studio-drawer" role="dialog" aria-modal="true" aria-label={title}>
        <header className="studio-drawer-head">
          <h2>{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className="studio-icon-btn"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            <IconClose />
          </button>
        </header>
        <div className="studio-drawer-body">{children}</div>
      </section>
    </div>
  );
}
