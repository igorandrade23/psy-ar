"use client";

import { useEffect, useState } from "react";
import { ArScene } from "@/app/features/ar-demo/components/ArScene";

const DEMO_IMAGE = "/image.png";

export function ArDemoExperience() {
  const [sceneError, setSceneError] = useState<string | null>(null);

  useEffect(() => {
    document.body.dataset.arMode = "true";

    return () => {
      delete document.body.dataset.arMode;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <ArScene imageSrc={DEMO_IMAGE} onError={setSceneError} />

      <div className="absolute left-3 top-3 z-10 flex gap-2 sm:left-4 sm:top-4">
        <a
          href="/marker"
          className="rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs font-medium text-white backdrop-blur"
        >
          Abrir Hiro
        </a>
        <div className="rounded-full border border-white/10 bg-black/55 px-3 py-2 text-xs text-white/90 backdrop-blur">
          Aponte para o marcador
        </div>
      </div>

      {sceneError ? (
        <div className="absolute inset-x-4 bottom-4 z-20 rounded-[1.25rem] border border-rose-400/20 bg-black/80 p-4 text-sm text-white backdrop-blur sm:inset-x-auto sm:left-4 sm:max-w-md">
          <p className="font-semibold">Nao foi possivel iniciar a experiencia AR.</p>
          <p className="mt-2 text-white/75">{sceneError}</p>
        </div>
      ) : null}
    </main>
  );
}
