import { encodeHandoff, type UrssafHandoff } from "@opusline/portal-handoff";
import { describe, expect, it } from "vitest";

import { BANNER_TAG } from "../lib/banner";
import { runPortal } from "../lib/run-portal";
import { documentFrom, fakeLocation } from "../test/dom";
import { storedHandoffs } from "../test/setup";
import { urssafAdapter } from "./urssaf";

const payload: UrssafHandoff = {
  v: 1,
  portal: "urssaf",
  period: "2026-07",
  issuedAt: "2026-08-03T09:00:00.000Z",
  fields: { turnover: 10450 },
};

// Stands in for fixtures/urssaf-form.html until the real form is captured.
const FORM = `
  <form>
    <label for="ventes">Ventes de marchandises (BIC)</label><input id="ventes" type="text">
    <label for="prestaBic">Prestations de services commerciales ou artisanales (BIC)</label><input id="prestaBic" type="text">
    <label for="prestaBnc">Autres prestations de services (BNC)</label><input id="prestaBnc" type="text">
    <button type="submit">Valider</button>
  </form>`;

function environment(doc: Document, hash = "") {
  return {
    document: doc,
    location: fakeLocation(hash),
    history: { replaceState: () => {} } as unknown as History,
    formTimeoutMs: 1000,
    now: () => new Date("2026-08-03T10:00:00Z"),
  };
}

describe("urssafAdapter", () => {
  it("types the turnover into the BNC line only", () => {
    const doc = documentFrom(FORM);

    expect(urssafAdapter.isFormPresent(doc)).toBe(true);
    expect(urssafAdapter.fields[0].locate(doc)?.id).toBe("prestaBnc");
    expect(urssafAdapter.values(payload)).toEqual({ turnover: 10450 });
  });

  it("does not see a form on the landing page", () => {
    expect(urssafAdapter.isFormPresent(documentFrom("<h1>Accueil</h1>"))).toBe(
      false,
    );
  });
});

describe("runPortal on the urssaf portal", () => {
  it("parks the payload on the landing page and fills the form on a later page", async () => {
    await runPortal(
      urssafAdapter,
      environment(
        documentFrom("<h1>Accueil</h1>"),
        `#opusline=${encodeHandoff(payload)}`,
      ),
    );
    expect(storedHandoffs()).toEqual({ "handoff:urssaf": payload });

    const formDoc = documentFrom(FORM);
    await runPortal(urssafAdapter, environment(formDoc));

    expect(formDoc.querySelector<HTMLInputElement>("#prestaBnc")?.value).toBe(
      "10450",
    );
    expect(formDoc.querySelector<HTMLInputElement>("#prestaBic")?.value).toBe(
      "",
    );
    expect(formDoc.querySelector(BANNER_TAG)).not.toBeNull();
    expect(storedHandoffs()).toEqual({});
  });

  it("does nothing on a page with no payload waiting", async () => {
    const formDoc = documentFrom(FORM);

    await runPortal(urssafAdapter, environment(formDoc));

    expect(formDoc.querySelector<HTMLInputElement>("#prestaBnc")?.value).toBe(
      "",
    );
    expect(formDoc.querySelector(BANNER_TAG)).toBeNull();
  });
});
