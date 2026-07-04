'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import styles from './ToneDriftChart.module.css';

interface ToneData {
  time: string;
  kl_divergence: number;
}

export default function ToneDriftChart({ data }: { data: ToneData[] }) {
  return (
    <motion.div 
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Distribution Shift (KL Divergence)</h3>
        <p className={styles.subtitle}>Measures vocabulary & tone shift (higher = worse)</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorKl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--status-critical)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--status-critical)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
            <XAxis 
              dataKey="time" 
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
              contentStyle={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--status-critical)' }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            />
            
            <Area 
              type="monotone" 
              dataKey="kl_divergence" 
              name="KL Divergence"
              stroke="var(--status-critical)" 
              fillOpacity={1} 
              fill="url(#colorKl)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
