'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import styles from './ActiveAlerts.module.css';

interface Alert {
  id: number;
  timestamp: string;
  message: string;
  is_resolved: boolean;
}

export default function ActiveAlerts({ alerts }: { alerts: Alert[] }) {
  const activeAlerts = alerts.filter(a => !a.is_resolved);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <AlertTriangle className={styles.icon} size={20} />
          <h3 className={styles.title}>Active Alerts</h3>
        </div>
        <span className={styles.count}>{activeAlerts.length}</span>
      </div>

      <div className={styles.list}>
        {activeAlerts.length === 0 ? (
          <div className={styles.emptyState}>
            <CheckCircle size={32} className={styles.emptyIcon} />
            <p>No active alerts</p>
          </div>
        ) : (
          activeAlerts.map((alert, idx) => {
            const timeStr = new Date(alert.timestamp).toLocaleString();
            return (
              <motion.div 
                key={alert.id}
                className={styles.alertCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <div className={styles.indicator} />
                <div className={styles.content}>
                  <p className={styles.message}>{alert.message}</p>
                  <div className={styles.meta}>
                    <Clock size={12} />
                    <span>{timeStr}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
