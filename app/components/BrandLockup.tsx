import styles from "./BrandLockup.module.css";

type BrandLockupProps = {
  compact?: boolean;
};

export function BrandLockup({ compact = false }: BrandLockupProps) {
  return (
    <div className={`${styles.lockup} ${compact ? styles.compact : ""}`}>
      <div className={styles.mark} aria-hidden="true">
        <div className={styles.ring} />
        <svg className={styles.icon} viewBox="0 0 96 96" role="img">
          <defs>
            <linearGradient id="berimbauWood" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#d49b50" />
              <stop offset="45%" stopColor="#b96a31" />
              <stop offset="100%" stopColor="#6e3418" />
            </linearGradient>
          </defs>
          <circle cx="48" cy="48" r="45" fill="rgba(255,247,236,0.14)" stroke="rgba(226,196,154,0.32)" strokeWidth="1.5" />
          <path
            d="M29 74C49 58 62 38 71 14"
            fill="none"
            stroke="url(#berimbauWood)"
            strokeLinecap="round"
            strokeWidth="5.5"
          />
          <path
            d="M36 76C53 62 67 42 76 19"
            fill="none"
            stroke="#24150e"
            strokeDasharray="2 5"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
          <ellipse
            cx="36"
            cy="68"
            rx="12"
            ry="9.5"
            fill="#cf8740"
            stroke="#6e3418"
            strokeWidth="2.4"
            transform="rotate(-18 36 68)"
          />
          <circle cx="56" cy="44" r="4" fill="#24150e" />
          <path d="M59.5 41L74 31" fill="none" stroke="#24150e" strokeLinecap="round" strokeWidth="2.6" />
        </svg>
      </div>
      <div className={styles.copy}>
        <span className={styles.eyebrow}>Capoeira</span>
        <strong className={styles.title}>Capoeira em corpo e história</strong>
      </div>
    </div>
  );
}
