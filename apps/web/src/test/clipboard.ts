import { afterEach, beforeEach, vi } from "vitest";

/**
 * Stubs `navigator.clipboard` around every test in the calling file. Call it at
 * module level and read `writeText` inside the tests.
 *
 * The restore is not optional housekeeping: vitest.config.ts runs with
 * `isolate: false`, so a stub left in place answers for every later file in the
 * same worker.
 */
export function stubClipboard(): { writeText: ReturnType<typeof vi.fn> } {
  const original = Object.getOwnPropertyDescriptor(navigator, "clipboard");
  const writeText = vi.fn();

  beforeEach(() => {
    writeText.mockReset().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
  });

  afterEach(() => {
    if (original === undefined) {
      Reflect.deleteProperty(navigator, "clipboard");
      return;
    }

    Object.defineProperty(navigator, "clipboard", original);
  });

  return { writeText };
}
