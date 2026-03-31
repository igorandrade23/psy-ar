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
    rotation: "0 90 0",
    scale: "1 1 1"
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
    scale: "1 1 1"
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

  const currentSlide = useMemo(() => slides[slideIndex], [slideIndex]);

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalHost =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

    setNeedsSecureContext(!window.isSecureContext && !isLocalHost);
  }, []);

  useEffect(() => {
    if (scriptsLoaded < 2) {
      return;
    }

    const aframeWindow = window as any;
    const { AFRAME, THREE } = aframeWindow;

    if (!AFRAME || !THREE) {
      return;
    }

    if (!AFRAME.components?.["fit-model"]) {
      AFRAME.registerComponent("fit-model", {
        schema: {
          size: { default: 1.1 }
        },
        init(this: any) {
          this.handleModelLoaded = () => {
            const mesh = this.el.getObject3D("mesh");

            if (!mesh) {
              return;
            }

            const box = new THREE.Box3().setFromObject(mesh);
            const size = box.getSize(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);

            if (!maxDimension) {
              return;
            }

            const scaleFactor = this.data.size / maxDimension;
            mesh.scale.setScalar(scaleFactor);

            const fittedBox = new THREE.Box3().setFromObject(mesh);
            const center = fittedBox.getCenter(new THREE.Vector3());

            mesh.position.x -= center.x;
            mesh.position.y -= center.y;
            mesh.position.z -= center.z;
          };

          this.el.addEventListener("model-loaded", this.handleModelLoaded);
        },
        remove(this: any) {
          this.el.removeEventListener("model-loaded", this.handleModelLoaded);
        }
      });
    }

    if (!AFRAME.components?.["drag-rotate-model"]) {
      AFRAME.registerComponent("drag-rotate-model", {
        schema: {
          speed: { default: 0.35 }
        },
        init(this: any) {
          this.isDragging = false;
          this.pointerId = null;
          this.lastX = 0;
          this.lastY = 0;

          const startDrag = (clientX: number, clientY: number, pointerId?: number) => {
            this.isDragging = true;
            this.pointerId = pointerId ?? null;
            this.lastX = clientX;
            this.lastY = clientY;
          };

          this.onPointerDown = (event: PointerEvent) => {
            startDrag(event.clientX, event.clientY, event.pointerId);
          };

          this.onPointerMove = (event: PointerEvent) => {
            if (!this.isDragging || (this.pointerId !== null && event.pointerId !== this.pointerId)) {
              return;
            }

            const deltaX = event.clientX - this.lastX;
            const deltaY = event.clientY - this.lastY;

            this.lastX = event.clientX;
            this.lastY = event.clientY;

            this.el.object3D.rotation.y += deltaX * 0.01 * this.data.speed;
          };

          this.onPointerUp = (event: PointerEvent) => {
            if (this.pointerId !== null && event.pointerId !== this.pointerId) {
              return;
            }

            this.isDragging = false;
            this.pointerId = null;
          };

          this.onTouchStart = (event: TouchEvent) => {
            const touch = event.touches[0];
            if (!touch) {
              return;
            }

            startDrag(touch.clientX, touch.clientY);
          };

          this.onTouchMove = (event: TouchEvent) => {
            if (!this.isDragging) {
              return;
            }

            const touch = event.touches[0];
            if (!touch) {
              return;
            }

            const deltaX = touch.clientX - this.lastX;
            const deltaY = touch.clientY - this.lastY;

            this.lastX = touch.clientX;
            this.lastY = touch.clientY;

            this.el.object3D.rotation.y += deltaX * 0.01 * this.data.speed;
          };

          this.canvas = this.el.sceneEl?.canvas;

          if (!this.canvas) {
            this.onSceneLoaded = () => {
              this.canvas = this.el.sceneEl?.canvas;

              if (!this.canvas) {
                return;
              }

              this.canvas.style.touchAction = "none";
              this.canvas.addEventListener("pointerdown", this.onPointerDown);
              this.canvas.addEventListener("pointermove", this.onPointerMove);
              this.canvas.addEventListener("pointerup", this.onPointerUp);
              this.canvas.addEventListener("pointercancel", this.onPointerUp);
              this.canvas.addEventListener("touchstart", this.onTouchStart, { passive: true });
              this.canvas.addEventListener("touchmove", this.onTouchMove, { passive: true });
              this.canvas.addEventListener("touchend", this.onPointerUp);
            };

            this.el.sceneEl?.addEventListener("renderstart", this.onSceneLoaded, { once: true });
            return;
          }

          this.canvas.style.touchAction = "none";
          this.canvas.addEventListener("pointerdown", this.onPointerDown);
          this.canvas.addEventListener("pointermove", this.onPointerMove);
          this.canvas.addEventListener("pointerup", this.onPointerUp);
          this.canvas.addEventListener("pointercancel", this.onPointerUp);
          this.canvas.addEventListener("touchstart", this.onTouchStart, { passive: true });
          this.canvas.addEventListener("touchmove", this.onTouchMove, { passive: true });
          this.canvas.addEventListener("touchend", this.onPointerUp);
        },
        remove(this: any) {
          if (!this.canvas) {
            return;
          }

          this.canvas.removeEventListener("pointerdown", this.onPointerDown);
          this.canvas.removeEventListener("pointermove", this.onPointerMove);
          this.canvas.removeEventListener("pointerup", this.onPointerUp);
          this.canvas.removeEventListener("pointercancel", this.onPointerUp);
          this.canvas.removeEventListener("touchstart", this.onTouchStart);
          this.canvas.removeEventListener("touchmove", this.onTouchMove);
          this.canvas.removeEventListener("touchend", this.onPointerUp);
        }
      });
    }
  }, [scriptsLoaded]);

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
              {slides.map((slide) =>
                slide.kind === "image" ? (
                  <img key={slide.assetId} id={slide.assetId} src={slide.image} alt={slide.title} />
                ) : (
                  <a-asset-item key={slide.assetId} id={slide.assetId} src={slide.file} />
                )
              )}
            </a-assets>
            <a-marker id="hiro-marker" preset="hiro">
              {currentSlide.kind === "image" ? (
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
              ) : (
                <a-entity
                  key={currentSlide.assetId}
                  position={currentSlide.position}
                >
                  <a-entity rotation={currentSlide.rotation} drag-rotate-model>
                    <a-entity
                      gltf-model={`#${currentSlide.assetId}`}
                      fit-model="size: 1.05"
                      scale={currentSlide.scale}
                    />
                  </a-entity>
                </a-entity>
              )}
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
