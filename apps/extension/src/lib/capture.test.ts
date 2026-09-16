import { encodeHandoff, type UrssafHandoff } from "@opusline/portal-handoff";
import { describe, expect, it, vi } from "vitest";

import { fakeLocation } from "../test/dom";
import { storedHandoffs } from "../test/setup";
import { captureHandoff } from "./capture";

const payload: UrssafHandoff = {
  v: 1,
  portal: "urssaf",
  period: "2026-07",
  issuedAt: "2026-08-03T09:00:00.000Z",
  fields: { turnover: 10450 },
};

function fakeHistory() {
  return { replaceState: vi.fn() } as unknown as History & {
    replaceState: ReturnType<typeof vi.fn>;
  };
}

describe("captureHandoff", () => {
  it("stores the payload and strips the fragment", async () => {
    const history = fakeHistory();

    const captured = await captureHandoff(
      "urssaf",
      fakeLocation(`#opusline=${encodeHandoff(payload)}`),
      history,
    );

    expect(captured).toBe(true);
    expect(storedHandoffs()).toEqual({ "handoff:urssaf": payload });
    expect(history.replaceState).toHaveBeenCalledWith(
      null,
      "",
      "/portail/accueil.html",
    );
  });

  it("leaves a page without a payload alone", async () => {
    const history = fakeHistory();

    expect(
      await captureHandoff("urssaf", fakeLocation("#section"), history),
    ).toBe(false);
    expect(storedHandoffs()).toEqual({});
    expect(history.replaceState).not.toHaveBeenCalled();
  });

  it("leaves a payload addressed to the other portal untouched", async () => {
    const history = fakeHistory();

    const captured = await captureHandoff(
      "impots",
      fakeLocation(`#opusline=${encodeHandoff(payload)}`),
      history,
    );

    expect(captured).toBe(false);
    expect(storedHandoffs()).toEqual({});
    expect(history.replaceState).not.toHaveBeenCalled();
  });
});
