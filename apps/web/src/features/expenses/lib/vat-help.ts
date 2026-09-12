import { m } from "@/paraglide/messages.js";

import type { VatChoice } from "./vat";

type VatChoiceCopy = {
  label: () => string;
  help: () => string;
  /** What the invoice shows for this choice — the tell the user checks. */
  cue: () => string;
};

export const VAT_CHOICE_MESSAGES: Record<VatChoice, VatChoiceCopy> = {
  fr20: {
    label: m.expense_vat_fr20_label,
    help: m.expense_vat_fr20_help,
    cue: m.expense_vat_fr20_cue,
  },
  fr10: {
    label: m.expense_vat_fr10_label,
    help: m.expense_vat_fr10_help,
    cue: m.expense_vat_fr10_cue,
  },
  fr55: {
    label: m.expense_vat_fr55_label,
    help: m.expense_vat_fr55_help,
    cue: m.expense_vat_fr55_cue,
  },
  eu: {
    label: m.expense_vat_eu_label,
    help: m.expense_vat_eu_help,
    cue: m.expense_vat_eu_cue,
  },
  nonEu: {
    label: m.expense_vat_non_eu_label,
    help: m.expense_vat_non_eu_help,
    cue: m.expense_vat_non_eu_cue,
  },
  exempt: {
    label: m.expense_vat_exempt_label,
    help: m.expense_vat_exempt_help,
    cue: m.expense_vat_exempt_cue,
  },
};
