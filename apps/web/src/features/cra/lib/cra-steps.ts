import type { CraData, Locale } from "@opusline/api-client";

import { calendarDateLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { daysLabel } from "./labels";

/**
 * The three moves that produce a CRA: fix the days, look it over, hand it out.
 *
 * They are a view filter, not a state machine — the CRA's own status is what the API
 * tracks. A user can jump straight to the document and come back.
 */

export const CRA_STEPS = ["days", "review", "document"] as const;
export type CraStep = (typeof CRA_STEPS)[number];

export const CRA_STEP_LABELS: Record<CraStep, () => string> = {
  days: m.cra_step_days,
  review: m.cra_step_review,
  document: m.cra_step_document,
};

/** What the footer's primary button does next, per step. */
export const CRA_STEP_ACTIONS: Record<CraStep, () => string> = {
  days: m.cra_step_review,
  review: m.cra_action_view_document,
  document: m.cra_action_mark_sent,
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
    return m.cra_state_days_reported({
      days: daysLabel(locale, cra.totalDays),
    });
  }

  if (step === "review") {
    return cra.differenceDays === 0
      ? m.cra_state_nothing_to_report()
      : m.cra_state_drift_to_check();
  }

  return cra.sentOn === null
    ? m.cra_state_pdf_ready()
    : m.cra_state_sent_on({ date: calendarDateLabel(locale, cra.sentOn) });
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
