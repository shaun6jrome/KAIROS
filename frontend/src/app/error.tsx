'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('KAIROS UI Error:', error);
  }, [error]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      gap: '1.5rem',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(239, 68, 68, 0.1)',
        padding: '1.5rem',
        borderRadius: '50%',
        color: 'var(--status-critical)'
      }}>
        <AlertTriangle size={48} />
      </div>
      
      <div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Telemetry Desync
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
          We encountered an error while trying to render this dashboard view.
        </p>
      </div>

      <button
        onClick={() => reset()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--text-primary)',
          color: 'var(--bg-primary)',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer'
        }}
      >
        <RefreshCcw size={16} />
        Attempt Recovery
      </button>
    </div>
  );
}
