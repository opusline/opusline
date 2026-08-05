import type { BillingMode, MissionData } from "@opusline/api-client";

const euros = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

export function formatAmount(amountCents: number): string {
  return `${euros.format(amountCents / 100)}`;
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

export function parseRateToCents(draft: string): number | null {
  const normalized = draft.replace(/[\s\u202f]/g, "").replace(",", ".");

  if (normalized === "") {
    return null;
  }

  const amount = Number.parseFloat(normalized);

  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  return Math.round(amount * 100);
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
