'use client';

import { useState } from 'react';
import { Webhook, Save } from 'lucide-react';
import styles from './WebhookSettings.module.css';

export default function WebhookSettings() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [enabled, setEnabled] = useState(true);
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
          <Webhook className={styles.icon} size={20} />
          <h3 className={styles.title}>Alert Integrations</h3>
        </div>
        <p className={styles.subtitle}>Configure where KAIROS sends drift and probe alerts.</p>
      </div>

      <div className={styles.form}>
        <div className={styles.toggleGroup}>
          <label className={styles.toggleLabel}>
            <input 
              type="checkbox" 
              checked={enabled} 
              onChange={(e) => setEnabled(e.target.checked)} 
              className={styles.toggleInput}
            />
            <span className={styles.toggleText}>Enable Webhook Alerts</span>
          </label>
        </div>

        <div className={styles.formGroup}>
          <label>
            Slack/Discord Webhook URL
          </label>
          <input 
            type="url" 
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            disabled={!enabled}
            className={`${styles.input} ${!enabled ? styles.disabled : ''}`}
          />
        </div>

        <button onClick={handleSave} className={`${styles.button} ${saved ? styles.saved : ''}`}>
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Integration'}
        </button>
      </div>
    </div>
  );
}
