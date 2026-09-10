import { useEffect } from "react";

/** What the tab should be saying about the timer. */
export type TimerFaviconState = "idle" | "running" | "paused";

/**
 * The marks live in `public/` rather than as inline data URIs so the icons stay
 * editable SVG files next to the logo they are a variation of.
 */
const FAVICONS: Record<TimerFaviconState, string> = {
  idle: "/logo.svg",
  running: "/timer-running.svg",
  paused: "/timer-paused.svg",
};

function applyFavicon(href: string): void {
  const current =
    document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');

  if (current?.getAttribute("href") === href) {
    return;
  }

  // Replacing the node instead of assigning `href`: browsers cache the icon
  // against the link element, and several keep painting the old one when only
  // the attribute moves.
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.href = href;

  current?.remove();
  document.head.append(link);
}

/**
 * Puts the timer's state in the browser tab, so a window buried behind an
 * editor still says whether time is being counted.
 */
export function useTimerFavicon(state: TimerFaviconState): void {
  useEffect(() => {
    applyFavicon(FAVICONS[state]);
  }, [state]);

  // Signing out unmounts the timer, and a tab left on the login screen must not
  // keep claiming a timer is running.
  useEffect(() => () => applyFavicon(FAVICONS.idle), []);
}
