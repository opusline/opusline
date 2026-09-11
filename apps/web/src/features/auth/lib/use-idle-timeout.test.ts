import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { useIdleTimeout } from "./use-idle-timeout";

const IDLE_MS = 30 * 60_000;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("reports an idle page once the window has passed", () => {
  const onIdle = vi.fn();
  renderHook(() => useIdleTimeout(IDLE_MS, true, onIdle));

  act(() => {
    vi.advanceTimersByTime(IDLE_MS - 1000);
  });
  expect(onIdle).not.toHaveBeenCalled();

  act(() => {
    vi.advanceTimersByTime(30_000);
  });
  expect(onIdle).toHaveBeenCalled();
});

it("pushes the window back on deliberate input", () => {
  const onIdle = vi.fn();
  renderHook(() => useIdleTimeout(IDLE_MS, true, onIdle));

  act(() => {
    vi.advanceTimersByTime(IDLE_MS - 60_000);
    window.dispatchEvent(new Event("keydown"));
    vi.advanceTimersByTime(IDLE_MS - 60_000);
  });

  expect(onIdle).not.toHaveBeenCalled();

  act(() => {
    vi.advanceTimersByTime(120_000);
  });
  expect(onIdle).toHaveBeenCalled();
});

it("stays quiet while it is disabled", () => {
  const onIdle = vi.fn();
  renderHook(() => useIdleTimeout(IDLE_MS, false, onIdle));

  act(() => {
    vi.advanceTimersByTime(IDLE_MS * 4);
  });

  expect(onIdle).not.toHaveBeenCalled();
});
