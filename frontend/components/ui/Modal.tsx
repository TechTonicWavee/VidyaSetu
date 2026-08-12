'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';

const WIDTHS = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
} as const;

export default function Modal({
  onClose,
  title,
  width = 'md',
  children,
  footer,
}: {
  onClose: () => void;
  title: string;
  width?: keyof typeof WIDTHS;
  children: ReactNode;
  footer?: ReactNode;
}) {
  // Portal to document.body so the overlay is always positioned relative to
  // the real viewport — never clipped or mis-centered by an ancestor's
  // scroll position or stacking context.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-surface rounded-2xl shadow-2xl w-full ${WIDTHS[width]} max-h-[90vh] flex flex-col overflow-hidden animate-scale-in border border-line`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-line flex-shrink-0">
          <h2 className="font-bold text-lg text-content">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="text-muted hover:text-content transition">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto text-content-2">{children}</div>

        {footer && <div className="px-6 py-4 border-t border-line bg-surface-2 flex-shrink-0">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
