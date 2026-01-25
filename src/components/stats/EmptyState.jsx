import styles from './EmptyState.module.css';

export default function EmptyState({ text = 'Sin datos' }) {
  return <div className={styles.empty}>{text}</div>;
}
