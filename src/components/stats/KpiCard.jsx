import styles from './KpiCard.module.css';
import StatCard from './StatCard';

export default function KpiCard({ title, value, sub, icon }) {
  return (
    <StatCard className={styles.kpiCard}>
      <div className={styles.row}>
        <div className={styles.left}>
          <div className={styles.label}>{title}</div>
          <div className={styles.value}>{value || '—'}</div>
          <div className={styles.sub}>{sub || 'Sin datos'}</div>
        </div>

        <div className={styles.icon} aria-hidden="true">
          {icon || ''}
        </div>
      </div>
    </StatCard>
  );
}
