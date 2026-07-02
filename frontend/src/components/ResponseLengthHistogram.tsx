'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import styles from './ResponseLengthHistogram.module.css';

interface Bin {
  lengthRange: string;
  count: number;
}

export default function ResponseLengthHistogram({ data }: { data: Bin[] }) {
  return (
    <motion.div 
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Verbosity Distribution (Length)</h3>
        <p className={styles.subtitle}>Response character counts across current traffic</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis 
              dataKey="lengthRange" 
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
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--status-watch)' }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            />
            
            <Bar 
              dataKey="count" 
              name="Responses" 
              fill="var(--status-watch)" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
