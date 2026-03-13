"use client";

import { useState } from "react";
import { ArViewer } from "@/app/components/ArViewer";
import { timelineEntries } from "@/app/data/timeline";

export function AppShell() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeEntry = timelineEntries[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + timelineEntries.length) % timelineEntries.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % timelineEntries.length);
  };

  return (
    <main className="min-h-screen bg-black">
      <ArViewer
        entry={activeEntry}
        entries={timelineEntries}
        activeIndex={activeIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onSelect={setActiveIndex}
      />
    </main>
  );
}
