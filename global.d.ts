export {};

type SketchfabCameraState = {
  position: number[];
  target: number[];
};

type SketchfabApi = {
  start: () => void;
  addEventListener: (event: string, callback: () => void) => void;
  getCameraLookAt: (
    callback: (error: unknown, camera: SketchfabCameraState) => void
  ) => void;
  setCameraLookAt: (
    position: number[],
    target: number[],
    duration?: number,
    callback?: (error: unknown) => void
  ) => void;
};

type SketchfabClient = {
  init: (
    uid: string,
    options: Record<string, unknown> & {
      success: (api: SketchfabApi) => void;
      error: () => void;
    }
  ) => void;
};

declare global {
  interface Window {
    Sketchfab?: {
      new (iframe: HTMLIFrameElement): SketchfabClient;
      new (version: string, iframe: HTMLIFrameElement): SketchfabClient;
    };
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        "a-scene": Record<string, unknown>;
        "a-assets": Record<string, unknown>;
        "a-asset-item": Record<string, unknown>;
        "a-marker": Record<string, unknown>;
        "a-image": Record<string, unknown>;
        "a-video": Record<string, unknown>;
        "a-entity": Record<string, unknown>;
      }
    }
  }
}
