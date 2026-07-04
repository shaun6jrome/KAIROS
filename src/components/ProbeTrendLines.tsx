'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import styles from './ProbeTrendLines.module.css';

interface TrendData {
  date: string;
  hallucination: number;
  sycophancy: number;
  consistency: number;
  refusal_drift: number;
  factual: number;
}

export default function ProbeTrendLines({ data }: { data: TrendData[] }) {
  return (
    <motion.div 
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Vulnerability Trends over Time</h3>
        <p className={styles.subtitle}>Daily probe pass rates by category (%)</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="var(--text-muted)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            <Line type="monotone" dataKey="hallucination" name="Hallucination" stroke="#ef4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="sycophancy" name="Sycophancy" stroke="#f59e0b" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="consistency" name="Consistency" stroke="#10b981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="refusal_drift" name="Refusal Drift" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="factual" name="Factual Accuracy" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
