import type { InvoicingSettingsData } from "@opusline/api-client";

export const invoicingSettingsFixture: InvoicingSettingsData = {
  mode: 0,
  defaultPaymentTermsDays: 30,
  defaultPaymentTermsEndOfMonth: false,
  quoteValidityDays: 30,
  latePenaltyRateBp: null,
  operationCategory: 0,
  showIbanOnInvoices: true,
  showEmailOnDocuments: true,
  vatOnDebits: false,
  customMentions: null,
  documentLanguage: 0,
  vatLiable: false,
  legalReference: {
    semester: "2026-H2",
    checkedOn: "2026-10-14",
    nextRevisionOn: "2027-01-01",
    legalInterestRateBp: 275,
    minimumPenaltyRateBp: 825,
    ecbRateBp: 240,
    statutoryPenaltyRateBp: 1240,
    recoveryFee: { amount: 4000, currency: "EUR" },
    sources: {
      legal_interest_rate:
        "https://www.service-public.gouv.fr/particuliers/vosdroits/F20688",
      late_penalties:
        "https://help.shine.fr/fr/articles/4062963-comment-calculer-les-penalites-de-retard-de-paiement",
      mandatory_mentions:
        "https://help.shine.fr/fr/articles/6715420-quelles-mentions-doivent-figurer-sur-mes-devis-factures",
    },
  },
};
