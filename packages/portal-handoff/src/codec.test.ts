import { describe, expect, it } from "vitest";

import { decodeHandoff, encodeHandoff, handoffUrl } from "./codec";
import type { HandoffPayload, ImpotsHandoff, UrssafHandoff } from "./payload";
import { PORTALS } from "./portals";

const urssaf: UrssafHandoff = {
  v: 1,
  portal: "urssaf",
  period: "2026-07",
  issuedAt: "2026-08-03T09:15:00.000Z",
  fields: { turnover: 10450 },
};

const impots: ImpotsHandoff = {
  v: 1,
  portal: "impots",
  period: "2026-07",
  issuedAt: "2026-08-03T09:15:00.000Z",
  fields: { A1: 10450, "08": 10450, "08_tax": 2090, "20": 310, "32": 1780 },
};

function tamper(payload: HandoffPayload, patch: Record<string, unknown>) {
  return `#opusline=${encodeHandoff({ ...payload, ...patch } as HandoffPayload)}`;
}

describe("encodeHandoff", () => {
  it("produces a url-safe token without padding", () => {
    const token = encodeHandoff(impots);

    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("survives non-ascii text in the payload", () => {
    const payload = { ...urssaf, period: "2026-Q3" };

    expect(decodeHandoff(`#opusline=${encodeHandoff(payload)}`)).toEqual(
      payload,
    );
  });
});

describe("handoffUrl", () => {
  it("lands on the portal's public page with the token in the fragment", () => {
    const url = new URL(handoffUrl(urssaf));

    expect(url.origin + url.pathname).toBe(PORTALS.urssaf.url);
    expect(decodeHandoff(url.hash)).toEqual(urssaf);
  });
});

describe("decodeHandoff", () => {
  it.each([
    ["a urssaf payload", urssaf],
    ["an impots payload", impots],
  ])("round-trips %s", (_label, payload) => {
    expect(decodeHandoff(`#opusline=${encodeHandoff(payload)}`)).toEqual(
      payload,
    );
  });

  it("accepts a quarterly urssaf period", () => {
    const quarterly = { ...urssaf, period: "2026-Q2" };

    expect(decodeHandoff(`#opusline=${encodeHandoff(quarterly)}`)).toEqual(
      quarterly,
    );
  });

  it("reads the hash with or without its leading hash sign", () => {
    const token = encodeHandoff(urssaf);

    expect(decodeHandoff(`opusline=${token}`)).toEqual(urssaf);
    expect(decodeHandoff(`#other=1&opusline=${token}`)).toEqual(urssaf);
  });

  it.each([
    ["an empty hash", ""],
    ["a hash without the key", "#section-2"],
    ["garbage base64", "#opusline=%%%not-base64"],
    [
      "a json scalar",
      `#opusline=${encodeHandoff(42 as unknown as HandoffPayload)}`,
    ],
    [
      "a json array",
      `#opusline=${encodeHandoff([] as unknown as HandoffPayload)}`,
    ],
  ])("returns null for %s", (_label, hash) => {
    expect(decodeHandoff(hash)).toBeNull();
  });

  it.each([
    ["an unknown version", tamper(urssaf, { v: 2 })],
    ["an unknown portal", tamper(urssaf, { portal: "cfe" })],
    ["a malformed period", tamper(urssaf, { period: "2026-13" })],
    ["a period with a day", tamper(urssaf, { period: "2026-07-01" })],
    ["an unparseable issuedAt", tamper(urssaf, { issuedAt: "yesterday" })],
    ["cents in the turnover", tamper(urssaf, { fields: { turnover: 104.5 } })],
    ["a negative turnover", tamper(urssaf, { fields: { turnover: -1 } })],
    ["a string turnover", tamper(urssaf, { fields: { turnover: "10450" } })],
    [
      "an extra urssaf field",
      tamper(urssaf, { fields: { turnover: 1, vat: 2 } }),
    ],
    ["an unknown ca3 box", tamper(impots, { fields: { A1: 1, "99": 2 } })],
    ["no ca3 box at all", tamper(impots, { fields: {} })],
    ["cents in a ca3 box", tamper(impots, { fields: { A1: 1.5 } })],
    ["ca3 fields as an array", tamper(impots, { fields: [1] })],
  ])("rejects %s", (_label, hash) => {
    expect(decodeHandoff(hash)).toBeNull();
  });
});
