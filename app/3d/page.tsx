"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import styles from "../page.module.css";

type Slide = {
  assetId: string;
  title: string;
  description: string;
  file: string;
  position: string;
  rotation: string;
  scale: string;
};

const slides: Slide[] = [
  {
    assetId: "berimbau-model",
    title: "Berimbau",
    description:
      "O berimbau orienta o tempo da capoeira e ajuda a definir a energia do jogo dentro da roda.",
    file: "/models/berimbau.glb",
    position: "0 0.1 0",
    rotation: "0 90 0",
    scale: "0.35 0.35 0.35"
  },
  {
    assetId: "pandeiro-model",
    title: "Pandeiro Brasileiro",
    description:
      "O pandeiro conecta a capoeira a um campo mais amplo de musicalidades afro-brasileiras.",
    file: "/models/pandeiro_brasileiro.glb",
    position: "0 0.2 0",
    rotation: "90 0 0",
    scale: "0.9 0.9 0.9"
  }
];

export default function ThreeDPage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [markerVisible, setMarkerVisible] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(0);
  const [needsSecureContext, setNeedsSecureContext] = useState(false);

  const currentSlide = useMemo(() => slides[slideIndex], [slideIndex]);

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalHost =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

    setNeedsSecureContext(!window.isSecureContext && !isLocalHost);
  }, []);

  useEffect(() => {
    const hideOverlays = () => {
      document
        .querySelectorAll(".a-loader-title, .arjs-loader, .a-enter-vr")
        .forEach((node) => {
          if (node instanceof HTMLElement) {
            node.style.display = "none";
            node.style.opacity = "0";
            node.style.pointerEvents = "none";
          }
        });
    };

    const timer = window.setInterval(hideOverlays, 300);
    hideOverlays();

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (scriptsLoaded < 2) {
      return;
    }

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    const attachMarkerEvents = () => {
      if (cancelled || cleanup) {
        return;
      }

      const marker = document.getElementById("hiro-marker");

      if (!marker) {
        return;
      }

      const handleFound = () => setMarkerVisible(true);
      const handleLost = () => setMarkerVisible(false);

      marker.addEventListener("markerFound", handleFound);
      marker.addEventListener("markerLost", handleLost);

      if (marker.getAttribute("visible") === "true") {
        setMarkerVisible(true);
      }

      cleanup = () => {
        marker?.removeEventListener("markerFound", handleFound);
        marker?.removeEventListener("markerLost", handleLost);
      };
    };

    const poll = window.setInterval(() => {
      attachMarkerEvents();

      if (cleanup) {
        window.clearInterval(poll);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearInterval(poll);

      if (cleanup) {
        cleanup();
      }
    };
  }, [scriptsLoaded]);

  const moveSlide = (direction: -1 | 1) => {
    setSlideIndex((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <main className={styles.page}>
      <Script
        src="https://aframe.io/releases/1.6.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded((current) => current + 1)}
      />
      <Script
        src="https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.7/aframe/build/aframe-ar.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded((current) => current + 1)}
      />

      {needsSecureContext ? (
        <div className={styles.warning}>
          Abra por `https` no celular ou teste em `localhost` no mesmo dispositivo para liberar a
          camera.
        </div>
      ) : null}

      {scriptsLoaded >= 2 ? (
        <div className={styles.sceneWrap}>
          <a-scene
            embedded
            vr-mode-ui="enabled: false"
            renderer="alpha: true; antialias: true; precision: medium;"
            arjs="trackingMethod: best; sourceType: webcam; facingMode: environment; debugUIEnabled: false;"
          >
            <a-assets timeout="20000">
              {slides.map((slide) => (
                <a-asset-item key={slide.assetId} id={slide.assetId} src={slide.file} />
              ))}
            </a-assets>
            <a-marker id="hiro-marker" preset="hiro">
              <a-entity
                key={currentSlide.assetId}
                gltf-model={`#${currentSlide.assetId}`}
                position={currentSlide.position}
                rotation={currentSlide.rotation}
                scale={currentSlide.scale}
              />
            </a-marker>
            <a-entity camera />
          </a-scene>
        </div>
      ) : (
        <div className={styles.fallback}>
          <div className={styles.fallbackCard}>
            <h1>Abrindo a experiencia AR</h1>
            <p>Permita o uso da camera e aponte para o marcador Hiro para exibir o conteudo.</p>
          </div>
        </div>
      )}

      <div className={styles.status}>
        {markerVisible ? "Marcador Hiro detectado" : "Aponte a camera para o Hiro"}
      </div>

      {markerVisible ? (
        <section className={styles.modal} aria-live="polite">
          <div className={styles.meta}>
            <span className={styles.counter}>
              {slideIndex + 1}/{slides.length}
            </span>
            <span className={styles.tag}>Conteudo AR</span>
          </div>

          <div className={styles.content}>
            <h2>{currentSlide.title}</h2>
            <p>{currentSlide.description}</p>
          </div>

          <div className={styles.controls}>
            <button
              className={`${styles.button} ${styles.buttonSecondary}`}
              type="button"
              onClick={() => moveSlide(-1)}
              aria-label="Slide anterior"
            >
              ←
            </button>
            <button
              className={styles.button}
              type="button"
              onClick={() => moveSlide(1)}
              aria-label="Proximo slide"
            >
              →
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
