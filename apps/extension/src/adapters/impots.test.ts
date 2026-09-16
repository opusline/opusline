import { encodeHandoff, type ImpotsHandoff } from "@opusline/portal-handoff";
import { describe, expect, it } from "vitest";

import { BANNER_TAG } from "../lib/banner";
import { fillFields } from "../lib/fill";
import { runPortal } from "../lib/run-portal";
import { documentFrom, fakeLocation } from "../test/dom";
import { storedHandoffs } from "../test/setup";
import { impotsAdapter } from "./impots";

const payload: ImpotsHandoff = {
  v: 1,
  portal: "impots",
  period: "2026-07",
  issuedAt: "2026-08-03T09:00:00.000Z",
  fields: {
    A1: 10450,
    "2A": 0,
    "08": 10450,
    "08_tax": 2090,
    "20": 310,
    "22": 0,
    "32": 1780,
  },
};

// Stands in for fixtures/ca3-form.html until the real form is captured: a
// labelled block, then a table whose rows carry the line code in their first
// cell, with the tax column and the computed lines locked.
const FORM = `
  <fieldset>
    <label for="a1">A1 - Ventes, prestations de services</label><input id="a1" type="text">
    <label for="a2">2A - Achats intracommunautaires</label><input id="a2" type="text">
  </fieldset>
  <table>
    <tr><td>08</td><td>Taux normal 20 %</td><td><input id="b08" type="text"></td><td><input id="t08" type="text" readonly></td></tr>
    <tr><td>20</td><td>Autres biens et services</td><td><input id="b20" type="text"></td></tr>
    <tr><td>22</td><td>Crédit reporté</td><td><input id="b22" type="text"></td></tr>
    <tr><td>32</td><td>Total à payer</td><td><input id="b32" type="text" disabled></td></tr>
  </table>`;

function environment(doc: Document, hash = "") {
  return {
    document: doc,
    location: fakeLocation(hash),
    history: { replaceState: () => {} } as unknown as History,
    formTimeoutMs: 1000,
    now: () => new Date("2026-08-03T10:00:00Z"),
  };
}

function inputValue(doc: Document, id: string): string | undefined {
  return doc.querySelector<HTMLInputElement>(`#${id}`)?.value;
}

describe("impotsAdapter", () => {
  it("finds every line by its code, through labels or row headings", () => {
    const doc = documentFrom(FORM);
    const located = Object.fromEntries(
      impotsAdapter.fields.map(({ key, locate }) => [
        key,
        locate(doc)?.id ?? null,
      ]),
    );

    expect(located).toEqual({
      A1: "a1",
      "2A": "a2",
      "3B": null,
      "08": "b08",
      "08_tax": "t08",
      "19": null,
      "20": "b20",
      "21": null,
      "22": "b22",
      "25": null,
      "32": "b32",
    });
  });

  it("does not mistake the 20 % of line 08 for line 20", () => {
    const doc = documentFrom(
      '<table><tr><td>08</td><td>Taux normal 20 %</td><td><input id="b08"></td></tr></table>',
    );
    const line20 = impotsAdapter.fields.find(({ key }) => key === "20");

    expect(line20?.locate(doc)).toBeNull();
  });

  it("types the payload's boxes and reports the locked and missing ones", () => {
    const doc = documentFrom(FORM);

    const outcome = fillFields(
      impotsAdapter.fields,
      impotsAdapter.values(payload),
      doc,
    );

    expect(inputValue(doc, "a1")).toBe("10450");
    expect(inputValue(doc, "a2")).toBe("0");
    expect(inputValue(doc, "b08")).toBe("10450");
    expect(inputValue(doc, "b20")).toBe("310");
    expect(inputValue(doc, "t08")).toBe("");
    expect(outcome.filled.map(({ key }) => key)).toEqual([
      "A1",
      "2A",
      "08",
      "20",
      "22",
    ]);
    expect(outcome.skipped).toEqual([
      { key: "08_tax", reason: "readonly" },
      { key: "32", reason: "readonly" },
    ]);
  });

  it("labels the tax column apart from the base", () => {
    expect(impotsAdapter.fieldLabel("08_tax")).toBe("field_box(08 (taxe))");
    expect(impotsAdapter.fieldLabel("A1")).toBe("field_box(A1)");
  });
});

describe("runPortal on the impots portal", () => {
  it("parks the payload on the landing page and fills the form later", async () => {
    await runPortal(
      impotsAdapter,
      environment(
        documentFrom("<h1>Accueil</h1>"),
        `#opusline=${encodeHandoff(payload)}`,
      ),
    );
    expect(Object.keys(storedHandoffs())).toEqual(["handoff:impots"]);

    const formDoc = documentFrom(FORM);
    await runPortal(impotsAdapter, environment(formDoc));

    expect(inputValue(formDoc, "a1")).toBe("10450");
    expect(formDoc.querySelector(BANNER_TAG)).not.toBeNull();
    expect(storedHandoffs()).toEqual({});
  });
});
