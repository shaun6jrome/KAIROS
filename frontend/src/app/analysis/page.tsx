'use client';

import { useEffect, useState } from 'react';
import CosineSimilarityChart from '@/components/CosineSimilarityChart';
import ResponseLengthHistogram from '@/components/ResponseLengthHistogram';
import ToneDriftChart from '@/components/ToneDriftChart';
import styles from './page.module.css';

export default function AnalysisPage() {
  const [data, setData] = useState<{
    similarityData: any[];
    lengthData: any[];
    toneData: any[];
  } | null>(null);

  useEffect(() => {
    // Mock data for the Behavioral Analysis UI
    const mockData = {
      similarityData: Array.from({ length: 24 }).map((_, i) => ({
        time: new Date(Date.now() - (24 - i) * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        similarity: Math.max(0.6, 0.95 - Math.random() * 0.15 - (i > 15 ? 0.1 : 0)) // Show a dip in recent hours
      })),
      lengthData: [
        { lengthRange: '0-50', count: 120 },
        { lengthRange: '51-100', count: 340 },
        { lengthRange: '101-200', count: 450 },
        { lengthRange: '201-300', count: 210 },
        { lengthRange: '301-500', count: 95 },
        { lengthRange: '501+', count: 42 }
      ],
      toneData: Array.from({ length: 24 }).map((_, i) => ({
        time: new Date(Date.now() - (24 - i) * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        kl_divergence: Math.max(0, 0.1 + Math.random() * 0.1 + (i > 18 ? 0.2 : 0)) // Show a spike in recent hours
      }))
    };
    
    setData(mockData);
  }, []);

  if (!data) return null;

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Behavioral Analysis</h1>
        <p className={styles.subtitle}>Deep dive into semantic metrics and distribution shifts</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.fullWidth}>
          <CosineSimilarityChart data={data.similarityData} />
        </div>
        <div className={styles.halfWidth}>
          <ResponseLengthHistogram data={data.lengthData} />
        </div>
        <div className={styles.halfWidth}>
          <ToneDriftChart data={data.toneData} />
        </div>
      </div>
    </div>
  );
}
