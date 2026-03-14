"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { TimelineEntry } from "@/app/features/ar-timeline/data/timeline-entries";
import { wrapText } from "@/app/features/ar-timeline/lib/wrap-text";

type ArSceneProps = {
  entry: TimelineEntry;
  onError: (message: string | null) => void;
};

export function ArScene({ entry, onError }: ArSceneProps) {
  const [isAFrameReady, setIsAFrameReady] = useState(false);
  const [isArJsReady, setIsArJsReady] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<"environment" | "user">(
    "environment"
  );
  const sceneRootRef = useRef<HTMLDivElement | null>(null);

  const isSceneReady = isAFrameReady && isArJsReady && isCameraReady;

  useEffect(() => {
    let isCancelled = false;

    async function prepareCamera() {
      const isSecureHost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "https:";

      if (!window.isSecureContext && !isSecureHost) {
        onError("The camera requires HTTPS or localhost.");
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        onError("This browser does not support camera access for AR.");
        return;
      }

      const attempts: Array<{
        constraints: MediaStreamConstraints;
        facingMode: "environment" | "user";
      }> = [
        {
          constraints: {
            video: {
              facingMode: { ideal: "environment" }
            },
            audio: false
          },
          facingMode: "environment"
        },
        {
          constraints: {
            video: true,
            audio: false
          },
          facingMode: "user"
        }
      ];

      for (const attempt of attempts) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(attempt.constraints);
          stream.getTracks().forEach((track) => track.stop());

          if (isCancelled) {
            return;
          }

          setCameraFacingMode(attempt.facingMode);
          setIsCameraReady(true);
          onError(null);
          return;
        } catch (error) {
          if (attempt === attempts[attempts.length - 1] && !isCancelled) {
            const message =
              error instanceof DOMException
                ? `${error.name}: ${error.message}`
                : "Unable to access a camera on this device.";

            onError(message);
          }
        }
      }
    }

    prepareCamera();

    return () => {
      isCancelled = true;
    };
  }, [onError]);

  useEffect(() => {
    const isSecureHost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.protocol === "https:";

    if (!window.isSecureContext && !isSecureHost) {
      return;
    }
  }, []);

  useEffect(() => {
    if (!isSceneReady || !sceneRootRef.current) {
      return;
    }

    const root = sceneRootRef.current;

    root.querySelector("#timeline-portrait")?.setAttribute("src", entry.image);
    root
      .querySelector("#timeline-card-image")
      ?.setAttribute("material", `src: ${entry.image}; shader: flat`);
    root.querySelector("#timeline-card-year")?.setAttribute("value", entry.year);
    root.querySelector("#timeline-card-year")?.setAttribute("color", entry.accent);
    root.querySelector("#timeline-card-title")?.setAttribute("value", wrapText(entry.title, 24));
    root.querySelector("#timeline-card-summary")?.setAttribute("value", wrapText(entry.summary, 32));
    root.querySelector("#timeline-card-school")?.setAttribute("value", entry.school);
    root.querySelector("#timeline-card-school")?.setAttribute("color", entry.accent);
    root
      .querySelector("#timeline-card-headline")
      ?.setAttribute("value", wrapText(entry.arHeadline, 28));

    [
      "#timeline-card-accent",
      "#timeline-card-divider",
      "#timeline-card-ring",
      "#timeline-card-cylinder"
    ].forEach((selector) => {
      root.querySelector(selector)?.setAttribute("color", entry.accent);
    });
  }, [entry, isSceneReady]);

  return (
    <>
      <Script
        src="https://aframe.io/releases/1.6.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={() => setIsAFrameReady(true)}
        onError={() => onError("Failed to load A-Frame.")}
      />
      <Script
        src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"
        strategy="afterInteractive"
        onLoad={() => setIsArJsReady(true)}
        onError={() => onError("Failed to load AR.js.")}
      />

      <div ref={sceneRootRef} className="absolute inset-0 z-0">
        {isSceneReady ? (
          <a-scene
            embedded
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: false"
            arjs={`sourceType: webcam; facingMode: ${cameraFacingMode}; videoTexture: true; debugUIEnabled: false;`}
            renderer="alpha: true; antialias: true;"
          >
            <a-assets timeout="15000">
              <img id="timeline-portrait" crossOrigin="anonymous" />
            </a-assets>

            <a-marker preset="hiro" smooth="true" smoothCount="6" smoothTolerance="0.01" smoothThreshold="3">
              <a-entity position="0 1.08 0">
                <a-plane
                  id="timeline-card-base"
                  width="2.18"
                  height="3.02"
                  color="#07131d"
                  opacity="0.96"
                  position="0 0 0"
                />
                <a-plane
                  id="timeline-card-accent"
                  width="2.18"
                  height="0.12"
                  color="#f4c95d"
                  position="0 1.45 0.02"
                />
                <a-plane
                  id="timeline-card-image"
                  width="1.9"
                  height="1.22"
                  position="0 0.7 0.03"
                  material="shader: flat"
                />
                <a-plane
                  id="timeline-card-divider"
                  width="1.9"
                  height="0.02"
                  color="#f4c95d"
                  position="0 -0.02 0.03"
                />
                <a-text id="timeline-card-year" align="center" color="#f4c95d" width="4" position="0 0.12 0.04" />
                <a-text id="timeline-card-title" align="center" color="#ffffff" width="2.9" position="0 -0.32 0.04" />
                <a-text id="timeline-card-summary" align="center" color="#dbe7f4" width="2.7" position="0 -1.02 0.04" />
              </a-entity>

              <a-entity position="0 2.88 0">
                <a-plane width="2.18" height="0.56" color="#071018" opacity="0.92" />
                <a-text id="timeline-card-school" align="center" color="#f4c95d" width="3" position="0 0.11 0.02" />
                <a-text id="timeline-card-headline" align="center" color="#ffffff" width="2.9" position="0 -0.12 0.02" />
              </a-entity>

              <a-ring id="timeline-card-ring" radius-inner="0.42" radius-outer="0.47" color="#f4c95d" rotation="-90 0 0" position="0 0.03 0" />
              <a-cylinder id="timeline-card-cylinder" color="#f4c95d" radius="0.11" height="0.2" position="0 0.1 0" />
            </a-marker>

            <a-entity camera />
          </a-scene>
        ) : null}
      </div>
    </>
  );
}
