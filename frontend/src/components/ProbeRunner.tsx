'use client';

import { useState } from 'react';
import { Play, Loader2, CheckCircle2 } from 'lucide-react';
import styles from './ProbeRunner.module.css';

export default function ProbeRunner() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success'>('idle');

  const handleRun = () => {
    setStatus('running');
    // In a real app, this would trigger the FastAPI backend probe runner manually
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 4000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textWrapper}>
          <h3 className={styles.title}>Manual Probe Execution</h3>
          <p className={styles.subtitle}>Trigger the Red Team probe suite immediately to stress-test the model.</p>
        </div>

        <button 
          onClick={handleRun} 
          disabled={status !== 'idle'}
          className={`${styles.button} ${status === 'success' ? styles.success : ''}`}
        >
          {status === 'idle' && (
            <>
              <Play size={16} />
              Run Probe Suite Now
            </>
          )}
          {status === 'running' && (
            <>
              <Loader2 size={16} className={styles.spin} />
              Executing Probes...
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 size={16} />
              Execution Complete
            </>
          )}
        </button>
      </div>
    </div>
  );
}
