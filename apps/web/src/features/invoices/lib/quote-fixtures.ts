import type {
  InvoicePaperData,
  QuoteBillingData,
  QuoteContentData,
  QuoteData,
  QuoteDetailData,
  QuoteListItemData,
} from "@opusline/api-client";
import { CLIENT_FIXTURE, eur, MISSION_FIXTURE } from "@/test/fixtures";
import { invoicePaperFixture } from "./invoice-paper-fixture";

export const QUOTE_FIXTURE = {
  id: 1,
  clientId: 1,
  missionId: 10,
  number: "D-2026-003",
  status: 1,
  source: 1,
  isExpired: false,
  title: "Refonte de l'espace client",
  language: 0,
  issuedOn: "2026-10-01",
  validityDays: 30,
  validUntil: "2026-10-31",
  depositRateBp: 3000,
  depositAmount: eur(1_144_800),
  acceptedOn: null,
  refusedOn: null,
  amountHt: eur(3_180_000),
  amountVat: eur(636_000),
  amountTtc: eur(3_816_000),
  vatRateBp: 2000,
} satisfies QuoteData;

const CONTENT: QuoteContentData = {
  description: null,
  paymentTermsDays: 30,
  paymentTermsEndOfMonth: false,
  showEmail: true,
  customMentions: null,
  lines: [
    {
      id: 1,
      label: "Atelier de cadrage",
      detail: "Demi-journée avec l'équipe produit, compte rendu inclus",
      quantityMilli: 1000,
      unit: 2,
      unitPrice: eur(300_000),
      vatRateBp: 2000,
      totalHt: eur(300_000),
    },
    {
      id: 2,
      label: "Développement des écrans compte et commandes",
      detail: null,
      quantityMilli: 6000,
      unit: 0,
      unitPrice: eur(480_000),
      vatRateBp: 2000,
      totalHt: eur(2_880_000),
    },
  ],
  vatBreakdown: [{ rateBp: 2000, base: eur(3_180_000), vat: eur(636_000) }],
  seller: null,
  buyer: null,
};

export function quoteItem(
  overrides: Partial<QuoteData> = {},
  context: Partial<Pick<QuoteListItemData, "client" | "mission">> = {},
): QuoteListItemData {
  return {
    quote: { ...QUOTE_FIXTURE, ...overrides },
    client: context.client ?? CLIENT_FIXTURE,
    mission: context.mission === undefined ? MISSION_FIXTURE : context.mission,
  };
}

/** Nothing invoiced and nothing offered: what a quote not yet accepted carries. */
export const NO_BILLING: QuoteBillingData = {
  invoices: [],
  invoicedTtc: eur(0),
  canInvoiceDeposit: false,
  canInvoiceBalance: false,
  canInvoiceFull: false,
};

/** An accepted quote whose deposit invoice went out: the balance is next. */
export const DEPOSIT_BILLED: QuoteBillingData = {
  invoices: [
    {
      id: 41,
      number: "2026-041",
      status: 1,
      isLate: false,
      billing: 0,
      amountTtc: eur(1_144_800),
    },
  ],
  invoicedTtc: eur(1_144_800),
  canInvoiceDeposit: false,
  canInvoiceBalance: true,
  canInvoiceFull: false,
};

/** A quote written in Opusline, sent and awaiting the client's answer. */
export function quoteDetail(
  overrides: Partial<QuoteData> = {},
  billing: QuoteBillingData = NO_BILLING,
): QuoteDetailData {
  return {
    quote: { ...QUOTE_FIXTURE, ...overrides },
    client: CLIENT_FIXTURE,
    mission: MISSION_FIXTURE,
    content: CONTENT,
    document: null,
    billing,
    emails: [],
  };
}

/** A quote recorded from another tool: its own reference, no lines, no deposit, no sheet. */
export function externalQuoteDetail(
  overrides: Partial<QuoteData> = {},
  billing: QuoteBillingData = NO_BILLING,
): QuoteDetailData {
  return {
    ...quoteDetail(
      {
        number: "DEV-118",
        source: 0,
        title: "Refonte du back-office",
        depositRateBp: null,
        depositAmount: null,
        amountHt: eur(480_000),
        amountVat: eur(96_000),
        amountTtc: eur(576_000),
        ...overrides,
      },
      billing,
    ),
    content: { ...CONTENT, lines: [], vatBreakdown: [] },
  };
}

/** The sheet of QUOTE_FIXTURE, as the API resolves it in French. */
export const quotePaperFixture: InvoicePaperData = {
  ...invoicePaperFixture,
  title: "Devis n° D-2026-003",
  meta: [
    { label: "Émise le", value: "01/10/2026" },
    { label: "Valable jusqu'au", value: "31/10/2026" },
    { label: "Prestation", value: "Refonte de l'espace client" },
  ],
  totals: [
    ...invoicePaperFixture.totals,
    {
      label: "Acompte à l'acceptation (30 %)",
      value: "11 448,00 €",
      emphasis: false,
    },
  ],
  paymentTitle: null,
  payment: [],
  legal:
    "Devis valable jusqu'au 31/10/2026. Un acompte de 30 % du total TTC est dû à l'acceptation. Factures payables à 30 jours.",
  signature: {
    title: "Bon pour accord",
    caption:
      "Date, signature et cachet, précédés de la mention « Bon pour accord ».",
  },
  footer: "D-2026-003",
};
