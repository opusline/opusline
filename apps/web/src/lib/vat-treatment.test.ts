import { expect, it } from "vitest";

import { VAT_TREATMENTS, vatMention, vatTreatmentLabel } from "./vat-treatment";

it("names every treatment the API can return", () => {
  for (const treatment of VAT_TREATMENTS) {
    expect(vatTreatmentLabel(treatment)).not.toBe("");
  }
});

it("carries no mention for the standard treatment", () => {
  // Charging the usual rate justifies nothing, so there is nothing to print.
  expect(vatMention(0)).toBeNull();
});

it("cites the reverse-charge article when the client accounts for the VAT", () => {
  expect(vatMention(1)).toContain("283-2");
});

it("cites the out-of-scope article for a client outside the EU", () => {
  expect(vatMention(2)).toContain("259-1");
});

it("keeps the legal mentions in French, which is the wording the law asks for", () => {
  expect(vatMention(1)).toContain("Autoliquidation");
  expect(vatMention(2)).toContain("TVA non applicable");
});
