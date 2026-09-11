import { expect, it, vi } from "vitest";

import { onSessionExpired, reportSessionExpired } from "./session-lock";

it("reports an expiry to the subscriber", () => {
  const handler = vi.fn();
  const unsubscribe = onSessionExpired(handler);

  reportSessionExpired();
  expect(handler).toHaveBeenCalledTimes(1);

  unsubscribe();
  reportSessionExpired();
  expect(handler).toHaveBeenCalledTimes(1);
});

it("keeps the newest subscriber when a remount overlaps the old one", () => {
  const previous = vi.fn();
  const next = vi.fn();

  const unsubscribePrevious = onSessionExpired(previous);
  onSessionExpired(next);
  unsubscribePrevious();

  reportSessionExpired();

  expect(previous).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalledTimes(1);
});
