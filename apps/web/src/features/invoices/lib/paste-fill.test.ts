import { describe, expect, it } from "vitest";
import { newInvoiceDraft } from "./invoice-draft";
import { editorClients } from "./invoice-editor-fixture";
import { invoicingSettingsFixture } from "./invoicing-settings-fixture";
import {
  fillDraft,
  parsePastedDocument,
  pasteFillPrompt,
  pasteFillSample,
} from "./paste-fill";

const FORMAT = { locale: "fr-FR", currency: "EUR" } as const;

const QUOTE_BLOCK = `Voici le devis :
<opusline-document type="devis">
  <client>nordlys</client>
  <titre>Refonte de l'espace client</titre>
  <description>Deux semaines de travail</description>
  <ligne>
    <designation>Atelier de cadrage</designation>
    <detail>Demi-journée avec l'équipe</detail>
    <quantite>1</quantite>
    <unite>forfait</unite>
    <prix_unitaire_ht>300</prix_unitaire_ht>
    <tva>20</tva>
  </ligne>
  <ligne>
    <designation>Développement &amp; recette</designation>
    <quantite>6,5</quantite>
    <unite>j</unite>
    <prix_unitaire_ht>480.50</prix_unitaire_ht>
    <tva>5.5</tva>
  </ligne>
  <delai_paiement>30fm</delai_paiement>
  <validite_jours>60</validite_jours>
  <acompte_pourcent>30</acompte_pourcent>
</opusline-document>
Bonne journée.`;

function context(kind: "invoice" | "quote", defaultVatRateBp = 2000) {
  return {
    kind,
    clients: editorClients,
    settings: invoicingSettingsFixture,
    defaultVatRateBp,
  };
}

describe("parsePastedDocument", () => {
  it("reads the block out of the surrounding prose", () => {
    const pasted = parsePastedDocument(QUOTE_BLOCK);

    expect(pasted).toMatchObject({
      kind: "quote",
      client: "nordlys",
      title: "Refonte de l'espace client",
      description: "Deux semaines de travail",
      paymentTerm: "30fm",
      validityDays: 60,
      depositPercent: 30,
    });
    expect(pasted?.lines).toEqual([
      {
        label: "Atelier de cadrage",
        detail: "Demi-journée avec l'équipe",
        quantity: 1,
        unit: "forfait",
        unitPrice: 300,
        vatPercent: 20,
      },
      {
        label: "Développement & recette",
        detail: "",
        quantity: 6.5,
        unit: "j",
        unitPrice: 480.5,
        vatPercent: 5.5,
      },
    ]);
  });

  it("accepts a bare ampersand, as an AI writes one", () => {
    const pasted = parsePastedDocument(
      '<opusline-document type="facture"><ligne><designation>Son & lumière</designation></ligne></opusline-document>',
    );

    expect(pasted?.lines[0]?.label).toBe("Son & lumière");
  });

  it("returns null for text without the block", () => {
    expect(
      parsePastedDocument(
        "Devis — Refonte\n- Atelier : 300 €\n- 6 jours × 480 €",
      ),
    ).toBeNull();
  });

  it("returns null for a block it cannot parse", () => {
    expect(
      parsePastedDocument(
        '<opusline-document type="facture"><ligne><designation>Oups</ligne></opusline-document>',
      ),
    ).toBeNull();
  });

  it("reads the sample it offers", () => {
    expect(parsePastedDocument(pasteFillSample("quote"))?.lines).toHaveLength(
      2,
    );
    expect(parsePastedDocument(pasteFillSample("invoice"))).toMatchObject({
      kind: "invoice",
      validityDays: null,
    });
  });
});

