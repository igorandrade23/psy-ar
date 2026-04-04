"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, OrbitControls, Stage, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Slide } from "../lib/slides";
import styles from "./SlideFeedMedia.module.css";

type SlideFeedMediaProps = {
  slide: Slide;
};

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
    if (slide.video) {
      return (
        <div className={`${styles.mediaFrame} ${styles.videoFrame}`}>
          <div className={styles.videoShell}>
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
      <div className={styles.mediaFrame}>
        <Image src={slide.image} alt={slide.title} fill className={styles.image} />
        <span className={styles.badge}>Imagem</span>
      </div>
    );
  }

  return <InstrumentMedia slide={slide} />;
}

function EmbedMedia({ slide }: { slide: Slide }) {
  return (
    <div className={`${styles.mediaFrame} ${styles.modelFrame}`}>
      <iframe
        className={styles.embed}
        title={slide.title}
        src={slide.siteEmbedUrl}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
      />
      <div className={styles.instrumentHint}>
        {slide.kind === "model"
          ? "Use o visor incorporado para inspecionar em 3D."
          : "Use o visor incorporado para ver o movimento com mais qualidade no site."}
      </div>
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
