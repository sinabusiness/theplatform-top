import React, { useState, useEffect } from 'react';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error || new Error(event.message));
    };
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      setError(new Error(event.reason?.message || 'Promise rejected'));
    };
    window.addEventListener('error', handler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    return () => {
      window.removeEventListener('error', handler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: '2rem', background: '#0a0a0a', color: '#ef4444', minHeight: '100vh', fontFamily: 'monospace' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h1>
        <pre style={{ fontSize: '0.75rem', color: '#fca5a5', whiteSpace: 'pre-wrap' }}>
          {error.message}
          {'\n\n'}
          {error.stack}
        </pre>
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
}