describe("fillDraft", () => {
  const pasted = parsePastedDocument(QUOTE_BLOCK);

  if (pasted === null) {
    throw new Error("the block must parse");
  }

  it("picks the client whatever the case, and takes its payment term over", () => {
    const draft = newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture);

    const { draft: filled, filled: fields } = fillDraft(
      FORMAT,
      draft,
      pasted,
      context("quote"),
    );

    expect(filled.clientId).toBe(1);
    expect(filled.title).toBe("Refonte de l'espace client");
    expect(filled.description).toBe("Deux semaines de travail");
    // The pasted term lands after the client's own, so it is what the text said.
    expect(filled.paymentTerm).toBe("30fm");
    expect(filled.validityDays).toBe(60);
    expect(filled.depositRateBp).toBe(3000);
    expect(fields).toEqual([
      { kind: "client", name: "Nordlys" },
      { kind: "title" },
      { kind: "description" },
      { kind: "lines", count: 2 },
      { kind: "term" },
      { kind: "validity", days: 60 },
      { kind: "deposit", percent: 30 },
    ]);
  });

  it("adds the lines in the locale's notation, units and rates mapped", () => {
    const draft = newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture);

    const { draft: filled } = fillDraft(
      FORMAT,
      draft,
      pasted,
      context("quote"),
    );

    expect(filled.lines).toHaveLength(2);
    expect(filled.lines[0]).toMatchObject({
      label: "Atelier de cadrage",
      detail: "Demi-journée avec l'équipe",
      quantity: "1",
      unit: 2,
      unitPrice: "300",
      vatRateBp: 2000,
    });
    expect(filled.lines[1]).toMatchObject({
      quantity: "6,5",
      unit: 0,
      unitPrice: "480,5",
      vatRateBp: 550,
    });
  });

  it("keeps the lines already on the draft", () => {
    const draft = newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture);
    const existing = {
      ...draft,
      lines: [
        {
          key: "mine",
          label: "Déjà là",
          detail: "",
          quantity: "1",
          unit: 0 as const,
          unitPrice: "100",
          vatRateBp: 2000,
        },
      ],
    };

    const { draft: filled } = fillDraft(
      FORMAT,
      existing,
      pasted,
      context("quote"),
    );

    expect(filled.lines.map((line) => line.label)).toEqual([
      "Déjà là",
      "Atelier de cadrage",
      "Développement & recette",
    ]);
  });

  it("puts every line at 0 % under the franchise", () => {
    const draft = newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture);

    const { draft: filled } = fillDraft(
      FORMAT,
      draft,
      pasted,
      context("quote", 0),
    );

    expect(filled.lines.map((line) => line.vatRateBp)).toEqual([0, 0]);
  });

  it("falls back to the default rate, unit and quantity when the tag is off", () => {
    const draft = newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture);
    const odd = parsePastedDocument(
      '<opusline-document type="facture"><ligne><designation>X</designation><quantite>0</quantite><unite>semaine</unite><tva>7</tva></ligne><delai_paiement>90</delai_paiement></opusline-document>',
    );

    if (odd === null) {
      throw new Error("the block must parse");
    }

    const { draft: filled, filled: fields } = fillDraft(
      FORMAT,
      draft,
      odd,
      context("invoice"),
    );

    expect(filled.lines[0]).toMatchObject({
      quantity: "1",
      unit: 2,
      unitPrice: "",
      vatRateBp: 2000,
    });
    expect(filled.paymentTerm).toBe(draft.paymentTerm);
    expect(fields).toEqual([{ kind: "lines", count: 1 }]);
  });

  it("ignores the quote terms on an invoice and an unknown client", () => {
    const draft = newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture);
    const foreign = { ...pasted, client: "Vesterhus" };

    const { draft: filled, filled: fields } = fillDraft(
      FORMAT,
      draft,
      foreign,
      context("invoice"),
    );

    expect(filled.clientId).toBeNull();
    expect(filled.validityDays).toBe(draft.validityDays);
    expect(filled.depositRateBp).toBeNull();
    expect(fields.map((field) => field.kind)).toEqual([
      "title",
      "description",
      "lines",
      "term",
    ]);
  });

  it("reads « fm » as end of the month", () => {
    const draft = newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture);
    const monthEnd = parsePastedDocument(
      '<opusline-document type="facture"><delai_paiement>fm</delai_paiement></opusline-document>',
    );

    if (monthEnd === null) {
      throw new Error("the block must parse");
    }

    expect(
      fillDraft(FORMAT, draft, monthEnd, context("invoice")).draft.paymentTerm,
    ).toBe("0fm");
  });
});

describe("pasteFillPrompt", () => {
  it("names the account's clients and the quote tags only for a quote", () => {
    const quote = pasteFillPrompt("quote", ["Nordlys", "Callisto"], "€");
    const invoice = pasteFillPrompt("invoice", [], "€");

    expect(quote).toContain("Nordlys, Callisto");
    expect(quote).toContain("<validite_jours>");
    expect(quote).toContain('type="devis"');
    expect(invoice).not.toContain("<validite_jours>");
    expect(invoice).toContain('type="facture"');
  });
});
