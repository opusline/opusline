import type { BillingMode } from "@opusline/api-client";

import { isHourly } from "@/lib/durations";
import { weekdayDateLabel } from "@/lib/weeks";

export const DURATION_FORMAT_HINT = "Format : 1 · 0,5 · 2h · 1h30 · 90m";

export function durationUnitHint(billingMode: BillingMode): string {
  return isHourly(billingMode)
    ? "En heures — 1,5 pour une heure et demie. Ajoutez « j » pour saisir en jours."
    : "En jours — 0,5 pour une demi-journée. Ajoutez « h » pour saisir en heures.";
}

export const DURATION_RANGE_HINT = "Une entrée va de 1 minute à 24 heures.";

export function durationErrorHint(reason: "format" | "range"): string {
  return reason === "range" ? DURATION_RANGE_HINT : DURATION_FORMAT_HINT;
}

export function cellAriaLabel(input: {
  missionName: string;
  date: string | null;
  billedLabel: string;
  note: string | null;
  isEmpty: boolean;
}): string {
  if (input.date === null) {
    return "Week-end replié";
  }

  const day = weekdayDateLabel(input.date);

  if (input.isEmpty) {
    return `${input.missionName}, ${day} : aucune entrée`;
  }

  const note = input.note === null ? "" : `, ${input.note}`;

  return `${input.missionName}, ${day} : ${input.billedLabel}${note}`;
}

export function weekendToggleLabel(weekendShown: boolean): string {
  return weekendShown ? "Masquer le week-end" : "Afficher le week-end";
}
