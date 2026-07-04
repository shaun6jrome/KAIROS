'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import styles from './DriftChart.module.css';

interface DriftEvent {
  id: number;
  timestamp: string;
  severity: string;
  drift_score: number;
}

export default function DriftChart({ data }: { data: DriftEvent[] }) {
  // Reverse data so oldest is first for the chart
  const chartData = [...data].reverse().map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <motion.div 
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>Behavioral Drift Score</h3>
        <p className={styles.subtitle}>Aggregate semantic deviation from baseline</p>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
              domain={[0, 1.0]}
              tickFormatter={(val) => val.toFixed(1)}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-secondary)', 
                borderColor: 'var(--glass-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
              itemStyle={{ color: 'var(--status-nominal)' }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
            />
            
            {/* Threshold Lines */}
            <ReferenceLine y={0.3} stroke="var(--status-watch)" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine y={0.5} stroke="var(--status-alert)" strokeDasharray="3 3" strokeOpacity={0.5} />
            <ReferenceLine y={0.7} stroke="var(--status-critical)" strokeDasharray="3 3" strokeOpacity={0.5} />
            
            <Line 
              type="monotone" 
              dataKey="drift_score" 
              name="Drift Score"
              stroke="var(--status-nominal)" 
              strokeWidth={2}
              dot={{ fill: 'var(--status-nominal)', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#fff' }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
