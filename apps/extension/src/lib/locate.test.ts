import { describe, expect, it } from "vitest";

import { documentFrom } from "../test/dom";
import { locateByLabel, locateBySelectors } from "./locate";

describe("locateBySelectors", () => {
  it("returns the first selector that hits a fillable input", () => {
    const doc = documentFrom(
      '<input type="checkbox" id="x"><input type="text" id="y">',
    );

    expect(locateBySelectors(doc, ["#missing", "#x", "#y"])?.id).toBe("y");
  });
});

describe("locateByLabel", () => {
  it("follows a label's for attribute", () => {
    const doc = documentFrom(
      '<label for="bic">Prestations BIC</label><input id="bic"><label for="bnc">Autres prestations de services (BNC)</label><input id="bnc">',
    );

    expect(locateByLabel(doc, /\bBNC\b/)?.id).toBe("bnc");
  });

  it("finds an input nested in its label", () => {
    const doc = documentFrom('<label>Recettes BNC <input name="ca"></label>');

    expect(locateByLabel(doc, /BNC/)?.name).toBe("ca");
  });

  it("resolves aria-labelledby back to the label", () => {
    const doc = documentFrom(
      '<span id="lbl"></span><label id="l1">Montant BNC</label><input aria-labelledby="lbl l1" type="number">',
    );

    expect(locateByLabel(doc, /BNC/)?.type).toBe("number");
  });

  it("falls back to aria-label on the input itself", () => {
    const doc = documentFrom(
      '<input aria-label="Chiffre d\'affaires BNC" type="tel">',
    );

    expect(locateByLabel(doc, /BNC/)?.type).toBe("tel");
  });

  it("returns null when nothing matches", () => {
    const doc = documentFrom('<label for="x">Ventes</label><input id="x">');

    expect(locateByLabel(doc, /BNC/)).toBeNull();
  });
});
