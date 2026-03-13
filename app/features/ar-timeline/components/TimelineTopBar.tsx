"use client";

import { TimelineEntry } from "@/app/features/ar-timeline/data/timeline-entries";

type TimelineTopBarProps = {
  activeEntry: TimelineEntry;
};

export function TimelineTopBar({ activeEntry }: TimelineTopBarProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="pointer-events-auto rounded-full border border-white/10 bg-slate-950/68 px-3 py-2 shadow-[0_14px_36px_rgba(0,0,0,0.28)] ring-1 ring-white/10 backdrop-blur-2xl sm:px-4">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-2 w-2 rounded-full shadow-[0_0_12px_rgba(244,201,93,0.9)]"
              style={{ backgroundColor: activeEntry.accent }}
            />
            <p className="text-[10px] uppercase tracking-[0.26em] text-white/58">
              AR Timeline
            </p>
            <p className="section-title hidden text-base text-white sm:block">
              Structuralism to Behaviorism
            </p>
          </div>
        </div>

        <a
          href="/markers/hiro-marker.png"
          download
          className="pointer-events-auto shrink-0 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/15 sm:px-4 sm:text-sm"
        >
          Download Hiro
        </a>
      </div>
    </div>
  );
}
