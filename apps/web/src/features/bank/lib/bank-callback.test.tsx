import { renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { expect, it, vi } from "vitest";

import {
  parseBankCallbackSearch,
  useBankAuthorizationCallback,
} from "./bank-callback";

it("keeps only the text parameters the bank sends back", () => {
  expect(
    parseBankCallbackSearch({ code: "c-1", state: "s1a", error: "", page: 2 }),
  ).toEqual({ code: "c-1", state: "s1a", error: undefined });
});

it("completes an authorization once, even when strict mode replays it", () => {
  const complete = vi.fn();
  const cancel = vi.fn();

  renderHook(
    () =>
      useBankAuthorizationCallback(
        { code: "c-1", state: "s1a" },
        { complete, cancel },
      ),
    { wrapper: StrictMode },
  );

  expect(complete).toHaveBeenCalledExactlyOnceWith({
    code: "c-1",
    state: "s1a",
  });
  expect(cancel).not.toHaveBeenCalled();
});

it("reports a cancelled authorization", () => {
  const complete = vi.fn();
  const cancel = vi.fn();

  renderHook(() =>
    useBankAuthorizationCallback(
      { error: "access_denied", state: "s1a" },
      { complete, cancel },
    ),
  );

  expect(cancel).toHaveBeenCalledOnce();
  expect(complete).not.toHaveBeenCalled();
});

it("does nothing on an ordinary visit", () => {
  const complete = vi.fn();
  const cancel = vi.fn();

  renderHook(() => useBankAuthorizationCallback({}, { complete, cancel }));

  expect(complete).not.toHaveBeenCalled();
  expect(cancel).not.toHaveBeenCalled();
});
