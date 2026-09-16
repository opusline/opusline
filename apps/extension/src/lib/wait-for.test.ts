import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { documentFrom } from "../test/dom";
import { WaitTimeoutError, waitFor } from "./wait-for";

describe("waitFor", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("resolves at once when the probe already matches", async () => {
    const doc = documentFrom('<input id="ca">');

    await expect(
      waitFor(() => doc.getElementById("ca"), { timeoutMs: 1000, target: doc }),
    ).resolves.toBe(doc.getElementById("ca"));
  });

  it("resolves when a later mutation makes the probe match", async () => {
    const doc = documentFrom("<main></main>");
    const pending = waitFor(() => doc.getElementById("ca"), {
      timeoutMs: 1000,
      target: doc,
    });

    const input = doc.createElement("input");
    input.id = "ca";
    doc.querySelector("main")?.append(input);
    await vi.advanceTimersByTimeAsync(0);

    await expect(pending).resolves.toBe(input);
  });

  it("rejects with a timeout error once the deadline passes", async () => {
    const doc = documentFrom("<main></main>");
    const pending = waitFor(() => doc.getElementById("ca"), {
      timeoutMs: 500,
      target: doc,
    });
    const settled = pending.catch((error: unknown) => error);

    await vi.advanceTimersByTimeAsync(500);

    expect(await settled).toBeInstanceOf(WaitTimeoutError);
  });
});
