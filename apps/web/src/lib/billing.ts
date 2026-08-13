import type { BillingMode, MissionData } from "@opusline/api-client";

const euros = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

const eurosWithCents = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function formatAmountWithCents(amountCents: number): string {
  return `${eurosWithCents.format(amountCents / 100)} €`;
}

export function formatAmount(amountCents: number): string {
  return `${euros.format(amountCents / 100)}`;
}

const wholeEuros = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 0,
});

/**
 * Whole euros, the way invoice lists show them: "1 224 €". Rounded on purpose —
 * the list is scanned, not reconciled, and the exact figure to the cent is on the
 * invoice's own panel.
 */
export function formatEuros(amountCents: number): string {
  return `${wholeEuros.format(amountCents / 100)} €`;
}

const percentFigure = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

/**
 * A basis-point rate as the figure beside a "%": 2000 -> "20", 550 -> "5,5". Trailing
 * zeros are dropped — an invoice reads "TVA 20 %", not "TVA 20,00 %".
 */
export function formatPercentFromBp(basisPoints: number): string {
  return percentFigure.format(basisPoints / 100);
}

export function formatRate(
  amountCents: number,
  billingMode: BillingMode,
): string {
  const amount = euros.format(amountCents / 100);

  switch (billingMode) {
    case 0:
      return `${amount} €/j`;
    case 1:
      return `${amount} €/h`;
    case 2:
      return `${amount} € forfait`;
  }
}

export function formatRateDraft(raw: string): string {
  const cleaned = raw.replace(/[^0-9.,]/g, "").replace(/\./g, ",");
  const [integerPart = "", ...decimalParts] = cleaned.split(",");
  const digits = integerPart.replace(/\D/g, "").slice(0, 9);
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");

  if (!cleaned.includes(",")) {
    return grouped;
  }

  return `${grouped},${decimalParts.join("").slice(0, 2)}`;
}

const DECIMAL = /^\d+(?:\.\d+)?$/;

/**
 * Refuses anything that is not a single plain decimal. `Number.parseFloat`
 * stops at the first stray separator and hands back a silently truncated
 * number instead — « 1,234,5 » has to be an error, not 1,23.
 */
export function parseDecimal(draft: string): number | null {
  const normalized = draft.replace(/[\s\u202f]/g, "").replace(",", ".");

  return DECIMAL.test(normalized) ? Number.parseFloat(normalized) : null;
}

/** Zero is refused: a mission billed at nothing is a mistake, not a price. */
export function parseRateToCents(draft: string): number | null {
  const amount = parseDecimal(draft);

  return amount === null || amount <= 0 ? null : Math.round(amount * 100);
}

export function missionBills(mission: MissionData): boolean {
  return mission.rate !== null;
}

export function formatMissionRate(mission: MissionData): string {
  if (mission.rate === null) {
    return "non facturable";
  }

  return formatRate(mission.rate.amount, mission.billingMode);
}

export function paymentTermsLabel(days: number): string {
  if (days === 0) {
    return "réception";
  }

  return days === 1 ? "1 jour" : `${days} jours`;
}
