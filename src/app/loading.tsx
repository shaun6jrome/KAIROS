import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      gap: '1rem',
      color: 'var(--text-muted)'
    }}>
      <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Loading KAIROS Telemetry...
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
