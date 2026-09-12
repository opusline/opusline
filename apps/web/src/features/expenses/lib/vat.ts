import type { ExpenseVatTreatment } from "@opusline/api-client";

export type VatTerms = {
  vatTreatment: ExpenseVatTreatment;
  vatRateBp: number;
};

/**
 * The six chips of the sheet, each a (treatment, rate) pair on the API side.
 * A stored row can carry a rate no chip covers (2,1 %, an overseas rate): it
 * keeps its own pair until the user picks a chip.
 */
export type VatChoice = "fr20" | "fr10" | "fr55" | "eu" | "nonEu" | "exempt";

export const VAT_CHOICES: readonly VatChoice[] = [
  "fr20",
  "fr10",
  "fr55",
  "eu",
  "nonEu",
  "exempt",
];

const CHOICE_TERMS: Record<VatChoice, VatTerms> = {
  fr20: { vatTreatment: 0, vatRateBp: 2_000 },
  fr10: { vatTreatment: 0, vatRateBp: 1_000 },
  fr55: { vatTreatment: 0, vatRateBp: 550 },
  eu: { vatTreatment: 1, vatRateBp: 2_000 },
  nonEu: { vatTreatment: 2, vatRateBp: 2_000 },
  exempt: { vatTreatment: 3, vatRateBp: 0 },
};

export function vatChoiceTerms(choice: VatChoice): VatTerms {
  return CHOICE_TERMS[choice];
}

/** The chip a stored row lands on; null for a pair no chip covers. */
export function vatChoiceOf(terms: VatTerms): VatChoice | null {
  return (
    VAT_CHOICES.find(
      (choice) =>
        CHOICE_TERMS[choice].vatTreatment === terms.vatTreatment &&
        CHOICE_TERMS[choice].vatRateBp === terms.vatRateBp,
    ) ?? null
  );
}

function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5);
}

export type ExpenseAmounts = {
  htCents: number;
  /** What the invoice carries (domestic) or what is self-assessed (reverse charge). */
  vatCents: number;
  ttcCents: number;
  /** The share of the TVA that reaches the CA3, after the pro share. */
  recoverableCents: number;
};

/**
 * Mirrors the API's ExpenseAmounts::fromTtc so the calc box shows the cents
 * the row will carry: HT = TTC × 10000 / (10000 + rate) rounded half up for a
 * domestic purchase; HT = TTC for reverse charge and exempt, with the reverse
 * charge assessing rate × HT on top.
 */
export function expenseAmountsFromTtc(
  ttcCents: number,
  { vatTreatment, vatRateBp }: VatTerms,
  proShareBp: number,
): ExpenseAmounts {
  const htCents =
    vatTreatment === 0
      ? roundHalfUp((ttcCents * 10_000) / (10_000 + vatRateBp))
      : ttcCents;
  const vatCents =
    vatTreatment === 0
      ? ttcCents - htCents
      : roundHalfUp((htCents * vatRateBp) / 10_000);

  return {
    htCents,
    vatCents,
    ttcCents,
    recoverableCents: roundHalfUp((vatCents * proShareBp) / 10_000),
  };
}

/**
 * Mirrors the API's ExpenseAmounts::fromHt for a subscription, priced HT:
 * the TVA is rate × HT rounded half up and the TTC their sum — nothing for
 * an exempt one, and a reverse-charged one assesses the TVA without paying it.
 */
export function expenseAmountsFromHt(
  htCents: number,
  { vatTreatment, vatRateBp }: VatTerms,
  proShareBp: number,
): ExpenseAmounts {
  const vatCents =
    vatTreatment === 3 ? 0 : roundHalfUp((htCents * vatRateBp) / 10_000);

  return {
    htCents,
    vatCents,
    ttcCents: vatTreatment === 0 ? htCents + vatCents : htCents,
    recoverableCents: roundHalfUp((vatCents * proShareBp) / 10_000),
  };
}
