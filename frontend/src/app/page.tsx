'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/StatusBadge';
import DriftChart from '@/components/DriftChart';
import ActiveAlerts from '@/components/ActiveAlerts';
import ProbeSummary from '@/components/ProbeSummary';
import styles from './page.module.css';

export default function Home() {
  const [data, setData] = useState<{
    overview: any;
    driftHistory: any[];
    alerts: any[];
    probeSummary: any[];
  } | null>(null);

  useEffect(() => {
    // In a real app, these would be fetched from the FastAPI backend.
    // We mock the data here for the UI demo based on the requirements.
    const mockData = {
      overview: { status: 'WATCH', active_alerts: 2 },
      driftHistory: Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        severity: Math.random() > 0.8 ? 'ALERT' : 'NOMINAL',
        drift_score: Math.random() * 0.4 + 0.1
      })),
      alerts: [
        { id: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), message: '[WATCH] Model hallucination rate increased', is_resolved: false },
        { id: 2, timestamp: new Date(Date.now() - 7200000).toISOString(), message: '[ALERT] Cosine similarity drift detected', is_resolved: false }
      ],
      probeSummary: [
        { category: 'hallucination', score: 0.85 },
        { category: 'sycophancy', score: 0.92 },
        { category: 'consistency', score: 0.78 },
        { category: 'refusal_drift', score: 0.95 },
        { category: 'factual', score: 0.88 }
      ]
    };
    
    setData(mockData);
  }, []);

  if (!data) return null;

  return (
    <div className="container">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>System Overview</h1>
          <p className={styles.subtitle}>Real-time behavioral monitoring</p>
        </div>
        <StatusBadge status={data.overview.status} />
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <DriftChart data={data.driftHistory} />
          <ProbeSummary data={data.probeSummary} />
        </div>
        <div className={styles.sideCol}>
          <ActiveAlerts alerts={data.alerts} />
        </div>
      </div>
    </div>
  );
}
