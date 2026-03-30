import "react";

type AFrameElement = Record<string, unknown>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": AFrameElement;
      "a-assets": AFrameElement;
      "a-marker": AFrameElement;
      "a-entity": AFrameElement;
      "a-image": AFrameElement;
      "a-plane": AFrameElement;
      "a-text": AFrameElement;
      "a-ring": AFrameElement;
      "a-cylinder": AFrameElement;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": AFrameElement;
      "a-assets": AFrameElement;
      "a-marker": AFrameElement;
      "a-entity": AFrameElement;
      "a-image": AFrameElement;
      "a-plane": AFrameElement;
      "a-text": AFrameElement;
      "a-ring": AFrameElement;
      "a-cylinder": AFrameElement;
    }
  }
}

export {};
