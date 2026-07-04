'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import styles from './CosineSimilarityChart.module.css';

interface DataPoint {
  time: string;
  similarity: number;
}

export default function CosineSimilarityChart({ data }: { data: DataPoint[] }) {
  return (
    <motion.div 
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Semantic Similarity (Cosine)</h3>
        <p className={styles.subtitle}>Distance from baseline centroid (1.0 = identical)</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              domain={[0.5, 1.0]}
              tickFormatter={(val) => val.toFixed(2)}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: '#3b82f6' }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            />
            
            <ReferenceLine y={0.85} stroke="var(--status-watch)" strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'insideTopLeft', value: 'Watch', fill: 'var(--status-watch)', fontSize: 12 }} />
            <ReferenceLine y={0.70} stroke="var(--status-alert)" strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'insideTopLeft', value: 'Alert', fill: 'var(--status-alert)', fontSize: 12 }} />
            
            <Line 
              type="monotone" 
              dataKey="similarity" 
              name="Cosine Similarity"
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#fff' }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
