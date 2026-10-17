import { describe, expect, it } from "vitest";

import { eur } from "@/test/fixtures";
import {
  creditNotePayload,
  freeCreditLine,
  hasReceivedMoney,
  lineFromInvoice,
  newCreditNoteDraft,
} from "./credit-note-draft";
import { documentDetail } from "./invoice-document-fixture";

const FORMAT = { locale: "fr-FR", currency: "EUR" } as const;

describe("creditNotePayload", () => {
  it("waits for a reason", () => {
    expect(
      creditNotePayload(FORMAT, newCreditNoteDraft(0, false), false),
    ).toBeNull();
  });

  it("sends a full credit note without lines, and no settlement on an unpaid invoice", () => {
    const draft = { ...newCreditNoteDraft(0, true), reason: 0 as const };

    expect(creditNotePayload(FORMAT, draft, false)).toEqual({
      kind: 0,
      reason: 0,
      detail: null,
      lines: [],
      settlement: null,
    });
  });

  it("asks what becomes of the money once some was received", () => {
    const draft = {
      ...newCreditNoteDraft(0, false),
      reason: 1 as const,
      settlement: 3 as const,
    };

    expect(creditNotePayload(FORMAT, draft, true)?.settlement).toBe(3);
  });

  it("holds a partial credit note until every line is complete", () => {
    const empty = { ...newCreditNoteDraft(1, false), reason: 2 as const };
    const unfinished = { ...empty, lines: [freeCreditLine(2000)] };

    expect(creditNotePayload(FORMAT, empty, false)).toBeNull();
    expect(creditNotePayload(FORMAT, unfinished, false)).toBeNull();
  });

  it("sends a line taken back with the invoice line it comes from", () => {
    const line = documentDetail().content?.lines[0];

    if (line === undefined) {
      throw new Error("the fixture has a line");
    }

    const draft = {
      ...newCreditNoteDraft(1, false),
      reason: 0 as const,
      lines: [{ ...lineFromInvoice(FORMAT, line), unitPrice: "150" }],
    };

    expect(creditNotePayload(FORMAT, draft, false)?.lines).toEqual([
      {
        label: "Atelier de cadrage",
        detail: "Demi-journée avec l'équipe produit, compte rendu inclus",
        quantityMilli: 1000,
        unit: 2,
        unitPrice: { amount: 15_000, currency: "EUR" },
        vatRateBp: 2000,
        invoiceLineId: 1,
      },
    ]);
  });

  it("only offers a corrected invoice after a full credit note", () => {
    expect(newCreditNoteDraft(1, true).reissue).toBe(false);
    expect(newCreditNoteDraft(0, true).reissue).toBe(true);
  });
});

it("knows when money was received", () => {
  expect(hasReceivedMoney(documentDetail())).toBe(false);
  expect(hasReceivedMoney(documentDetail({ amountPaid: eur(10_000) }))).toBe(
    true,
  );
});
