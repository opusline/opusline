import type { UrssafHandoff } from "@opusline/portal-handoff";
import { describe, expect, it } from "vitest";

import { storedHandoffs } from "../test/setup";
import {
  clearHandoff,
  HANDOFF_TTL_MS,
  loadHandoff,
  saveHandoff,
} from "./handoff-storage";

const payload: UrssafHandoff = {
  v: 1,
  portal: "urssaf",
  period: "2026-07",
  issuedAt: "2026-08-03T09:00:00.000Z",
  fields: { turnover: 10450 },
};

describe("loadHandoff", () => {
  it("returns null when nothing waits for the portal", async () => {
    expect(await loadHandoff("urssaf")).toBeNull();
  });

  it("returns a payload saved for the portal, keyed per portal", async () => {
    await saveHandoff(payload);

    expect(
      await loadHandoff("urssaf", new Date("2026-08-03T10:00:00Z")),
    ).toEqual(payload);
    expect(
      await loadHandoff("impots", new Date("2026-08-03T10:00:00Z")),
    ).toBeNull();
  });

  it("keeps a payload right up to the ttl", async () => {
    await saveHandoff(payload);
    const lastValid = new Date(Date.parse(payload.issuedAt) + HANDOFF_TTL_MS);

    expect(await loadHandoff("urssaf", lastValid)).toEqual(payload);
  });

  it("drops and forgets a payload older than the ttl", async () => {
    await saveHandoff(payload);
    const expired = new Date(Date.parse(payload.issuedAt) + HANDOFF_TTL_MS + 1);

    expect(await loadHandoff("urssaf", expired)).toBeNull();
    expect(storedHandoffs()).toEqual({});
  });
});

describe("clearHandoff", () => {
  it("removes only the portal's payload", async () => {
    await saveHandoff(payload);
    await saveHandoff({ ...payload, portal: "impots", fields: { A1: 1 } });

    await clearHandoff("urssaf");

    expect(Object.keys(storedHandoffs())).toEqual(["handoff:impots"]);
  });
});
