"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { SlideContent } from "../components/SlideContent";
import { slides } from "../lib/slides";
import styles from "./page.module.css";

type CameraState = "checking" | "ready" | "blocked" | "unavailable" | "unsupported";

export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [markerVisible, setMarkerVisible] = useState(false);
  const [markerSeen, setMarkerSeen] = useState(false);
  const [coreScriptsLoaded, setCoreScriptsLoaded] = useState(0);
  const [pluginsReady, setPluginsReady] = useState(0);
  const [needsSecureContext, setNeedsSecureContext] = useState(false);
  const [cameraState, setCameraState] = useState<CameraState>("checking");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [mediaAspectRatio, setMediaAspectRatio] = useState(1.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSlide = useMemo(() => slides[slideIndex], [slideIndex]);
  const isExperienceReady = coreScriptsLoaded >= 2 && pluginsReady >= 2;
  const canStartExperience = !needsSecureContext && cameraState === "ready";
  const activeContentId = `ar-active-${currentSlide.assetId}`;
  const basePlaneHeight = 1.02;
  const baseLongSide = 1.28;
  const basePlaneWidth = mediaAspectRatio >= 1 ? baseLongSide : baseLongSide * mediaAspectRatio;
  const normalizedPlaneHeight =
    mediaAspectRatio >= 1 ? baseLongSide / mediaAspectRatio : baseLongSide;

  const requestCameraAccess = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("unsupported");
      return;
    }

    setCameraState("checking");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment"
          }
        },
        audio: false
      });

      stream.getTracks().forEach((track) => {
        track.stop();
      });

      setCameraState("ready");
    } catch (error) {
      const errorName =
        error instanceof DOMException
          ? error.name
          : typeof error === "object" && error !== null && "name" in error
            ? String(error.name)
            : "";

      if (
        errorName === "NotAllowedError" ||
        errorName === "PermissionDeniedError" ||
        errorName === "SecurityError"
      ) {
        setCameraState("blocked");
        return;
      }

      setCameraState("unavailable");
    }
  };

  useEffect(() => {
    document.body.classList.add("arExperience");

    return () => {
      document.body.classList.remove("arExperience");
    };
  }, []);

  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalHost =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

    setNeedsSecureContext(!window.isSecureContext && !isLocalHost);
  }, []);

  useEffect(() => {
    if (needsSecureContext) {
      return;
    }

    void requestCameraAccess();
  }, [needsSecureContext]);

  useEffect(() => {
    setDescriptionExpanded(false);
  }, [slideIndex, markerVisible]);

  useEffect(() => {
    if (markerVisible) {
      setMarkerSeen(true);
    }
  }, [markerVisible]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setIsAudioPlaying(false);
  }, [slideIndex]);

  useEffect(() => {
    if (currentSlide.kind !== "image") {
      return;
    }

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) {
        return;
      }

      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        setMediaAspectRatio(image.naturalWidth / image.naturalHeight);
      }
    };

    image.src = currentSlide.image;

    return () => {
      cancelled = true;
    };
  }, [currentSlide]);

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
    if (!isExperienceReady) {
      return;
    }

    const aframe = (window as Window & { AFRAME?: { components: Record<string, unknown>; registerComponent: (name: string, definition: object) => void } }).AFRAME;

    if (!aframe || aframe.components["safe-look-at"]) {
      return;
    }

    aframe.registerComponent("safe-look-at", {
      schema: {
        target: { type: "selector" }
      },

      init(this: any) {
        this.retryId = null;
        this.queueApply = () => {
          if (this.retryId) {
            window.clearTimeout(this.retryId);
          }

          this.retryId = window.setTimeout(() => {
            const scene = this.el.sceneEl;
            const target = this.data.target;

            if (!scene?.hasLoaded || !target?.id) {
              this.queueApply();
              return;
            }

            this.el.setAttribute("look-at", `#${target.id}`);
          }, 80);
        };

        this.onSceneLoaded = () => this.queueApply();
        this.onMarkerFound = () => this.queueApply();

        if (this.el.sceneEl?.hasLoaded) {
          this.queueApply();
        } else {
          this.el.sceneEl?.addEventListener("loaded", this.onSceneLoaded);
        }

        this.markerEl = this.el.closest("a-marker");
        this.markerEl?.addEventListener("markerFound", this.onMarkerFound);
      },

      update(this: any) {
        this.queueApply?.();
      },

      remove(this: any) {
        if (this.retryId) {
          window.clearTimeout(this.retryId);
        }

        this.el.sceneEl?.removeEventListener("loaded", this.onSceneLoaded);
        this.markerEl?.removeEventListener("markerFound", this.onMarkerFound);
      }
    });
  }, [isExperienceReady]);

  useEffect(() => {
    if (!isExperienceReady) {
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
  }, [isExperienceReady]);

  useEffect(() => {
    if (currentSlide.kind !== "model" || !currentSlide.audio || !markerVisible) {
      return;
    }

    const modelTrigger = document.querySelector("#hiro-marker .clickable");

    if (!(modelTrigger instanceof HTMLElement)) {
      return;
    }

    const playModelAudio = () => {
      const src = currentSlide.audio;

      if (!src) {
        return;
      }

      if (audioRef.current?.src.endsWith(src)) {
        audioRef.current.currentTime = 0;
        void audioRef.current.play();
        setIsAudioPlaying(true);
        return;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(src);
      audio.loop = currentSlide.assetId === "slide-atabaque";
      audioRef.current = audio;
      audio.onended = () => setIsAudioPlaying(false);
      void audio.play();
      setIsAudioPlaying(true);
    };

    modelTrigger.addEventListener("click", playModelAudio);
    modelTrigger.addEventListener("touchstart", playModelAudio, { passive: true });

    return () => {
      modelTrigger.removeEventListener("click", playModelAudio);
      modelTrigger.removeEventListener("touchstart", playModelAudio);
    };
  }, [currentSlide, markerVisible]);

  useEffect(() => {
    if (markerVisible) {
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
  }, [markerVisible]);

  const moveSlide = (direction: -1 | 1) => {
    setSlideIndex((current) => (current + direction + slides.length) % slides.length);
  };

  const startContinuousTransform = (
    kind: "scale" | "rotateX" | "rotateY",
    value: number
  ) => {
    transformActiveContent(kind, value);

    const intervalId = window.setInterval(() => {
      transformActiveContent(kind, value);
    }, 120);

    const stop = () => {
      window.clearInterval(intervalId);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      window.removeEventListener("pointerleave", stop);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
      window.removeEventListener("touchcancel", stop);
    };

    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("pointerleave", stop);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
    window.addEventListener("touchcancel", stop);
  };

  const handleContinuousControlStart = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
      | React.PointerEvent<HTMLButtonElement>,
    kind: "scale" | "rotateX" | "rotateY",
    value: number
  ) => {
    event.stopPropagation();
    startContinuousTransform(kind, value);
  };

  const handleActionButton = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
      | React.PointerEvent<HTMLButtonElement>,
    action: () => void
  ) => {
    event.stopPropagation();
    action();
  };

  const transformActiveContent = (
    kind: "scale" | "rotateX" | "rotateY",
    value: number
  ) => {
    const activeEntity = document.getElementById(activeContentId);

    if (!(activeEntity instanceof HTMLElement) || !("object3D" in activeEntity)) {
      return;
    }

    const object3D = (
      activeEntity as HTMLElement & {
        object3D: {
          scale: { x: number; y: number; z: number; set: (x: number, y: number, z: number) => void };
          rotation: { x: number; y: number; z: number };
        };
      }
    ).object3D;

    if (kind === "scale") {
      const defaultMinScale =
        currentSlide.kind === "image"
          ? 0.2
          : Math.max(Number.parseFloat(currentSlide.scale.split(" ")[0]) * 0.5, 0.01);
      const defaultMaxScale =
        currentSlide.kind === "image"
          ? 20
          : Math.max(Number.parseFloat(currentSlide.scale.split(" ")[0]) * 8, defaultMinScale * 2);
      const minScale = currentSlide.kind === "model" && currentSlide.minScale ? currentSlide.minScale : defaultMinScale;
      const maxScale = currentSlide.kind === "model" && currentSlide.maxScale ? currentSlide.maxScale : defaultMaxScale;
      const nextScale = Math.min(Math.max(object3D.scale.x * value, minScale), maxScale);
      object3D.scale.set(nextScale, nextScale, nextScale);
      return;
    }

    if (kind === "rotateY") {
      object3D.rotation.y += value;
      return;
    }

    object3D.rotation.x += value;
  };

  const resetActiveContent = () => {
    const activeEntity = document.getElementById(activeContentId);

    if (!(activeEntity instanceof HTMLElement) || !("object3D" in activeEntity)) {
      return;
    }

    const object3D = (
      activeEntity as HTMLElement & {
        object3D: {
          scale: { set: (x: number, y: number, z: number) => void };
          rotation: { set: (x: number, y: number, z: number) => void };
          position: { set: (x: number, y: number, z: number) => void };
        };
      }
    ).object3D;

    if (currentSlide.kind === "image") {
      object3D.scale.set(1.5, 1.5, 1.5);
      object3D.rotation.set(0, 0, 0);
      object3D.position.set(0, 0, 0);
      return;
    }

    const parseVector = (vector: string) => vector.split(" ").map(Number) as [number, number, number];
    const [px, py, pz] = parseVector(currentSlide.position);
    const [rx, ry, rz] = parseVector(currentSlide.rotation).map(
      (angle) => (angle * Math.PI) / 180
    ) as [number, number, number];
    const [sx, sy, sz] = parseVector(currentSlide.scale);

    object3D.position.set(px, py, pz);
    object3D.rotation.set(rx, ry, rz);
    object3D.scale.set(sx, sy, sz);
  };

  const toggleModelAudio = () => {
    if (currentSlide.kind !== "model" || !currentSlide.audio) {
      return;
    }

    if (!audioRef.current || !audioRef.current.src.endsWith(currentSlide.audio)) {
      const audio = new Audio(currentSlide.audio);
      audio.loop = currentSlide.assetId === "slide-atabaque";
      audioRef.current = audio;
      audio.onended = () => setIsAudioPlaying(false);
      void audio.play();
      setIsAudioPlaying(true);
      return;
    }

    if (audioRef.current.paused) {
      void audioRef.current.play();
      setIsAudioPlaying(true);
      return;
    }

    audioRef.current.pause();
    setIsAudioPlaying(false);
  };

  return (
    <main className={styles.page}>
      <Script
        src="/vendor/aframe-1.6.0.min.js"
        strategy="afterInteractive"
        onLoad={() => setCoreScriptsLoaded((current) => current + 1)}
      />
      <Script
        src="/vendor/aframe-ar-3.4.7.min.js"
        strategy="afterInteractive"
        onLoad={() => setCoreScriptsLoaded((current) => current + 1)}
      />
      <Script
        src="/vendor/arjs-gestures.js"
        strategy="afterInteractive"
        onLoad={() => setPluginsReady((current) => current + 1)}
      />
      <Script
        src="/vendor/aframe-look-at-component-1.0.0.min.js"
        strategy="afterInteractive"
        onLoad={() => setPluginsReady((current) => current + 1)}
      />
      <Script src="/vendor/aframe-extras.loaders.min.js" strategy="afterInteractive" />

      {needsSecureContext ? (
        <div className={styles.cameraNotice} aria-live="polite">
          <div className={styles.cameraNoticeCard}>
            <span className={styles.loadingTag}>Camera necessaria</span>
            <h1>Ative sua camera</h1>
            <p>
              Clique em Permitir para liberar o acesso a camera e entrar no Museu Virtual da Capoeira. O museu utiliza a camera para detectar o marcador Hiro e exibir os conteudos em realidade aumentada, mas nao tem acesso a nenhum outro dado da camera ou do dispositivo.
            </p>
          </div>
        </div>
      ) : null}

      {isExperienceReady && canStartExperience ? (
        <div className={styles.sceneWrap}>
          <a-scene
            id="scene"
            embedded
            vr-mode-ui="enabled: false"
            renderer="alpha: true; antialias: true; precision: medium;"
            arjs="trackingMethod: best; sourceType: webcam; facingMode: environment; debugUIEnabled: false;"
            gesture-detector
          >
            <a-marker
              id="hiro-marker"
              preset="hiro"
              raycaster="objects: .clickable"
              emitevents="true"
              cursor="fuse: false; rayOrigin: mouse;"
            >
              {currentSlide.kind === "image" ? (
                <a-entity
                  id={activeContentId}
                  class="clickable"
                  scale="1.5 1.5 1.5"
                  safe-look-at="target: #main-camera"
                >
                  <a-entity
                    key={currentSlide.assetId}
                    position="0 0 0"
                    rotation="0 0 0"
                    geometry={`primitive: plane; width: ${basePlaneWidth}; height: ${normalizedPlaneHeight}`}
                    material={`src: url(${currentSlide.image}); shader: flat; side: double; transparent: false; color: #fff;`}
                  />
                </a-entity>
              ) : (
                <a-entity
                  id={activeContentId}
                  class="clickable"
                  gesture-handler="minScale: 0.3; maxScale: 4"
                  position={currentSlide.position}
                  rotation={currentSlide.rotation}
                  scale={currentSlide.scale}
                >
                  <a-entity
                    key={currentSlide.assetId}
                    position={currentSlide.modelOffset}
                    gltf-model={currentSlide.file}
                    animation-mixer={currentSlide.assetId === "slide-ginga" ? "clip: mixamo.com; loop: repeat" : undefined}
                  />
                </a-entity>
              )}
            </a-marker>
            <a-entity id="main-camera" camera />
          </a-scene>
        </div>
      ) : null}

      {!needsSecureContext && cameraState === "blocked" ? (
        <div className={styles.cameraNotice} aria-live="assertive">
          <div className={styles.cameraNoticeCard}>
            <span className={styles.loadingTag}>Acesso bloqueado</span>
            <h1>Ative sua camera</h1>
            <p>
              Para entrar no Museu Virtual da Capoeira, permita o acesso a camera no navegador e
              tente novamente.
            </p>
            <div className={styles.cameraActions}>
              <button className={styles.button} type="button" onClick={() => void requestCameraAccess()}>
                Ativar camera
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!needsSecureContext &&
      (cameraState === "unavailable" || cameraState === "unsupported") ? (
        <div className={styles.cameraNotice} aria-live="assertive">
          <div className={styles.cameraNoticeCard}>
            <span className={styles.loadingTag}>Camera indisponivel</span>
            <h1>Não foi possível acessar o Museu Virtual da Capoeira pois sua câmera não funciona</h1>
            <p>
              Verifique se o dispositivo possui uma camera ativa, se ela nao esta sendo usada por
              outro app e tente novamente.
            </p>
            <div className={styles.cameraActions}>
              <button className={styles.button} type="button" onClick={() => void requestCameraAccess()}>
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!needsSecureContext && (cameraState === "checking" || !isExperienceReady) ? (
        <div className={styles.loadingScreen} aria-live="polite">
          <div className={styles.loadingCard}>
            <div className={styles.loadingOrb} />
            <span className={styles.loadingTag}>Preparando a experiencia</span>
            <h1>Carregando o Museu Virtual da Capoeira</h1>
            <p>
              Organizando camera, marcador e conteudos para iniciar a experiencia em realidade
              aumentada do museu.
            </p>
          </div>
        </div>
      ) : null}

      <div className={styles.status}>
        {needsSecureContext
          ? "Abra o museu em um contexto seguro para liberar a camera"
          : cameraState === "blocked"
            ? "Ative a camera para entrar no museu"
            : cameraState === "unavailable" || cameraState === "unsupported"
              ? "Camera indisponivel para abrir o museu"
              : markerVisible
                ? "Marcador do museu detectado"
                : "Aponte a camera para o marcador Hiro do museu"}
      </div>

      {!markerSeen ? (
        <a className={styles.markerLink} href="/marker" target="_blank" rel="noreferrer">
          Abrir marcador Hiro
        </a>
      ) : null}

      {markerVisible && !descriptionExpanded ? (
        <div
          className={`${styles.quickActions} ${
            currentSlide.kind === "model" ? styles.quickActionsModel : styles.quickActionsImage
          }`}
          aria-label="Controles rapidos do conteudo AR"
        >
          <div className={styles.quickActionsRow}>
            <button
              className={styles.quickActionButton}
              type="button"
              onMouseDown={(event) => handleContinuousControlStart(event, "scale", 1.15)}
              onTouchStart={(event) => handleContinuousControlStart(event, "scale", 1.15)}
              onContextMenu={(event) => event.preventDefault()}
              aria-label="Aumentar conteudo"
            >
              ＋
            </button>
            <button
              className={styles.quickActionButton}
              type="button"
              onMouseDown={(event) => handleContinuousControlStart(event, "scale", 0.87)}
              onTouchStart={(event) => handleContinuousControlStart(event, "scale", 0.87)}
              onContextMenu={(event) => event.preventDefault()}
              aria-label="Diminuir conteudo"
            >
              －
            </button>
          </div>
          <div className={styles.quickActionsRow}>
            <button
              className={styles.quickActionButton}
              type="button"
              onClick={(event) => handleActionButton(event, resetActiveContent)}
              onTouchStart={(event) => handleActionButton(event, resetActiveContent)}
              onContextMenu={(event) => event.preventDefault()}
              aria-label="Resetar conteudo"
            >
              ↻
            </button>
            {currentSlide.kind === "model" && currentSlide.audio ? (
              <button
                className={styles.quickActionButton}
                type="button"
                onClick={(event) => handleActionButton(event, toggleModelAudio)}
                onTouchStart={(event) => handleActionButton(event, toggleModelAudio)}
                onContextMenu={(event) => event.preventDefault()}
                aria-label={isAudioPlaying ? "Pausar audio do instrumento" : "Tocar audio do instrumento"}
              >
                {isAudioPlaying ? "❚❚" : "▶"}
              </button>
            ) : (
              <span className={styles.quickActionSpacer} aria-hidden="true" />
            )}
          </div>
          {currentSlide.kind === "model" ? (
            <div className={styles.quickActionsRow}>
              <button
                className={styles.quickActionButton}
                type="button"
                onMouseDown={(event) =>
                  handleContinuousControlStart(event, "rotateX", -Math.PI / 18)
                }
                onTouchStart={(event) =>
                  handleContinuousControlStart(event, "rotateX", -Math.PI / 18)
                }
                onContextMenu={(event) => event.preventDefault()}
                aria-label="Mover para cima"
              >
                ↑
              </button>
              <button
                className={styles.quickActionButton}
                type="button"
                onMouseDown={(event) =>
                  handleContinuousControlStart(event, "rotateX", Math.PI / 18)
                }
                onTouchStart={(event) =>
                  handleContinuousControlStart(event, "rotateX", Math.PI / 18)
                }
                onContextMenu={(event) => event.preventDefault()}
                aria-label="Mover para baixo"
              >
                ↓
              </button>
            </div>
          ) : null}
          {currentSlide.kind === "model" ? (
            <div className={styles.quickActionsRow}>
              <button
                className={styles.quickActionButton}
                type="button"
                onMouseDown={(event) =>
                  handleContinuousControlStart(event, "rotateY", -Math.PI / 18)
                }
                onTouchStart={(event) =>
                  handleContinuousControlStart(event, "rotateY", -Math.PI / 18)
                }
                onContextMenu={(event) => event.preventDefault()}
                aria-label="Mover para a esquerda"
              >
                ←
              </button>
              <button
                className={styles.quickActionButton}
                type="button"
                onMouseDown={(event) =>
                  handleContinuousControlStart(event, "rotateY", Math.PI / 18)
                }
                onTouchStart={(event) =>
                  handleContinuousControlStart(event, "rotateY", Math.PI / 18)
                }
                onContextMenu={(event) => event.preventDefault()}
                aria-label="Mover para a direita"
              >
                →
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {markerVisible ? (
        <section
          className={`${styles.modal} ${descriptionExpanded ? styles.modalExpanded : ""}`}
          aria-live="polite"
        >
          <div className={styles.meta}>
            <span className={styles.counter}>
              {slideIndex + 1}/{slides.length}
            </span>
            <span className={styles.tag}>Museu Virtual da Capoeira</span>
          </div>

          <SlideContent
            slide={currentSlide}
            expanded={descriptionExpanded}
            collapsible
            compact={currentSlide.title.length > 26}
            className={styles.content}
            mediaContext="ar"
            tone="light"
            onToggle={() => setDescriptionExpanded((current) => !current)}
          />

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
