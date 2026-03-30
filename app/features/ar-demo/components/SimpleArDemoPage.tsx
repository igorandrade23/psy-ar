"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

const AFRAME_SRC = "https://aframe.io/releases/1.6.0/aframe.min.js";
const ARJS_SRC =
  "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";

const slides = [
  {
    id: "team",
    assetId: "#team-photo",
    title: "Nossa equipe",
    description: "Foto principal da equipe apresentada sobre o marcador Hiro."
  },
  {
    id: "casa-branca",
    assetId: "#casa-branca-engenho-velho",
    title: "Casa Branca do Engenho Velho",
    description:
      "Um dos terreiros de candomble mais antigos em atividade no Brasil, ligado a consolidacao urbana dos cultos afro-brasileiros no seculo XIX em Salvador."
  },
  {
    id: "terreiro-jaua",
    assetId: "#terreiro-do-jaua",
    title: "Terreiro de Jaua",
    description:
      "Os terreiros se tornaram espacos de resistencia cultural, onde rituais, memorias e formas de organizacao comunitaria foram preservados apesar da repressao historica."
  },
  {
    id: "ile-opo-afonja",
    assetId: "#ile-opo-afonja",
    title: "Ile Opo Afonja",
    description:
      "Tradicoes de matriz ioruba e jeje ganharam forte presenca na Bahia, ajudando a estruturar casas religiosas que se tornaram referencias simbolicas e politicas."
  },
  {
    id: "atabaques",
    assetId: "#atabaques-batuque",
    title: "Atabaques e batuque",
    description:
      "Os toques de tambor, os cantos responsoriais e a danca sao centrais nessas religioes e influenciaram profundamente a musica e a cultura popular brasileira."
  },
  {
    id: "exu",
    assetId: "#exu",
    title: "Representacao de Exu",
    description:
      "As religioes afro-brasileiras organizaram seus cultos em torno de orixas, voduns e inkices, preservando cosmologias africanas mesmo em dialogo com o catolicismo e outros sistemas."
  }
];

export function SimpleArDemoPage() {
  const [isAFrameReady, setIsAFrameReady] = useState(false);
  const [isArJsReady, setIsArJsReady] = useState(false);
  const [sceneError, setSceneError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMarkerVisible, setIsMarkerVisible] = useState(false);
  const markerRef = useRef<HTMLElement | null>(null);
  const imageRefs = useRef<Array<HTMLElement | null>>([]);

  const isReady = useMemo(() => isAFrameReady && isArJsReady, [isAFrameReady, isArJsReady]);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    if (!isReady || !markerRef.current) {
      return;
    }

    const marker = markerRef.current;

    const handleMarkerFound = () => {
      setIsMarkerVisible(true);
    };

    const handleMarkerLost = () => {
      setIsMarkerVisible(false);
    };

    marker.addEventListener("markerFound", handleMarkerFound);
    marker.addEventListener("markerLost", handleMarkerLost);

    return () => {
      marker.removeEventListener("markerFound", handleMarkerFound);
      marker.removeEventListener("markerLost", handleMarkerLost);
    };
  }, [isReady]);

  useEffect(() => {
    imageRefs.current.forEach((node, index) => {
      if (!node) {
        return;
      }

      node.setAttribute("visible", index === activeIndex ? "true" : "false");
    });
  }, [activeIndex, isReady]);

  function showPreviousSlide() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNextSlide() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  return (
    <>
      <Script
        src={AFRAME_SRC}
        strategy="afterInteractive"
        onLoad={() => setIsAFrameReady(true)}
        onError={() => setSceneError("Falha ao carregar o A-Frame.")}
      />
      <Script
        src={ARJS_SRC}
        strategy="afterInteractive"
        onLoad={() => setIsArJsReady(true)}
        onError={() => setSceneError("Falha ao carregar o AR.js.")}
      />

      <main className="fixed inset-0 overflow-hidden">
        {isReady ? (
          <a-scene
            embedded
            className="ar-demo-scene"
            vr-mode-ui="enabled: false"
            renderer="logarithmicDepthBuffer: true; antialias: true; alpha: true;"
            device-orientation-permission-ui="enabled: false"
            arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
          >
            <a-assets>
              <img id="team-photo" src="/image.png" alt="" />
              <img id="casa-branca-engenho-velho" src="/wiki/casa-branca-engenho-velho.jpg" alt="" />
              <img id="terreiro-do-jaua" src="/wiki/terreiro-do-jaua.jpg" alt="" />
              <img id="ile-opo-afonja" src="/wiki/ile-opo-afonja.jpg" alt="" />
              <img id="atabaques-batuque" src="/wiki/atabaques-batuque.jpg" alt="" />
              <img id="exu" src="/wiki/exu.jpg" alt="" />
            </a-assets>

            <a-marker ref={markerRef} preset="hiro">
              {slides.map((slide, index) => (
                <a-image
                  key={slide.id}
                  ref={(node: unknown) => {
                    imageRefs.current[index] = node as HTMLElement | null;
                  }}
                  src={slide.assetId}
                  position="0 0.75 0"
                  width="1.4"
                  height="1.9"
                  visible={index === 0 ? "true" : "false"}
                />
              ))}
            </a-marker>

            <a-entity camera />
          </a-scene>
        ) : null}

        {isMarkerVisible ? (
          <div className="absolute inset-x-4 bottom-4 z-20 sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/55 p-4 text-white shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={showPreviousSlide}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm transition hover:bg-white/15"
                  aria-label="Foto anterior"
                >
                  ←
                </button>
                <div className="min-w-0 flex-1 text-center">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">
                    {activeIndex + 1} / {slides.length}
                  </p>
                  <p className="mt-1 text-sm font-semibold sm:text-base">{activeSlide.title}</p>
                  <p className="mt-1 text-sm leading-5 text-white/72">
                    {activeSlide.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={showNextSlide}
                  className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm transition hover:bg-white/15"
                  aria-label="Proxima foto"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {sceneError ? (
          <div className="absolute inset-x-4 bottom-4 z-20 rounded-2xl border border-rose-400/20 bg-black/80 p-4 text-sm text-white backdrop-blur sm:left-4 sm:right-auto sm:max-w-md">
            <p className="font-semibold">Nao foi possivel iniciar a experiencia AR.</p>
            <p className="mt-2 text-white/75">{sceneError}</p>
          </div>
        ) : null}
      </main>
    </>
  );
}
