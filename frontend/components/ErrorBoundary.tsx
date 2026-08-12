'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './ui/ErrorState';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors in its subtree so one broken page/widget never
 * blanks the whole portal. Renders a friendly ErrorState with a reset action.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorState onRetry={this.reset} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
