import type { CraData, Locale } from "@opusline/api-client";

import { calendarDateLabel } from "@/lib/dates";

import { daysLabel } from "./labels";

/**
 * The three moves that produce a CRA: fix the days, look it over, hand it out.
 *
 * They are a view filter, not a state machine — the CRA's own status is what the API
 * tracks. A user can jump straight to the document and come back.
 */

export const CRA_STEPS = ["days", "review", "document"] as const;
export type CraStep = (typeof CRA_STEPS)[number];

export const CRA_STEP_LABELS: Record<CraStep, string> = {
  days: "Saisir les jours",
  review: "Vérifier",
  document: "Envoyer",
};

/** What the footer's primary button does next, per step. */
export const CRA_STEP_ACTIONS: Record<CraStep, string> = {
  days: "Vérifier",
  review: "Voir le document",
  document: "Marquer envoyé",
};

export function isCraStep(value: unknown): value is CraStep {
  return (CRA_STEPS as readonly unknown[]).includes(value);
}

/**
 * What the step chip says underneath its name — where this CRA stands on that step
 * rather than a repeat of the step's own title.
 */
export function craStepState(
  locale: Locale,
  step: CraStep,
  cra: CraData,
): string {
  if (step === "days") {
    return `${daysLabel(locale, cra.totalDays)} reportés`;
  }

  if (step === "review") {
    return cra.differenceDays === 0 ? "Rien à signaler" : "Un écart à vérifier";
  }

  return cra.sentOn === null
    ? "PDF prêt"
    : `Envoyé le ${calendarDateLabel(locale, cra.sentOn)}`;
}

/**
 * Which panels a step shows. Once the CRA has left the building the steps stop
 * driving the layout: the grid and the document sit side by side, read-only, because
 * there is nothing left to walk through.
 */
export function panelsFor(
  step: CraStep,
  cra: CraData,
): { grid: boolean; review: boolean; document: boolean } {
  if (!cra.editable) {
    return { grid: true, review: false, document: true };
  }

  return {
    grid: step === "days",
    review: step === "review",
    document: step === "document",
  };
}
