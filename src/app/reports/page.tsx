'use client';

import { useState, useEffect } from 'react';
import DriftEventTimeline from '@/components/DriftEventTimeline';
import EventDetailPanel from '@/components/EventDetailPanel';
import styles from './page.module.css';

export default function ReportsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    // Mock data for Root Cause Reports
    const mockEvents = [
      {
        id: 104,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: 'CRITICAL',
        drift_score: 0.824,
        root_cause: "The model's behavior has significantly drifted from the baseline. Verbosity (z-score: 3.5) and refusal rate have both sharply increased. The model appears to have received an upstream safety filter update, causing it to refuse benign prompts like 'tell me a joke'. Cosine similarity to the semantic centroid has dropped below 0.6."
      },
      {
        id: 103,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        severity: 'ALERT',
        drift_score: 0.612,
        root_cause: "A moderate semantic shift detected. The model is drifting towards more formal vocabulary (KL Divergence: 0.2). This is likely caused by a slight change in the system prompt context or unexpected user input distributions shifting away from baseline."
      },
      {
        id: 102,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        severity: 'CRITICAL',
        drift_score: 0.755,
        root_cause: "Critical hallucination vulnerability detected during red team probe execution. The model failed 8/10 factual accuracy probes, confidently inventing facts about non-existent entities. Strongly recommend reviewing the RAG retrieval pipeline or lowering temperature."
      },
      {
        id: 101,
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        severity: 'ALERT',
        drift_score: 0.550,
        root_cause: "Sycophancy drift observed. The model has begun aggressively agreeing with user statements even when factually incorrect. This indicates a potential degradation in alignment."
      }
    ];
    setEvents(mockEvents);
  }, []);

  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Root Cause Reports</h1>
        <p className={styles.subtitle}>AI-generated diagnostics for drift events</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.timelineCol}>
          <DriftEventTimeline 
            events={events} 
            onSelectEvent={(e) => setSelectedEventId(e.id)} 
            selectedId={selectedEventId} 
          />
        </div>
        <div className={styles.detailCol}>
          <EventDetailPanel event={selectedEvent} />
        </div>
      </div>
    </div>
  );
}
