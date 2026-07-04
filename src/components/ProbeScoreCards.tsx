'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, FileWarning, Shuffle, BookX, Target, MessageSquareOff } from 'lucide-react';
import styles from './ProbeScoreCards.module.css';

interface CategoryScore {
  category: string;
  total_probes: number;
  failed_probes: number;
}

const CATEGORY_MAP: Record<string, { label: string, icon: any, desc: string }> = {
  'hallucination': { label: 'Hallucination', icon: FileWarning, desc: 'Tendency to invent false facts' },
  'sycophancy': { label: 'Sycophancy', icon: MessageSquareOff, desc: 'Agreeing with unsafe user premises' },
  'consistency': { label: 'Consistency', icon: Shuffle, desc: 'Contradicting previous answers' },
  'refusal_drift': { label: 'Refusal Drift', icon: BookX, desc: 'Over-refusing benign requests' },
  'factual': { label: 'Factual Accuracy', icon: Target, desc: 'Degradation of core knowledge' }
};

export default function ProbeScoreCards({ data }: { data: CategoryScore[] }) {
  
  return (
    <div className={styles.container}>
      {data.map((item, idx) => {
        const config = CATEGORY_MAP[item.category] || { label: item.category, icon: Target, desc: '' };
        const Icon = config.icon;
        const passRate = item.total_probes === 0 ? 100 : Math.round(((item.total_probes - item.failed_probes) / item.total_probes) * 100);
        
        let statusClass = styles.nominal;
        let StatusIcon = ShieldCheck;
        
        if (passRate < 90) {
          statusClass = styles.watch;
          StatusIcon = ShieldAlert;
        }
        if (passRate < 70) {
          statusClass = styles.alert;
          StatusIcon = ShieldAlert;
        }
        if (passRate < 50) {
          statusClass = styles.critical;
          StatusIcon = ShieldAlert;
        }

        return (
          <motion.div 
            key={item.category}
            className={`${styles.card} ${statusClass}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <Icon size={24} />
              </div>
              <div className={styles.titleWrapper}>
                <h4 className={styles.title}>{config.label}</h4>
                <p className={styles.desc}>{config.desc}</p>
              </div>
            </div>
            
            <div className={styles.stats}>
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Pass Rate</span>
                <span className={styles.statValue}>{passRate}%</span>
              </div>
              <div className={styles.divider} />
              <div className={styles.statBox}>
                <span className={styles.statLabel}>Failed</span>
                <span className={styles.statValue}>{item.failed_probes}/{item.total_probes}</span>
              </div>
            </div>
            
            <div className={styles.footer}>
              <StatusIcon size={16} />
              <span>{passRate >= 90 ? 'Healthy' : 'Vulnerable'}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
