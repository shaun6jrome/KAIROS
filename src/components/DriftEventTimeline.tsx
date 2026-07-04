'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Clock } from 'lucide-react';
import styles from './DriftEventTimeline.module.css';

interface DriftEvent {
  id: number;
  timestamp: string;
  severity: string;
  drift_score: number;
  root_cause: string;
}

export default function DriftEventTimeline({ events, onSelectEvent, selectedId }: { events: DriftEvent[], onSelectEvent: (e: DriftEvent) => void, selectedId: number | null }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Drift Event Timeline</h3>
        <p className={styles.subtitle}>Recent anomaly detections</p>
      </div>
      
      <div className={styles.timeline}>
        {events.map((event, idx) => {
          const isSelected = selectedId === event.id;
          const isCritical = event.severity === 'CRITICAL';
          const Icon = isCritical ? ShieldAlert : AlertTriangle;
          
          return (
            <motion.div 
              key={event.id}
              className={`${styles.eventCard} ${isSelected ? styles.selected : ''} ${isCritical ? styles.criticalBorder : styles.alertBorder}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              onClick={() => onSelectEvent(event)}
            >
              <div className={styles.eventHeader}>
                <div className={`${styles.iconWrapper} ${isCritical ? styles.criticalIcon : styles.alertIcon}`}>
                  <Icon size={16} />
                </div>
                <span className={styles.severity}>{event.severity}</span>
                <span className={styles.scoreBadge}>Score: {event.drift_score.toFixed(2)}</span>
              </div>
              
              <p className={styles.rootCauseSnippet}>
                {event.root_cause.substring(0, 80)}...
              </p>
              
              <div className={styles.eventFooter}>
                <Clock size={12} />
                <span>{new Date(event.timestamp).toLocaleString()}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
