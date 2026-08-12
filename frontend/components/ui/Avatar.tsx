'use client';

import { cn } from '@/lib/utils/cn';

const SIZES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
} as const;

export function Avatar({
  initials,
  src,
  size = 'md',
  className,
  ring = false,
}: {
  initials: string;
  src?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold overflow-hidden flex-shrink-0 select-none',
        'bg-gradient-to-br from-brand to-brand-700 text-white',
        ring && 'ring-2 ring-brand/30 ring-offset-2 ring-offset-surface',
        SIZES[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={initials} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export default Avatar;
