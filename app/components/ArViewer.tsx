"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TimelineEntry } from "@/app/data/timeline";

type ArViewerProps = {
  entry: TimelineEntry;
  entries: TimelineEntry[];
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

declare global {
  interface Window {
    AFRAME?: unknown;
  }
}

const AFRAME_SRC = "https://aframe.io/releases/1.6.0/aframe.min.js";
const ARJS_SRC = "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js";

function wrapText(value: string, maxLineLength: number) {
  const words = value.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLineLength && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      continue;
    }

    currentLine = nextLine;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[data-codex-src="${src}"]`);

    if (existing) {
      if ((existing as HTMLScriptElement).dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
        once: true
      });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.codexSrc = src;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true }
    );
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
      once: true
    });
    document.head.appendChild(script);
  });
}

function createSceneMarkup() {
  return `
    <a-scene
      embedded
      renderer="antialias: true; alpha: true; logarithmicDepthBuffer: true; colorManagement: true;"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
      arjs="trackingMethod: best; sourceType: webcam; facingMode: environment; debugUIEnabled: false;"
    >
      <a-assets timeout="15000">
        <img id="timeline-portrait" crossorigin="anonymous" />
      </a-assets>

      <a-marker preset="hiro" smooth="true" smoothCount="8" smoothTolerance="0.01" smoothThreshold="5">
        <a-entity position="0 1.1 0">
          <a-plane id="timeline-card-base" width="2.35" height="3.18" color="#07131d" opacity="0.96" position="0 0 0"></a-plane>
          <a-plane id="timeline-card-accent" width="2.35" height="0.14" color="#f4c95d" position="0 1.52 0.02"></a-plane>
          <a-plane id="timeline-card-image" width="2.04" height="1.34" position="0 0.64 0.03" material="shader: flat"></a-plane>
          <a-plane id="timeline-card-divider" width="2.04" height="0.02" color="#f4c95d" position="0 -0.1 0.03"></a-plane>
          <a-text id="timeline-card-year" align="center" color="#f4c95d" width="4.3" position="0 0.05 0.04"></a-text>
          <a-text id="timeline-card-title" align="center" color="#ffffff" width="3.2" position="0 -0.36 0.04"></a-text>
          <a-text id="timeline-card-summary" align="center" color="#c8d7e6" width="3" position="0 -1.04 0.04"></a-text>
        </a-entity>

        <a-entity position="0 3.02 0">
          <a-plane width="2.35" height="0.62" color="#071018" opacity="0.92"></a-plane>
          <a-text id="timeline-card-school" align="center" color="#f4c95d" width="3.2" position="0 0.12 0.02"></a-text>
          <a-text id="timeline-card-headline" align="center" color="#ffffff" width="3.05" position="0 -0.13 0.02"></a-text>
        </a-entity>

        <a-ring id="timeline-card-ring" radius-inner="0.42" radius-outer="0.48" color="#f4c95d" rotation="-90 0 0" position="0 0.03 0"></a-ring>
        <a-cylinder id="timeline-card-cylinder" color="#f4c95d" radius="0.11" height="0.22" position="0 0.12 0"></a-cylinder>
      </a-marker>

      <a-entity camera></a-entity>
    </a-scene>
  `;
}

export function ArViewer({
  entry,
  entries,
  activeIndex,
  onPrevious,
  onNext,
  onSelect
}: ArViewerProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const currentLabel = useMemo(
    () => `${entry.year} · ${entry.name} · ${entry.school}`,
    [entry.name, entry.school, entry.year]
  );

  useEffect(() => {
    document.body.dataset.arMode = "true";

    let cancelled = false;

    async function setupScene() {
      try {
        await loadScript(AFRAME_SRC);
        await loadScript(ARJS_SRC);

        if (cancelled || !stageRef.current) {
          return;
        }

        if (!stageRef.current.querySelector("a-scene")) {
          stageRef.current.innerHTML = createSceneMarkup();
        }

        setIsSceneReady(true);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Falha ao carregar AR.js.");
        }
      }
    }

    setupScene();

    return () => {
      cancelled = true;
      delete document.body.dataset.arMode;
    };
  }, []);

  useEffect(() => {
    if (!isSceneReady || !stageRef.current) {
      return;
    }

    const root = stageRef.current;
    const portrait = root.querySelector("#timeline-portrait");
    const cardImage = root.querySelector("#timeline-card-image");
    const yearNode = root.querySelector("#timeline-card-year");
    const titleNode = root.querySelector("#timeline-card-title");
    const summaryNode = root.querySelector("#timeline-card-summary");
    const schoolNode = root.querySelector("#timeline-card-school");
    const headlineNode = root.querySelector("#timeline-card-headline");
    const accentIds = [
      "#timeline-card-accent",
      "#timeline-card-divider",
      "#timeline-card-ring",
      "#timeline-card-cylinder"
    ];

    portrait?.setAttribute("src", entry.image);
    cardImage?.setAttribute("material", `src: ${entry.image}; shader: flat`);
    yearNode?.setAttribute("value", entry.year);
    yearNode?.setAttribute("color", entry.accent);
    titleNode?.setAttribute("value", entry.title);
    summaryNode?.setAttribute("value", wrapText(entry.summary, 34));
    schoolNode?.setAttribute("value", entry.school);
    schoolNode?.setAttribute("color", entry.accent);
    headlineNode?.setAttribute("value", wrapText(entry.arHeadline, 28));

    accentIds.forEach((selector) => {
      root.querySelector(selector)?.setAttribute("color", entry.accent);
    });
  }, [entry, isSceneReady]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div ref={stageRef} className="absolute inset-0 z-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-32 bg-gradient-to-b from-black/65 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-64 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-3">
          <div className="pointer-events-auto max-w-[78vw] rounded-[1.35rem] border border-white/12 bg-gradient-to-br from-slate-950/88 via-slate-900/72 to-slate-950/82 px-3 py-3 shadow-[0_18px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/8 backdrop-blur-2xl sm:max-w-md sm:px-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">
                Timeline AR
              </p>
            </div>
            <p className="section-title mt-2 text-xl text-white sm:text-3xl">
              Estruturalismo ao behaviorismo
            </p>
            <p className="mt-1.5 max-w-sm text-xs leading-5 text-slate-200/72 sm:text-sm">
              Mire no marcador Hiro e use a barra inferior para navegar pela linha do tempo.
            </p>
          </div>

          <a
            href="/markers/hiro-clean-marker.svg"
            download
            className="pointer-events-auto shrink-0 rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] ring-1 ring-white/10 backdrop-blur-2xl transition hover:bg-white/16 sm:px-4 sm:py-2.5 sm:text-sm"
          >
            Marcador
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-2.5">
          <div className="pointer-events-auto rounded-[1.45rem] border border-white/12 bg-gradient-to-br from-slate-950/92 via-slate-900/72 to-slate-950/86 p-2.5 shadow-[0_18px_60px_rgba(0,0,0,0.38)] ring-1 ring-white/8 backdrop-blur-2xl sm:p-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrevious}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 px-3 text-xs font-medium text-white transition hover:bg-white/12 sm:h-11 sm:min-w-11 sm:text-sm"
              >
                Voltar
              </button>

              <div className="min-w-0 flex-1 rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-2 text-center">
                <p className="truncate text-[10px] uppercase tracking-[0.26em] text-white/45 sm:text-[11px]">
                  Etapa atual
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-white sm:text-base">
                  {entry.year} · {entry.name}
                </p>
                <p className="truncate text-[11px] text-slate-300/75 sm:text-xs">
                  {entry.school}
                </p>
              </div>

              <button
                type="button"
                onClick={onNext}
                className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 px-3 text-xs font-medium text-white transition hover:bg-white/12 sm:h-11 sm:min-w-11 sm:text-sm"
              >
                Avancar
              </button>
            </div>
          </div>

          <div className="pointer-events-auto hide-scrollbar flex gap-2 overflow-x-auto pb-1">
            {entries.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`group relative min-w-max overflow-hidden rounded-full border px-3 py-2 text-xs font-medium shadow-[0_8px_20px_rgba(0,0,0,0.22)] backdrop-blur-xl transition sm:px-4 sm:text-sm ${
                    isActive
                      ? "border-white/30 bg-white text-slate-950"
                      : "border-white/12 bg-slate-950/55 text-white/88 hover:bg-white/12"
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="relative z-10">{item.year}</span>
                  <span
                    className={`absolute inset-x-2 bottom-1 h-px transition ${
                      isActive ? "bg-slate-950/30" : "bg-white/0 group-hover:bg-white/25"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {!isSceneReady && !loadError ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/45 backdrop-blur-sm">
          <div className="rounded-full border border-white/12 bg-slate-950/78 px-4 py-3 text-sm text-white shadow-[0_18px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
            Inicializando camera e AR...
          </div>
        </div>
      ) : null}

      {loadError ? (
        <div className="absolute inset-x-4 top-1/2 z-20 -translate-y-1/2 rounded-[1.4rem] border border-rose-400/20 bg-slate-950/82 p-4 text-sm text-white shadow-[0_18px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/8 backdrop-blur-2xl sm:inset-x-auto sm:left-1/2 sm:w-[28rem] sm:-translate-x-1/2">
          <p className="font-semibold">Falha ao iniciar a experiencia AR.</p>
          <p className="mt-2 text-white/75">{loadError}</p>
        </div>
      ) : null}
    </section>
  );
}
