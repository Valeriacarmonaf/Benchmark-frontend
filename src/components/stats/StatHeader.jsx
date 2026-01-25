import styles from './StatHeader.module.css';

export default function StatHeader({ title, description, icon }) {
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        {icon ? <span className={styles.icon} aria-hidden="true">{icon}</span> : null}
        <h3 className={styles.title}>{title}</h3>
      </div>

      {description ? <p className={styles.desc}>{description}</p> : null}
    </header>
  );
}
