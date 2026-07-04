import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import styles from './StatusBadge.module.css';

type StatusLevel = 'NOMINAL' | 'WATCH' | 'ALERT' | 'CRITICAL';

export default function StatusBadge({ status }: { status: StatusLevel }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'NOMINAL':
        return { icon: ShieldCheck, colorClass: styles.nominal, label: 'Nominal' };
      case 'WATCH':
        return { icon: AlertCircle, colorClass: styles.watch, label: 'Watch' };
      case 'ALERT':
        return { icon: AlertTriangle, colorClass: styles.alert, label: 'Alert' };
      case 'CRITICAL':
        return { icon: ShieldAlert, colorClass: styles.critical, label: 'Critical' };
      default:
        return { icon: ShieldCheck, colorClass: styles.nominal, label: 'Nominal' };
    }
  };

  const { icon: Icon, colorClass, label } = getStatusConfig();

  return (
    <motion.div 
      className={`${styles.badge} ${colorClass}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.iconWrapper}>
        <Icon size={24} />
      </div>
      <div className={styles.info}>
        <span className={styles.label}>System Status</span>
        <span className={styles.value}>{label}</span>
      </div>
    </motion.div>
  );
}
