import { renderHook } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";

import { useTimerFavicon } from "./use-timer-favicon";

const tabIcon = () =>
  document.head
    .querySelector<HTMLLinkElement>('link[rel="icon"]')
    ?.getAttribute("href") ?? null;

beforeEach(() => {
  for (const link of document.head.querySelectorAll('link[rel="icon"]')) {
    link.remove();
  }

  const link = document.createElement("link");
  link.rel = "icon";
  link.href = "/logo.svg";
  document.head.append(link);
});

it("marks the tab while a timer runs", () => {
  renderHook(() => useTimerFavicon("running"));

  expect(tabIcon()).toBe("/timer-running.svg");
});

it("tells a paused timer apart from a running one", () => {
  renderHook(() => useTimerFavicon("paused"));

  expect(tabIcon()).toBe("/timer-paused.svg");
});

it("goes back to the logo once the timer is stopped", () => {
  const { rerender } = renderHook(
    (state: "idle" | "running") => useTimerFavicon(state),
    { initialProps: "running" },
  );

  rerender("idle");

  expect(tabIcon()).toBe("/logo.svg");
});

it("goes back to the logo when the app unmounts", () => {
  const { unmount } = renderHook(() => useTimerFavicon("running"));

  unmount();

  expect(tabIcon()).toBe("/logo.svg");
});

it("leaves exactly one icon behind after several changes", () => {
  const { rerender } = renderHook(
    (state: "idle" | "running" | "paused") => useTimerFavicon(state),
    { initialProps: "running" },
  );

  rerender("paused");
  rerender("idle");

  expect(document.head.querySelectorAll('link[rel="icon"]')).toHaveLength(1);
});
