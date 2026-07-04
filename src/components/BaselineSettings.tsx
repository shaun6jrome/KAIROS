'use client';

import { useState } from 'react';
import { Settings2, Save } from 'lucide-react';
import styles from './BaselineSettings.module.css';

export default function BaselineSettings() {
  const [similarityThreshold, setSimilarityThreshold] = useState('0.75');
  const [verbositySensitivity, setVerbositySensitivity] = useState('2.5');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would POST to the FastAPI backend
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Settings2 className={styles.icon} size={20} />
          <h3 className={styles.title}>Baseline Drift Thresholds</h3>
        </div>
        <p className={styles.subtitle}>Configure the sensitivity of the math engine.</p>
      </div>

      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label>
            Cosine Similarity Minimum Threshold
            <span className={styles.tooltip}>Alerts if semantic distance drops below this.</span>
          </label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            max="1" 
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label>
            Verbosity Z-Score Sensitivity
            <span className={styles.tooltip}>Alerts if length deviates by this many standard deviations.</span>
          </label>
          <input 
            type="number" 
            step="0.1" 
            min="0.1" 
            max="5" 
            value={verbositySensitivity}
            onChange={(e) => setVerbositySensitivity(e.target.value)}
            className={styles.input}
          />
        </div>

        <button onClick={handleSave} className={`${styles.button} ${saved ? styles.saved : ''}`}>
          <Save size={16} />
          {saved ? 'Saved!' : 'Update Thresholds'}
        </button>
      </div>
    </div>
  );
}
