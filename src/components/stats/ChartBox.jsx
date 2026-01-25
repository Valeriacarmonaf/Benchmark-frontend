import styles from './ChartBox.module.css';

export default function ChartBox({ height = 240, children }) {
  return (
    <div className={styles.box} style={{ height }}>
      {children}
    </div>
  );
}
