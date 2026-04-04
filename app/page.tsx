"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
      audio: string;
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
    audio: "/audio/berimbau.ogg",
    position: "0 0 0",
    rotation: "0 0 0",
    scale: "1 1 1",
    modelOffset: "-0.6 -0.86 0"
  },
  {
    kind: "model",
    assetId: "slide-pandeiro",
    title: "Pandeiro Brasileiro",
    description:
      "O pandeiro conecta a capoeira a um campo mais amplo de musicalidades afro-brasileiras.",
    file: "/models/pandeiro_brasileiro.glb",
    audio: "/audio/pandeiro.mp3",
    position: "0 0 0",
    rotation: "0 0 0",
    scale: "3 3 3",
    modelOffset: "-14 -0.1 0"
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

type CameraState = "checking" | "ready" | "blocked" | "unavailable" | "unsupported";

export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [markerVisible, setMarkerVisible] = useState(false);
  const [coreScriptsLoaded, setCoreScriptsLoaded] = useState(0);
  const [pluginsReady, setPluginsReady] = useState(0);
  const [needsSecureContext, setNeedsSecureContext] = useState(false);
  const [cameraState, setCameraState] = useState<CameraState>("checking");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSlide = useMemo(() => slides[slideIndex], [slideIndex]);
  const isExperienceReady = coreScriptsLoaded >= 2 && pluginsReady >= 2;
  const canStartExperience = !needsSecureContext && cameraState === "ready";

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setIsAudioPlaying(false);
  }, [slideIndex]);

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
    if (currentSlide.kind !== "model" || !markerVisible) {
      return;
    }

    const modelTrigger = document.querySelector("#hiro-marker .clickable");

    if (!(modelTrigger instanceof HTMLElement)) {
      return;
    }

    const playModelAudio = () => {
      const src = currentSlide.audio;

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
    };

    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    window.addEventListener("pointerleave", stop);
  };

  const transformActiveContent = (
    kind: "scale" | "rotateX" | "rotateY",
    value: number
  ) => {
    if ((kind === "rotateX" || kind === "rotateY") && currentSlide.kind === "image") {
      return;
    }

    const activeEntity = document.querySelector("#hiro-marker .clickable");

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
      const nextScale = Math.min(Math.max(object3D.scale.x * value, 0.35), 12);
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
    const activeEntity = document.querySelector("#hiro-marker .clickable");

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
      object3D.scale.set(1, 1, 1);
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
    if (currentSlide.kind !== "model") {
      return;
    }

    if (!audioRef.current || !audioRef.current.src.endsWith(currentSlide.audio)) {
      const audio = new Audio(currentSlide.audio);
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
                <a-entity
                  class="clickable"
                  gesture-handler="rotationFactor: 0; minScale: 0.6; maxScale: 3"
                >
                  <a-image
                    key={currentSlide.assetId}
                    position="0 0 0"
                    rotation="0 0 0"
                    look-at="[camera]"
                    src={`#${currentSlide.assetId}`}
                    width="1.55"
                    height="1.05"
                    material="shader: flat; transparent: true; side: double;"
                  />
                </a-entity>
              ) : (
                <a-entity
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
                  />
                </a-entity>
              )}
            </a-marker>
            <a-entity camera />
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

      <a className={styles.markerLink} href="/marker" target="_blank" rel="noreferrer">
        Abrir marcador Hiro
      </a>

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
              onPointerDown={resetActiveContent}
              onContextMenu={(event) => event.preventDefault()}
              aria-label="Resetar conteudo"
            >
              ↻
            </button>
            {currentSlide.kind === "model" ? (
              <button
                className={styles.quickActionButton}
                type="button"
                onPointerDown={toggleModelAudio}
                onContextMenu={(event) => event.preventDefault()}
                aria-label={isAudioPlaying ? "Pausar audio do instrumento" : "Tocar audio do instrumento"}
              >
                {isAudioPlaying ? "❚❚" : "▶"}
              </button>
            ) : null}
            <button
              className={styles.quickActionButton}
              type="button"
              onPointerDown={() => startContinuousTransform("scale", 1.15)}
              onContextMenu={(event) => event.preventDefault()}
              aria-label="Aumentar conteudo"
            >
              ＋
            </button>
            <button
              className={styles.quickActionButton}
              type="button"
              onPointerDown={() => startContinuousTransform("scale", 0.87)}
              onContextMenu={(event) => event.preventDefault()}
              aria-label="Diminuir conteudo"
            >
              －
            </button>
          </div>
          {currentSlide.kind === "model" ? (
            <div className={styles.quickActionsRow}>
              <button
                className={styles.quickActionButton}
                type="button"
                onPointerDown={() => startContinuousTransform("rotateY", Math.PI / 18)}
                onContextMenu={(event) => event.preventDefault()}
                aria-label="Mover para a direita"
              >
                →
              </button>
              <button
                className={styles.quickActionButton}
                type="button"
                onPointerDown={() => startContinuousTransform("rotateY", -Math.PI / 18)}
                onContextMenu={(event) => event.preventDefault()}
                aria-label="Mover para a esquerda"
              >
                ←
              </button>
              <button
                className={styles.quickActionButton}
                type="button"
                onPointerDown={() => startContinuousTransform("rotateX", -Math.PI / 18)}
                onContextMenu={(event) => event.preventDefault()}
                aria-label="Mover para cima"
              >
                ↑
              </button>
              <button
                className={styles.quickActionButton}
                type="button"
                onPointerDown={() => startContinuousTransform("rotateX", Math.PI / 18)}
                onContextMenu={(event) => event.preventDefault()}
                aria-label="Mover para baixo"
              >
                ↓
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

          <div className={styles.content}>
            <h2
              className={
                currentSlide.title.length > 26 ? styles.contentTitleLong : styles.contentTitle
              }
            >
              {currentSlide.title}
            </h2>
            <p className={descriptionExpanded ? styles.descriptionExpanded : styles.descriptionCollapsed}>
              {currentSlide.description}
            </p>
            <button
              className={styles.textToggle}
              type="button"
              onClick={() => setDescriptionExpanded((current) => !current)}
              aria-expanded={descriptionExpanded}
            >
              {descriptionExpanded ? "Recolher" : "Mostrar mais"}
            </button>
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
