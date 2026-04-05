"use client";

import { useEffect, useMemo, useState } from "react";
import { BrandLockup } from "./BrandLockup";
import styles from "./SiteLoader.module.css";

const MIN_VISIBLE_MS = 1100;

export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const startTime = useMemo(() => Date.now(), []);

  useEffect(() => {
    let timeoutId: number | null = null;

    const finish = () => {
      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

      timeoutId = window.setTimeout(() => {
        setClosing(true);
        window.setTimeout(() => setVisible(false), 360);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener("load", finish);
    };
  }, [startTime]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`} aria-live="polite" aria-busy="true">
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
