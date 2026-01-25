import styles from './TooltipCard.module.css';

export default function TooltipCard({ title, lines = [] }) {
  return (
    <div className={styles.tooltip}>
      {title ? <div className={styles.title}>{title}</div> : null}
      {lines.map((line, idx) => (
        <div key={`${line}-${idx}`} className={styles.line}>{line}</div>
      ))}
    </div>
  );
}
