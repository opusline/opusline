import { decodeHandoff, PORTALS } from "@opusline/portal-handoff";
import { describe, expect, it } from "vitest";

import { eur } from "@/test/fixtures";

import {
  creditVatDeclaration,
  urssafDeclaration,
  vatDeclaration,
} from "./fixtures";
import { prefillHref, urssafHandoff, vatHandoff } from "./handoff";
import { ca3Rows, declarationCopyValue } from "./labels";

const issuedAt = new Date("2026-08-03T09:15:00Z");

describe("urssafHandoff", () => {
  it("carries the period and the base in whole euros", () => {
    expect(urssafHandoff(urssafDeclaration(), issuedAt)).toEqual({
      v: 1,
      portal: "urssaf",
      period: "2026-07",
      issuedAt: "2026-08-03T09:15:00.000Z",
      fields: { turnover: 10450 },
    });
  });

  it("rounds the way the copy button does", () => {
    const payload = urssafHandoff(
      urssafDeclaration({ base: eur(1_045_050) }),
      issuedAt,
    );

    expect(payload.fields).toEqual({
      turnover: Number(declarationCopyValue(1_045_050)),
    });
  });
});

describe("vatHandoff", () => {
  it("carries every box the card shows, the tax column of 08 apart", () => {
    const payload = vatHandoff(vatDeclaration(), issuedAt);

    expect(payload).toMatchObject({ portal: "impots", period: "2026-07" });
    expect(payload.fields).toEqual({
      A1: 10450,
      "2A": 31,
      "3B": 68,
      "08": 10549,
      "08_tax": 2110,
      "19": 0,
      "20": 132,
      "21": 0,
      "22": 0,
      "32": 1978,
    });
  });

  it.each([
    ["a month to pay", vatDeclaration()],
    ["a month in credit", creditVatDeclaration()],
  ])("lists the same boxes as the card rows for %s", (_label, vat) => {
    const boxesShown = ca3Rows(vat, "fr-FR", String).map((row) => row.box);
    const boxesSent = Object.keys(vatHandoff(vat, issuedAt).fields).filter(
      (box) => box !== "08_tax",
    );

    // Object.keys puts integer-like boxes first; the set is what must match.
    expect(boxesSent.sort()).toEqual(boxesShown.sort());
  });
});

describe("prefillHref", () => {
  it("lands on the portal's public page and decodes back to the payload", () => {
    const payload = urssafHandoff(urssafDeclaration(), issuedAt);
    const url = new URL(prefillHref(payload));

    expect(url.origin + url.pathname).toBe(PORTALS.urssaf.url);
    expect(decodeHandoff(url.hash)).toEqual(payload);
  });
});
