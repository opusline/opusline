import "@testing-library/jest-dom/vitest";
import "@/lib/zod";

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// jsdom throws on capture for a pointer id it never tracked, which any
// synthetic pointerdown in a test is.
Element.prototype.setPointerCapture = () => {};
Element.prototype.releasePointerCapture = () => {};
Element.prototype.hasPointerCapture = () => false;

// jsdom ships no 2D context, so anything drawing on a canvas silently gives up
// and a test can never reach what the drawing was for. Record nothing, answer
// everything.
HTMLCanvasElement.prototype.getContext = (() =>
  new Proxy(
    { canvas: null },
    {
      get: (target, key) =>
        key in target ? target[key as "canvas"] : () => {},
    },
  )) as unknown as HTMLCanvasElement["getContext"];

HTMLCanvasElement.prototype.toBlob = function toBlob(callback, type) {
  callback(new Blob([], { type: type ?? "image/png" }));
};

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!URL.createObjectURL) {
  let objectUrlCount = 0;

  URL.createObjectURL = () => {
    objectUrlCount += 1;

    return `blob:opusline/${objectUrlCount}`;
  };
  URL.revokeObjectURL = () => {};
}

if (!window.localStorage) {
  const store = new Map<string, string>();
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, String(value));
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
    },
  });
}

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);
