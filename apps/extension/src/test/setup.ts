import { beforeEach, vi } from "vitest";

/**
 * An in-memory `chrome` for jsdom: `storage.local` as the real one behaves for
 * a content script, and `i18n` echoing keys so assertions read the message
 * name rather than French copy. Reset per test; `src/lib/ext.ts` binds to the
 * object once, so it is replaced in place rather than reassigned.
 */
const store = new Map<string, unknown>();

const storageLocal = {
  get: vi.fn(async (key: string) =>
    store.has(key) ? { [key]: store.get(key) } : {},
  ),
  set: vi.fn(async (items: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(items)) {
      store.set(key, value);
    }
  }),
  remove: vi.fn(async (key: string) => {
    store.delete(key);
  }),
};

const i18n = {
  getMessage: vi.fn((key: string, substitutions?: string[]) =>
    substitutions === undefined ? key : `${key}(${substitutions.join("|")})`,
  ),
  getUILanguage: vi.fn(() => "fr"),
};

Object.defineProperty(globalThis, "chrome", {
  value: { storage: { local: storageLocal }, i18n },
  configurable: true,
});

beforeEach(() => {
  store.clear();
  vi.clearAllMocks();
});

export const storedHandoffs = (): Record<string, unknown> =>
  Object.fromEntries(store);
