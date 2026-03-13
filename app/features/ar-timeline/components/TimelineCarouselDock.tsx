"use client";

import { TimelineEntry } from "@/app/features/ar-timeline/data/timeline-entries";

type TimelineCarouselDockProps = {
  activeEntry: TimelineEntry;
  activeIndex: number;
  entries: TimelineEntry[];
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

export function TimelineCarouselDock({
  activeEntry,
  activeIndex,
  entries,
  onPrevious,
  onNext,
  onSelect
}: TimelineCarouselDockProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-4">
      <div className="mx-auto max-w-6xl">
        <div className="pointer-events-auto rounded-[1.65rem] border border-white/10 bg-slate-950/72 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.36)] ring-1 ring-white/10 backdrop-blur-2xl">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrevious}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base text-white transition hover:bg-white/10"
              aria-label="Previous entry"
            >
              ←
            </button>

            <div className="min-w-0 flex-1 rounded-[1.2rem] border border-white/8 bg-white/[0.04] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">
                Current Stage
              </p>
              <p className="mt-1 truncate text-base font-semibold text-white">
                {activeEntry.year} · {activeEntry.name}
              </p>
              <p className="truncate text-xs text-slate-300/70">{activeEntry.school}</p>
            </div>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-base text-white transition hover:bg-white/10"
              aria-label="Next entry"
            >
              →
            </button>
          </div>

          <div className="hide-scrollbar mt-2.5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
            {entries.map((entry, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onSelect(index)}
                  className={`group relative snap-center overflow-hidden rounded-[1.25rem] border p-3 text-left transition ${
                    isActive
                      ? "min-w-[17rem] border-white/20 bg-white text-slate-950 shadow-[0_14px_36px_rgba(255,255,255,0.16)]"
                      : "min-w-[14rem] border-white/10 bg-slate-900/80 text-white hover:bg-slate-800/80"
                  }`}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ backgroundColor: entry.accent }}
                  />
                  <p className={`text-[10px] uppercase tracking-[0.24em] ${isActive ? "text-slate-600" : "text-white/45"}`}>
                    {entry.school}
                  </p>
                  <p className="mt-3 text-2xl font-semibold">{entry.year}</p>
                  <p className="mt-1 text-sm font-medium">{entry.name}</p>
                  <p className={`mt-3 line-clamp-2 text-xs leading-5 ${isActive ? "text-slate-600" : "text-slate-300/72"}`}>
                    {entry.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
