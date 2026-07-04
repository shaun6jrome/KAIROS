'use client';

import { motion } from 'framer-motion';
import { Sparkles, Terminal, ShieldAlert } from 'lucide-react';
import styles from './EventDetailPanel.module.css';

interface DriftEvent {
  id: number;
  timestamp: string;
  severity: string;
  drift_score: number;
  root_cause: string;
}

export default function EventDetailPanel({ event }: { event: DriftEvent | null }) {
  if (!event) {
    return (
      <div className={styles.emptyContainer}>
        <ShieldAlert size={48} className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>Select an Event</h3>
        <p className={styles.emptySubtitle}>Click a drift event from the timeline to view its AI-generated root cause analysis.</p>
      </div>
    );
  }

  const isCritical = event.severity === 'CRITICAL';

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      key={event.id}
    >
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Root Cause Analysis</h2>
          <div className={styles.meta}>
            <span className={styles.time}>{new Date(event.timestamp).toLocaleString()}</span>
            <span className={styles.id}>Event ID: #{event.id}</span>
          </div>
        </div>
        <div className={`${styles.badge} ${isCritical ? styles.critical : styles.alert}`}>
          {event.severity}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.scoreSection}>
          <div className={styles.scoreLabel}>Aggregate Drift Score</div>
          <div className={`${styles.scoreValue} ${isCritical ? styles.criticalText : styles.alertText}`}>
            {event.drift_score.toFixed(3)}
          </div>
        </div>

        <div className={styles.aiReport}>
          <div className={styles.aiHeader}>
            <Sparkles size={16} className={styles.aiIcon} />
            <h4>Gemini Diagnostic Report</h4>
          </div>
          <div className={styles.aiBody}>
            {event.root_cause.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className={styles.actionSection}>
          <h4>Recommended Action</h4>
          <div className={styles.terminal}>
            <Terminal size={14} className={styles.termIcon} />
            <code>
              {isCritical 
                ? 'Rollback model version to previous stable release immediately.'
                : 'Review prompt engineering constraints for verbosity.'
              }
            </code>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
