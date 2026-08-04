import type { BillingMode } from "@opusline/api-client";

const euros = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

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
