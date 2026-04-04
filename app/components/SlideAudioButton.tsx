"use client";

import { useEffect, useRef, useState } from "react";
import type { Slide } from "../lib/slides";
import styles from "./SlideAudioButton.module.css";

type SlideAudioButtonProps = {
  slide: Extract<Slide, { kind: "model" }>;
};

export function SlideAudioButton({ slide }: SlideAudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      audio.onended = () => setIsPlaying(false);
      audioRef.current = audio;
    }

    if (audioRef.current.paused) {
      void audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <button className={styles.button} type="button" onClick={toggleAudio}>
      {isPlaying ? "Pausar som" : "Tocar som"}
    </button>
  );
}
