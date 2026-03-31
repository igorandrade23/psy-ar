"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import styles from "./page.module.css";

type Slide = {
  assetId: string;
  title: string;
  description: string;
} & (
  | {
      kind: "image";
      image: string;
    }
  | {
      kind: "model";
      file: string;
      position: string;
      rotation: string;
      scale: string;
      modelOffset: string;
    }
);

const slides: Slide[] = [
  {
    kind: "model",
    assetId: "slide-berimbau",
    title: "Berimbau",
    description:
      "O berimbau orienta o ritmo da roda e ajuda a definir a energia do jogo na capoeira.",
    file: "/models/berimbau.glb",
    position: "0 0 0",
    rotation: "0 0 0",
    scale: "1 1 1",
    modelOffset: "0 0 0"
  },
  {
    kind: "model",
    assetId: "slide-pandeiro",
    title: "Pandeiro Brasileiro",
    description:
      "O pandeiro conecta a capoeira a um campo mais amplo de musicalidades afro-brasileiras.",
    file: "/models/pandeiro_brasileiro.glb",
    position: "0 0 0",
    rotation: "0 0 0",
    scale: "1 1 1",
    modelOffset: "-14 0 -0.1"
  },
  {
    kind: "image",
    assetId: "slide-equipe",
    title: "Nossa equipe",
    description: "Foto principal da equipe",
    image: "/images/equipe.png"
  },
  {
    kind: "image",
    assetId: "slide-casa-branca",
    title: "Casa Branca do Engenho Velho",
    description:
      "Um dos terreiros de candomble mais antigos em atividade no Brasil, ligado a consolidacao urbana dos cultos afro-brasileiros no seculo XIX em Salvador.",
    image: "/images/casa-branca-engenho-velho.jpg"
  },
  {
    kind: "image",
    assetId: "slide-jaua",
    title: "Terreiro de Jaua",
    description:
      "Os terreiros se tornaram espacos de resistencia cultural, onde rituais, memorias e formas de organizacao comunitaria foram preservados apesar da repressao historica.",
    image: "/images/terreiro-do-jaua.jpg"
  },
  {
    kind: "image",
    assetId: "slide-afonja",
    title: "Ile Opo Afonja",
    description:
      "Tradicoes de matriz ioruba e jeje ganharam forte presenca na Bahia, ajudando a estruturar casas religiosas que se tornaram referencias simbolicas e politicas.",
    image: "/images/ile-opo-afonja.jpg"
  },
  {
    kind: "image",
    assetId: "slide-atabaques",
    title: "Atabaques e batuque",
    description:
      "Os toques de tambor, os cantos responsoriais e a danca sao centrais nessas religioes e influenciaram profundamente a musica e a cultura popular brasileira.",
    image: "/images/atabaques-batuque.jpg"
  },
  {
    kind: "image",
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
  const [assetsReady, setAssetsReady] = useState(false);

  const currentSlide = useMemo(() => slides[slideIndex], [slideIndex]);
  const isExperienceReady = scriptsLoaded >= 2 && assetsReady;

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalHost =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

    setNeedsSecureContext(!window.isSecureContext && !isLocalHost);
  }, []);

  useEffect(() => {
    let active = true;

    const preloadAssets = async () => {
      const tasks = slides.map((slide) => {
        if (slide.kind === "image") {
          return new Promise<void>((resolve) => {
            const image = new window.Image();
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = slide.image;
          });
        }

        return fetch(slide.file, { method: "HEAD" })
          .then(() => undefined)
          .catch(() => undefined);
      });

      await Promise.all(tasks);

      if (active) {
        setAssetsReady(true);
      }
    };

    void preloadAssets();

    return () => {
      active = false;
    };
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
        src="https://raw.githack.com/fcor/arjs-gestures/master/dist/gestures.js"
        strategy="afterInteractive"
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

      {isExperienceReady ? (
        <div className={styles.sceneWrap}>
          <a-scene
            id="scene"
            embedded
            vr-mode-ui="enabled: false"
            renderer="alpha: true; antialias: true; precision: medium;"
            arjs="trackingMethod: best; sourceType: webcam; facingMode: environment; debugUIEnabled: false;"
            gesture-detector
          >
            <a-assets timeout="20000">
              {slides.map((slide) =>
                slide.kind === "image" ? (
                  <img key={slide.assetId} id={slide.assetId} src={slide.image} alt={slide.title} />
                ) : null
              )}
            </a-assets>
            <a-marker
              id="hiro-marker"
              preset="hiro"
              raycaster="objects: .clickable"
              emitevents="true"
              cursor="fuse: false; rayOrigin: mouse;"
            >
              {currentSlide.kind === "image" ? (
                <a-image
                  key={currentSlide.assetId}
                  class="clickable"
                  gesture-handler="minScale: 0.6; maxScale: 3"
                  position="0 0.85 0"
                  rotation="0 0 0"
                  look-at="[camera]"
                  src={`#${currentSlide.assetId}`}
                  width="1.55"
                  height="1.05"
                  material="shader: flat; transparent: true; side: double;"
                />
              ) : (
                <a-entity
                  key={currentSlide.assetId}
                  class="clickable"
                  gesture-handler="minScale: 0.3; maxScale: 6"
                  position={currentSlide.position}
                  rotation={currentSlide.rotation}
                  scale={currentSlide.scale}
                >
                  <a-entity
                    position={currentSlide.modelOffset}
                    gltf-model={currentSlide.file}
                  />
                </a-entity>
              )}
            </a-marker>
            <a-entity camera />
          </a-scene>
        </div>
      ) : null}

      {!isExperienceReady ? (
        <div className={styles.loadingScreen} aria-live="polite">
          <div className={styles.loadingCard}>
            <div className={styles.loadingOrb} />
            <span className={styles.loadingTag}>Preparando a experiencia</span>
            <h1>Carregando elementos da matriz Africana no Brasil</h1>
            <p>
              Organizando camera, modelos 3D, imagens e conteudos para iniciar a experiencia em
              realidade aumentada.
            </p>
          </div>
        </div>
      ) : null}

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
