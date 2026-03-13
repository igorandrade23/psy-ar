"use client";

import { useCallback, useEffect, useState } from "react";
import { ArScene } from "@/app/features/ar-timeline/components/ArScene";
import { TimelineCarouselDock } from "@/app/features/ar-timeline/components/TimelineCarouselDock";
import { TimelineTopBar } from "@/app/features/ar-timeline/components/TimelineTopBar";
import { timelineEntries } from "@/app/features/ar-timeline/data/timeline-entries";

export function TimelineArExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sceneError, setSceneError] = useState<string | null>(null);

  const activeEntry = timelineEntries[activeIndex];

  const handlePrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + timelineEntries.length) % timelineEntries.length);
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % timelineEntries.length);
  }, []);

  useEffect(() => {
    document.body.dataset.arMode = "true";

    return () => {
      delete document.body.dataset.arMode;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <ArScene entry={activeEntry} onError={setSceneError} />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-24 bg-gradient-to-b from-black/72 via-black/28 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-56 bg-gradient-to-t from-black/90 via-black/36 to-transparent" />

      <TimelineTopBar activeEntry={activeEntry} />
      <TimelineCarouselDock
        activeEntry={activeEntry}
        activeIndex={activeIndex}
        entries={timelineEntries}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSelect={setActiveIndex}
      />

      {!sceneError ? (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="mx-auto inline-flex rounded-full border border-white/10 bg-slate-950/68 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/60 shadow-[0_14px_40px_rgba(0,0,0,0.3)] ring-1 ring-white/10 backdrop-blur-xl">
            Point your camera at the custom marker
          </div>
        </div>
      ) : null}

      {sceneError ? (
        <div className="absolute inset-x-4 top-1/2 z-20 -translate-y-1/2 rounded-[1.35rem] border border-rose-400/20 bg-slate-950/84 p-4 text-sm text-white ring-1 ring-white/10 backdrop-blur-2xl sm:inset-x-auto sm:left-1/2 sm:w-[28rem] sm:-translate-x-1/2">
          <p className="font-semibold">Failed to start the AR experience.</p>
          <p className="mt-2 text-white/75">{sceneError}</p>
        </div>
      ) : null}
    </main>
  );
}
