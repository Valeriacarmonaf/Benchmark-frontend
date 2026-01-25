import styles from './StatCard.module.css';

export default function StatCard({ children, className = '' }) {
  return (
    <section className={`${styles.card} ${className}`}>
      {children}
    </section>
  );
}
