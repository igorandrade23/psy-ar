"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import styles from "./page.module.css";

type Slide = {
  assetId: string;
  title: string;
  description: string;
  details: string;
  references: string[];
} & (
  | {
      kind: "image";
      image: string;
    }
  | {
      kind: "model";
      file: string;
      audio?: string;
      position: string;
      rotation: string;
      scale: string;
      modelOffset: string;
    }
);

const slides: Slide[] = [
  {
    kind: "image",
    assetId: "slide-origens",
    title: "Origens da capoeira",
    description:
      "Registros do século XIX mostram que a capoeira já circulava em cidades brasileiras como prática corporal, luta, jogo e forma de sociabilidade entre populações negras.",
    details:
      "A pintura atribuída a Augustus Earle costuma ser utilizada em estudos históricos como um dos registros visuais mais conhecidos de uma prática semelhante à capoeira no Brasil oitocentista. Ao apresentar corpo, confronto, ritmo e observação coletiva, a imagem ajuda a compreender a capoeira como manifestação social e não apenas como técnica de combate.",
    references: [
      "EARLE, Augustus. Negroes fighting, Brazil, c. 1824.",
      "RIBEIRO, Darcy. O povo brasileiro.",
      "SCHWARCZ, Lilia Moritz; STARLING, Heloisa Murgel. Brasil: uma biografia."
    ],
    image: "/images/capoeira-earle.jpg"
  },
  {
    kind: "image",
    assetId: "slide-resistencia",
    title: "Repressão e resistência",
    description:
      "Ao longo de sua história, a capoeira foi alvo de perseguição e estigma, mas permaneceu viva por meio da transmissão entre mestres, rodas e comunidades.",
    details:
      "A criminalização da capoeira em diferentes momentos da história brasileira não impediu sua continuidade. A prática persistiu porque esteve vinculada a redes de pertencimento, memória e formação coletiva. Por isso, estudar capoeira exige observá-la como experiência histórica de resistência cultural e reinvenção social.",
    references: [
      "SODRÉ, Muniz. O terreiro e a cidade.",
      "RIBEIRO, Darcy. O povo brasileiro.",
      "SCHWARCZ, Lilia Moritz; STARLING, Heloisa Murgel. Brasil: uma biografia."
    ],
    image: "/images/roda-capoeira-angola.jpg"
  },
  {
    kind: "image",
    assetId: "slide-patrimonio",
    title: "Capoeira como patrimônio vivo",
    description:
      "Hoje, a capoeira é reconhecida como patrimônio cultural e segue ativa em escolas, projetos, academias, grupos comunitários e rodas públicas.",
    details:
      "Esse reconhecimento institucional não encerra a história da capoeira; ao contrário, reforça sua permanência como prática viva, transmitida pela experiência do corpo, da música, da oralidade e do convívio. A roda continua sendo espaço de aprendizagem, disciplina, improviso e elaboração de identidade coletiva.",
    references: [
      "IPHAN. Roda de Capoeira e Ofício dos Mestres de Capoeira.",
      "SODRÉ, Muniz. O terreiro e a cidade.",
      "RIBEIRO, Darcy. O povo brasileiro."
    ],
    image: "/images/patrimonio-imaterial-capoeira.jpg"
  },
  {
    kind: "model",
    assetId: "slide-ginga",
    title: "A ginga",
    description:
      "A ginga é o movimento-base da capoeira. Ela organiza o equilíbrio, a defesa, a leitura do jogo e a relação entre ataque e esquiva.",
    details:
      "Mais do que um passo repetido, a ginga produz ritmo, intenção e disponibilidade corporal. Ela ensina o praticante a nunca permanecer estático, a negociar distância e tempo, e a transformar o corpo em linguagem. Por isso, a ginga é frequentemente apresentada como síntese técnica e simbólica da capoeira contemporânea.",
    references: [
      "SODRÉ, Muniz. O terreiro e a cidade.",
      "RIBEIRO, Darcy. O povo brasileiro."
    ],
    file: "/models/ginga.glb",
    position: "0 0 0",
    rotation: "0 180 0",
    scale: "1.2 1.2 1.2",
    modelOffset: "0 -0.89 -0.03"
  },
  {
    kind: "model",
    assetId: "slide-berimbau2",
    title: "Berimbau",
    description:
      "O berimbau orienta a roda e ajuda a definir o tipo de jogo, o andamento do toque e a atenção dos participantes.",
    details:
      "Na roda de capoeira, o berimbau ocupa lugar central porque estrutura o ritmo e sinaliza modos distintos de jogar. Seu som não funciona apenas como acompanhamento: ele organiza a dinâmica da roda, orienta entradas e reforça a relação entre música, disciplina e improviso.",
    references: [
      "SODRÉ, Muniz. O terreiro e a cidade.",
      "RIBEIRO, Darcy. O povo brasileiro.",
      "Arquivo sonoro: Toque-de-angola.ogg, Wikimedia Commons."
    ],
    file: "/models/berimbau2.glb",
    audio: "/audio/berimbau.ogg",
    position: "0 0 0",
    rotation: "0 90 0",
    scale: "0.015 0.015 0.015",
    modelOffset: "-16.85 -76.83 2.19"
  },
  {
    kind: "model",
    assetId: "slide-pandeiro",
    title: "Pandeiro Brasileiro",
    description:
      "O pandeiro complementa a roda com marcação rítmica, balanço e resposta ao toque principal do berimbau.",
    details:
      "Na capoeira, o pandeiro reforça a pulsação da roda e contribui para a densidade sonora do conjunto. Seu uso aproxima a capoeira de outros campos da música popular brasileira e evidencia que a roda articula corpo, canto, percussão e escuta coletiva.",
    references: [
      "SODRÉ, Muniz. O terreiro e a cidade.",
      "RIBEIRO, Darcy. O povo brasileiro.",
      "Arquivo sonoro: preview de pandeiro, Freesound."
    ],
    file: "/models/pandeiro_brasileiro.glb",
    audio: "/audio/pandeiro.mp3",
    position: "0 0 0",
    rotation: "0 180 0",
    scale: "3 3 3",
    modelOffset: "-14 -0.1 0"
  },
  {
    kind: "model",
    assetId: "slide-atabaque",
    title: "Atabaque",
    description:
      "O atabaque amplia a base percussiva da roda e ajuda a sustentar a energia coletiva da música e do canto.",
    details:
      "Embora o berimbau costume ocupar o centro simbólico da roda, o atabaque contribui para a sustentação do ritmo e reforça a presença de matrizes percussivas afro-brasileiras. Seu timbre grave ajuda a construir ambiência, intensidade e coesão entre movimento corporal e acompanhamento musical.",
    references: [
      "SODRÉ, Muniz. O terreiro e a cidade.",
      "RIBEIRO, Darcy. O povo brasileiro.",
      "Arquivo sonoro: stevysound_ethnic_percussion_120bpm_152606.wav, Freesound."
    ],
    file: "/models/atabaque.glb",
    audio: "/audio/atabaque.mp3",
    position: "0 0 0",
    rotation: "0 180 0",
    scale: "1.2 1.2 1.2",
    modelOffset: "-0.35 -0.59 0.07"
  },
  {
    kind: "image",
    assetId: "slide-musicos",
    title: "A roda e a música hoje",
    description:
      "A roda contemporânea articula jogo, música, canto, memória e convivência, mantendo a capoeira como prática coletiva e elemento cultural vivo.",
    details:
      "Em contextos contemporâneos, a roda preserva dimensões históricas da capoeira ao mesmo tempo que dialoga com escola, turismo, políticas de patrimônio e formação artística. A presença de músicos e praticantes no mesmo espaço mostra que a capoeira continua sendo, ao mesmo tempo, arte, pedagogia, performance e experiência comunitária.",
    references: [
      "IPHAN. Roda de Capoeira e Ofício dos Mestres de Capoeira.",
      "SODRÉ, Muniz. O terreiro e a cidade.",
      "SCHWARCZ, Lilia Moritz; STARLING, Heloisa Murgel. Brasil: uma biografia."
    ],
    image: "/images/musicos-capoeira-angola.jpg"
  }
];

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
                  scale="1.5 1.5 1.5"
                  safe-look-at="target: #main-camera"
                >
                  <a-image
                    key={currentSlide.assetId}
                    position="0 0 0"
                    rotation="0 0 0"
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
            {currentSlide.kind === "model" && currentSlide.audio ? (
              <button
                className={styles.quickActionButton}
                type="button"
                onPointerDown={toggleModelAudio}
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
          {currentSlide.kind === "model" ? (
            <div className={styles.quickActionsRow}>
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
                onPointerDown={() => startContinuousTransform("rotateY", Math.PI / 18)}
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

          <div className={styles.content}>
            <h2
              className={
                currentSlide.title.length > 26 ? styles.contentTitleLong : styles.contentTitle
              }
            >
              {currentSlide.title}
            </h2>
            <p
              className={descriptionExpanded ? styles.descriptionExpanded : styles.descriptionCollapsed}
            >
              {currentSlide.description}
            </p>
            {descriptionExpanded ? <p className={styles.details}>{currentSlide.details}</p> : null}
            {descriptionExpanded ? (
              <div className={styles.references}>
                <span className={styles.referencesTitle}>Referências</span>
                <ul className={styles.referencesList}>
                  {currentSlide.references.map((reference) => (
                    <li key={reference}>{reference}</li>
                  ))}
                </ul>
              </div>
            ) : null}
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
