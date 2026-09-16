declare const browser: typeof chrome | undefined;

/**
 * Firefox exposes the WebExtension API as `browser` and Chrome as `chrome`;
 * both are promise-based under Manifest V3, so one name serves every call.
 */
export const ext: typeof chrome =
  typeof browser === "undefined" ? chrome : browser;
