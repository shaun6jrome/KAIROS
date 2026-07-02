'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Search } from 'lucide-react';
import styles from './ProbeResultsTable.module.css';

interface ProbeResult {
  id: number;
  timestamp: string;
  category: string;
  prompt: string;
  response: string;
  passed: boolean;
}

export default function ProbeResultsTable({ data }: { data: ProbeResult[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h3 className={styles.title}>Individual Probe Results</h3>
          <p className={styles.subtitle}>Detailed log of recent red team executions</p>
        </div>
        
        <div className={styles.search}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search prompts..." className={styles.searchInput} />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Category</th>
              <th>Prompt</th>
              <th>Response Snippet</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <motion.tr 
                key={row.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className={styles.row}
              >
                <td>
                  {row.passed ? (
                    <div className={`${styles.badge} ${styles.passed}`}>
                      <CheckCircle2 size={14} /> Pass
                    </div>
                  ) : (
                    <div className={`${styles.badge} ${styles.failed}`}>
                      <XCircle size={14} /> Fail
                    </div>
                  )}
                </td>
                <td>
                  <span className={styles.category}>{row.category}</span>
                </td>
                <td className={styles.textCell}>
                  <span className={styles.truncate} title={row.prompt}>{row.prompt}</span>
                </td>
                <td className={styles.textCell}>
                  <span className={styles.truncate} title={row.response}>{row.response}</span>
                </td>
                <td className={styles.timeCell}>
                  {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
