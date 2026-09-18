import { renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, expect, it, vi } from "vitest";

import {
  parseBankCallbackSearch,
  useBankAuthorizationCallback,
} from "./bank-callback";

afterEach(() => sessionStorage.clear());

function handlers() {
  return { complete: vi.fn(), cancel: vi.fn(), replayed: vi.fn() };
}

it("keeps only the text parameters the bank sends back", () => {
  expect(
    parseBankCallbackSearch({ code: "c-1", state: "s1a", error: "", page: 2 }),
  ).toEqual({ code: "c-1", state: "s1a", error: undefined });
});

it("completes an authorization once, even when strict mode replays it", () => {
  const { complete, cancel, replayed } = handlers();

  renderHook(
    () =>
      useBankAuthorizationCallback(
        { code: "c-1", state: "s1a" },
        { complete, cancel, replayed },
      ),
    { wrapper: StrictMode },
  );

  expect(complete).toHaveBeenCalledExactlyOnceWith({
    code: "c-1",
    state: "s1a",
  });
  expect(cancel).not.toHaveBeenCalled();
  expect(replayed).not.toHaveBeenCalled();
});

it("reports a cancelled authorization", () => {
  const { complete, cancel, replayed } = handlers();

  renderHook(() =>
    useBankAuthorizationCallback(
      { error: "access_denied", state: "s1a" },
      { complete, cancel, replayed },
    ),
  );

  expect(cancel).toHaveBeenCalledOnce();
  expect(complete).not.toHaveBeenCalled();
});

it("does nothing on an ordinary visit", () => {
  const { complete, cancel, replayed } = handlers();

  renderHook(() =>
    useBankAuthorizationCallback({}, { complete, cancel, replayed }),
  );

  expect(complete).not.toHaveBeenCalled();
  expect(cancel).not.toHaveBeenCalled();
});

it("does not send an authorization again after a reload of the callback", () => {
  const first = handlers();
  const { unmount } = renderHook(() =>
    useBankAuthorizationCallback({ code: "c-1", state: "s1a" }, first),
  );
  unmount();

  const afterReload = handlers();
  renderHook(() =>
    useBankAuthorizationCallback({ code: "c-1", state: "s1a" }, afterReload),
  );

  expect(first.complete).toHaveBeenCalledOnce();
  expect(afterReload.complete).not.toHaveBeenCalled();
  expect(afterReload.replayed).toHaveBeenCalledOnce();
});

it("sends a new authorization from the same tab", () => {
  const first = handlers();
  renderHook(() =>
    useBankAuthorizationCallback({ code: "c-1", state: "s1a" }, first),
  ).unmount();

  const second = handlers();
  renderHook(() =>
    useBankAuthorizationCallback({ code: "c-2", state: "s2b" }, second),
  );

  expect(second.complete).toHaveBeenCalledExactlyOnceWith({
    code: "c-2",
    state: "s2b",
  });
});
