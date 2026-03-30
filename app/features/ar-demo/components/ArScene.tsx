"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type ArSceneProps = {
  imageSrc: string;
  onError: (message: string | null) => void;
};

export function ArScene({ imageSrc, onError }: ArSceneProps) {
  const [isAFrameReady, setIsAFrameReady] = useState(false);
  const [isArJsReady, setIsArJsReady] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isRequestingCamera, setIsRequestingCamera] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);

  const isSceneReady = isAFrameReady && isArJsReady;

  useEffect(() => {
    const isSecureHost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.protocol === "https:";

    if (!window.isSecureContext && !isSecureHost) {
      onError("A camera precisa de HTTPS ou localhost.");
      return;
    }

    onError(null);
  }, [onError]);

  useEffect(() => {
    return () => {
      previewStreamRef.current?.getTracks().forEach((track) => track.stop());
      previewStreamRef.current = null;
    };
  }, []);

  async function handleEnableCamera() {
    if (isRequestingCamera || hasCameraPermission) {
      return;
    }

    const isSecureHost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.protocol === "https:";

    if (!window.isSecureContext && !isSecureHost) {
      onError("A camera precisa de HTTPS ou localhost.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      onError("Este navegador nao suporta acesso a camera.");
      return;
    }

    setIsRequestingCamera(true);
    onError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment"
          }
        },
        audio: false
      });

      previewStreamRef.current = stream;

      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
        await previewVideoRef.current.play();
      }

      stream.getTracks().forEach((track) => track.stop());
      previewStreamRef.current = null;

      setHasCameraPermission(true);
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "NotAllowedError"
          ? "Permissao da camera negada. Libere o acesso no navegador."
          : "Nao consegui abrir a camera. Tente novamente.";

      onError(message);
    } finally {
      setIsRequestingCamera(false);
    }
  }

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.6.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={() => setIsAFrameReady(true)}
        onError={() => onError("Falha ao carregar o A-Frame.")}
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="afterInteractive"
        onLoad={() => setIsArJsReady(true)}
        onError={() => onError("Falha ao carregar o AR.js.")}
      />

      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {!hasCameraPermission ? (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-[1.5rem] border border-white/10 bg-black/70 p-5 text-center text-white backdrop-blur">
              <video
                ref={previewVideoRef}
                className="hidden"
                autoPlay
                muted
                playsInline
              />
              <p className="text-sm font-semibold">Ativar camera</p>
              <p className="mt-2 text-sm text-white/75">
                Primeiro vamos liberar a camera. Depois a foto aparece ao apontar para o Hiro.
              </p>
              <button
                type="button"
                onClick={handleEnableCamera}
                disabled={isRequestingCamera}
                className="mt-4 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-wait disabled:opacity-70"
              >
                {isRequestingCamera ? "Abrindo camera..." : "Permitir camera"}
              </button>
            </div>
          </div>
        ) : null}

        {hasCameraPermission && !isSceneReady ? (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-sm text-white backdrop-blur">
              Carregando AR...
            </div>
          </div>
        ) : null}

        {hasCameraPermission && isSceneReady ? (
          <a-scene
            className="ar-scene"
            embedded
            loading-screen="enabled: false"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
            renderer="antialias: true; alpha: true;"
            arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
          >
            <a-assets timeout="10000">
              <img id="ar-demo-image" src={imageSrc} alt="" />
            </a-assets>

            <a-marker preset="hiro">
              <a-entity position="0 1 0">
                <a-plane
                  width="1.5"
                  height="2"
                  material="src: #ar-demo-image; shader: flat"
                />
              </a-entity>
            </a-marker>

            <a-entity camera />
          </a-scene>
        ) : null}
      </div>
    </>
  );
}
