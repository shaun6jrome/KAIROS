import BaselineSettings from '@/components/BaselineSettings';
import WebhookSettings from '@/components/WebhookSettings';
import ProbeRunner from '@/components/ProbeRunner';
import styles from './page.module.css';

export default function SettingsPage() {
  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>System Settings</h1>
        <p className={styles.subtitle}>Configure KAIROS mathematical baselines, probe executions, and integrations.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <ProbeRunner />
        </div>

        <div className={styles.grid}>
          <BaselineSettings />
          <WebhookSettings />
        </div>
      </div>
    </div>
  );
}
