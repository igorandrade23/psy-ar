export {};

declare global {
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
