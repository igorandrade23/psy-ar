import { BrandLockup } from "./components/BrandLockup";
import styles from "./components/SiteLoader.module.css";

export default function Loading() {
  return (
    <div className={styles.overlay} aria-live="polite" aria-busy="true">
      <div className={styles.backdrop} />
      <div className={styles.content}>
        <BrandLockup />
        <div className={styles.loaderLine} aria-hidden="true">
          <span className={styles.loaderFill} />
        </div>
        <p className={styles.caption}>Carregando imagens, modelos e sons da roda.</p>
      </div>
    </div>
  );
}
