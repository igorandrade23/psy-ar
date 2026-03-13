"use client";

import Image from "next/image";
import { TimelineEntry } from "@/app/data/timeline";

type TimelineCarouselProps = {
  entries: TimelineEntry[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export function TimelineCarousel({
  entries,
  activeIndex,
  onSelect
}: TimelineCarouselProps) {
  const activeEntry = entries[activeIndex];

  return (
    <section id="timeline" className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
      <article className="glass-panel rounded-[2rem] p-5 sm:p-6">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10">
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ backgroundColor: activeEntry.accent }}
          />
          <Image
            src={activeEntry.image}
            alt={activeEntry.name}
            width={900}
            height={1200}
            className="h-[24rem] w-full object-cover object-top sm:h-[28rem]"
            unoptimized
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-mist/70">
              {activeEntry.school}
            </p>
            <h2 className="section-title mt-2 text-3xl text-white">
              {activeEntry.name}
            </h2>
            <p className="mt-2 text-sm text-mist/80">{activeEntry.title}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-mist/60">
              Marco histórico
            </p>
            <p className="mt-1 text-3xl font-semibold text-white">
              {activeEntry.year}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onSelect((activeIndex - 1 + entries.length) % entries.length)}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => onSelect((activeIndex + 1) % entries.length)}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
            >
              Próximo
            </button>
          </div>
        </div>
      </article>

      <div className="space-y-4">
        <div className="glass-panel rounded-[2rem] p-6">
          <p className="text-sm leading-7 text-mist/90">{activeEntry.summary}</p>
          <p className="mt-4 border-l border-white/15 pl-4 text-sm leading-7 text-white/90">
            {activeEntry.impact}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => onSelect(index)}
                className={`group glass-panel min-h-[17rem] rounded-[1.6rem] p-4 text-left transition duration-300 hover:-translate-y-1 ${
                  isActive ? "ring-1 ring-white/30" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]"
                    style={{
                      backgroundColor: `${entry.accent}22`,
                      color: entry.accent
                    }}
                  >
                    {entry.year}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-mist/60">
                    {entry.school}
                  </span>
                </div>
                <h3 className="section-title mt-6 text-2xl text-white">
                  {entry.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-mist/75">
                  {entry.title}
                </p>
                <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: isActive ? "100%" : "32%",
                      backgroundColor: entry.accent
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
