import type {
  CreditNoteData,
  InvoiceContentData,
  InvoiceDetailData,
} from "@opusline/api-client";

import { eur } from "@/test/fixtures";
import { invoiceDetail } from "./fixtures";

const CONTENT: InvoiceContentData = {
  title: "Refonte de l'espace client",
  description: null,
  language: 0,
  paymentTermsDays: 30,
  paymentTermsEndOfMonth: true,
  latePenaltyRateBp: null,
  showIban: true,
  showEmail: true,
  customMentions: null,
  lines: [
    {
      id: 1,
      label: "Atelier de cadrage",
      detail: "Demi-journée avec l'équipe produit, compte rendu inclus",
      quantityMilli: 1000,
      unit: 2,
      unitPrice: eur(30_000),
      vatRateBp: 2000,
      totalHt: eur(30_000),
    },
  ],
  vatBreakdown: [{ rateBp: 2000, base: eur(30_000), vat: eur(6000) }],
  seller: null,
  buyer: null,
  timeEntryIds: [],
};

/** An invoice written in Opusline, issued and waiting for its payment. */
export function documentDetail(
  overrides: Parameters<typeof invoiceDetail>[0] = {},
): InvoiceDetailData {
  return {
    ...invoiceDetail({ source: 1, number: "2026-001", ...overrides }),
    content: CONTENT,
  };
}

/** A credit note issued on the document above, still owing its refund. */
export const creditNoteFixture: CreditNoteData = {
  id: 7,
  invoiceId: 1,
  number: "A-2026-001",
  status: 0,
  kind: 1,
  reason: 2,
  detail: "1 h de maintenance comptée deux fois",
  settlement: 2,
  language: 0,
  issuedOn: "2026-08-10",
  settledOn: null,
  amountHt: eur(10_000),
  amountVat: eur(2000),
  amountTtc: eur(12_000),
};
