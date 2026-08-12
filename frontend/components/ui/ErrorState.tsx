'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this section. Please try again.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-danger-soft text-danger flex items-center justify-center mb-4">
        <AlertTriangle size={30} />
      </div>
      <h3 className="text-lg font-semibold text-content mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="secondary" icon={RefreshCw} onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
