"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Slide } from "../lib/slides";
import styles from "./SlideFeedMedia.module.css";

type SlideFeedMediaProps = {
  slide: Slide;
};

function getSketchfabUid(siteEmbedUrl: string) {
  const match = siteEmbedUrl.match(/\/models\/([a-z0-9]+)\/embed/i);
  return match?.[1] ?? null;
}

function getModelScale(assetId: string) {
  if (assetId === "slide-berimbau2") {
    return 2.6;
  }

  if (assetId === "slide-pandeiro") {
    return 1.65;
  }

  return 1.55;
}

function ModelPreview({ slide }: { slide: Extract<Slide, { kind: "model" }> }) {
  const { scene } = useGLTF(slide.file);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const group = useRef<Group | null>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={(node) => (group.current = node)}>
      <Center>
        <primitive object={clonedScene} scale={getModelScale(slide.assetId)} />
      </Center>
    </group>
  );
}

export function SlideFeedMedia({ slide }: SlideFeedMediaProps) {
  if (slide.siteEmbedUrl) {
    return <EmbedMedia slide={slide} />;
  }

  if (slide.kind === "image") {
    const mediaAspectRatio =
      slide.mediaWidth && slide.mediaHeight ? slide.mediaWidth / slide.mediaHeight : 4 / 5;

    if (slide.video) {
      return (
        <div
          className={`${styles.mediaFrame} ${styles.videoFrame}`}
          style={{ aspectRatio: `${slide.mediaWidth ?? 16} / ${slide.mediaHeight ?? 9}` }}
        >
          <div className={styles.videoShell} style={{ aspectRatio: `${mediaAspectRatio}` }}>
            <video
              className={`${styles.video} ${styles.videoContained}`}
              src={slide.video}
              poster={slide.image}
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <span className={styles.badge}>Vídeo</span>
        </div>
      );
    }

    return (
      <div className={styles.mediaFrame} style={{ aspectRatio: `${mediaAspectRatio}` }}>
        <Image src={slide.image} alt={slide.title} fill className={styles.image} />
        <span className={styles.badge}>Imagem</span>
      </div>
    );
  }

  return <InstrumentMedia slide={slide} />;
}

function EmbedMedia({ slide }: { slide: Slide }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isViewerApiReady, setIsViewerApiReady] = useState(() => {
    return typeof window !== "undefined" && typeof window.Sketchfab !== "undefined";
  });
  const viewerUid = slide.siteEmbedUrl ? getSketchfabUid(slide.siteEmbedUrl) : null;
  const shouldControlCamera = Boolean(slide.embedZoomOutFactor && viewerUid);

  useEffect(() => {
    if (!shouldControlCamera || !isViewerApiReady || !iframeRef.current || !window.Sketchfab || !viewerUid) {
      return;
    }

    let cancelled = false;
    const client = new window.Sketchfab("1.12.1", iframeRef.current);

    client.init(viewerUid, {
      autostart: 1,
      camera: 0,
      ui_ar: 0,
      ui_infos: 0,
      ui_snapshots: 0,
      ui_stop: 0,
      ui_theatre: 1,
      ui_watermark: 0,
      success(api) {
        api.start();
        api.addEventListener("viewerready", () => {
          if (cancelled) {
            return;
          }

          api.getCameraLookAt((error, camera) => {
            if (error || cancelled) {
              return;
            }

            const factor = slide.embedZoomOutFactor ?? 1;
            const adjustedPosition = camera.position.map((coordinate, index) => {
              const targetCoordinate = camera.target[index] ?? 0;
              return targetCoordinate + (coordinate - targetCoordinate) * factor;
            });

            api.setCameraLookAt(adjustedPosition, camera.target, 0);
          });
        });
      },
      error() {}
    });

    return () => {
      cancelled = true;
    };
  }, [isViewerApiReady, shouldControlCamera, slide.embedZoomOutFactor, viewerUid]);

  return (
    <div className={`${styles.mediaFrame} ${styles.modelFrame}`} style={{ aspectRatio: "4 / 5" }}>
      {shouldControlCamera ? (
        <Script
          src="https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js"
          strategy="afterInteractive"
          onLoad={() => setIsViewerApiReady(true)}
        />
      ) : null}
      <iframe
        ref={iframeRef}
        className={styles.embed}
        title={slide.title}
        src={shouldControlCamera ? undefined : slide.siteEmbedUrl}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
      <span className={styles.badge}>{slide.kind === "model" ? "Modelo 3D" : "3D incorporado"}</span>
    </div>
  );
}

function InstrumentMedia({ slide }: { slide: Extract<Slide, { kind: "model" }> }) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!slide.audio) {
      return;
    }

    if (!audioRef.current) {
      const audio = new Audio(slide.audio);
      audio.loop = slide.assetId === "slide-atabaque";
      audio.onended = () => setIsAudioPlaying(false);
      audioRef.current = audio;
    }

    if (audioRef.current.paused) {
      void audioRef.current.play();
      setIsAudioPlaying(true);
      return;
    }

    audioRef.current.pause();
    setIsAudioPlaying(false);
  };

  const resetCamera = () => {
    controlsRef.current?.reset();
  };

  return (
    <div className={`${styles.mediaFrame} ${styles.modelFrame}`}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 34 }}>
        <Suspense fallback={null}>
          <Stage intensity={0.5} environment={null} shadows={false} adjustCamera={1.25}>
            <ModelPreview slide={slide} />
          </Stage>
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={2.2}
          minDistance={3}
          maxDistance={6}
        />
      </Canvas>
      <div className={styles.instrumentActions}>
        {slide.audio ? (
          <button className={styles.actionButton} type="button" onClick={toggleAudio}>
            {isAudioPlaying ? "Pausar som" : "Tocar som"}
          </button>
        ) : null}
        <button className={styles.actionButton} type="button" onClick={() => setAutoRotate((current) => !current)}>
          {autoRotate ? "Parar giro" : "Girar"}
        </button>
        <button className={styles.actionButton} type="button" onClick={resetCamera}>
          Resetar visão
        </button>
      </div>
      <div className={styles.instrumentHint}>Arraste para girar e use pinça ou roda do mouse para aproximar.</div>
      <span className={styles.badge}>Modelo 3D</span>
    </div>
  );
}
