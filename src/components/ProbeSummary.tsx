'use client';

import { motion } from 'framer-motion';
import { Target, MessageSquareOff, FileWarning, Shuffle, BookX } from 'lucide-react';
import styles from './ProbeSummary.module.css';

interface ProbeCategory {
  category: string;
  score: number;
}

const CATEGORY_MAP: Record<string, { label: string, icon: any }> = {
  'hallucination': { label: 'Hallucination', icon: FileWarning },
  'sycophancy': { label: 'Sycophancy', icon: MessageSquareOff },
  'consistency': { label: 'Consistency', icon: Shuffle },
  'refusal_drift': { label: 'Refusal Drift', icon: BookX },
  'factual': { label: 'Factual Accuracy', icon: Target }
};

export default function ProbeSummary({ data }: { data: ProbeCategory[] }) {
  
  // Calculate a pass rate based on the score (for demo purposes)
  const getPassRate = (score: number) => {
    // Score is 0-1 where 1 is perfect (no drift/hallucination).
    return Math.round(score * 100);
  };

  const getStatusColor = (passRate: number) => {
    if (passRate >= 90) return styles.nominal;
    if (passRate >= 70) return styles.watch;
    if (passRate >= 50) return styles.alert;
    return styles.critical;
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Probe Suite Summary</h3>
      <p className={styles.subtitle}>Red team vulnerability pass rates</p>
      
      <div className={styles.grid}>
        {data.map((item, idx) => {
          const config = CATEGORY_MAP[item.category] || { label: item.category, icon: Target };
          const Icon = config.icon;
          const passRate = getPassRate(item.score);
          const statusClass = getStatusColor(passRate);

          return (
            <motion.div 
              key={item.category}
              className={`${styles.card} ${statusClass}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <div className={styles.cardHeader}>
                <Icon size={18} className={styles.icon} />
                <span className={styles.categoryName}>{config.label}</span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.score}>{passRate}%</span>
                <span className={styles.label}>Pass Rate</span>
              </div>
              <div className={styles.progressBar}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${passRate}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
