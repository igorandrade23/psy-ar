"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import styles from "./page.module.css";

type Slide = {
  assetId: string;
  title: string;
  description: string;
  image: string;
};

const slides: Slide[] = [
  {
    assetId: "slide-equipe",
    title: "Nossa equipe",
    description: "Foto principal da equipe",
    image: "/images/equipe.png"
  },
  {
    assetId: "slide-casa-branca",
    title: "Casa Branca do Engenho Velho",
    description:
      "Um dos terreiros de candomble mais antigos em atividade no Brasil, ligado a consolidacao urbana dos cultos afro-brasileiros no seculo XIX em Salvador.",
    image: "/images/casa-branca-engenho-velho.jpg"
  },
  {
    assetId: "slide-jaua",
    title: "Terreiro de Jaua",
    description:
      "Os terreiros se tornaram espacos de resistencia cultural, onde rituais, memorias e formas de organizacao comunitaria foram preservados apesar da repressao historica.",
    image: "/images/terreiro-do-jaua.jpg"
  },
  {
    assetId: "slide-afonja",
    title: "Ile Opo Afonja",
    description:
      "Tradicoes de matriz ioruba e jeje ganharam forte presenca na Bahia, ajudando a estruturar casas religiosas que se tornaram referencias simbolicas e politicas.",
    image: "/images/ile-opo-afonja.jpg"
  },
  {
    assetId: "slide-atabaques",
    title: "Atabaques e batuque",
    description:
      "Os toques de tambor, os cantos responsoriais e a danca sao centrais nessas religioes e influenciaram profundamente a musica e a cultura popular brasileira.",
    image: "/images/atabaques-batuque.jpg"
  },
  {
    assetId: "slide-exu",
    title: "Representacao de Exu",
    description:
      "As religioes afro-brasileiras organizaram seus cultos em torno de orixas, voduns e inkices, preservando cosmologias africanas mesmo em dialogo com o catolicismo e outros sistemas.",
    image: "/images/exu.jpg"
  }
];

export default function HomePage() {
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
      <Script
        src="https://unpkg.com/aframe-look-at-component@1.0.0/dist/aframe-look-at-component.min.js"
        strategy="afterInteractive"
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
                <img key={slide.assetId} id={slide.assetId} src={slide.image} alt={slide.title} />
              ))}
            </a-assets>
            <a-marker id="hiro-marker" preset="hiro">
              <a-image
                key={currentSlide.assetId}
                position="0 0.85 0"
                rotation="0 0 0"
                look-at="[camera]"
                src={`#${currentSlide.assetId}`}
                width="1.55"
                height="1.05"
                material="shader: flat; transparent: true; side: double;"
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
