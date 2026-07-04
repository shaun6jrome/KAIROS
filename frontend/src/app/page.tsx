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
    async function fetchData() {
      try {
        const [overviewRes, driftRes, alertsRes, probeRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/dashboard/overview`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/dashboard/drift-history`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/dashboard/alerts`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/dashboard/probe-summary`)
        ]);

        const overview = await overviewRes.json();
        const driftHistory = await driftRes.json();
        const alerts = await alertsRes.json();
        const probeSummary = await probeRes.json();

        setData({
          overview,
          driftHistory: driftHistory.reverse(), // Show chronologically
          alerts,
          probeSummary
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    }
    
    fetchData();
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
