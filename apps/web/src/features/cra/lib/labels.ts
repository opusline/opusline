import type { CraDayData, Locale } from "@opusline/api-client";

import { formatBilledDays } from "@/lib/durations";
import { weekdayDateLabel } from "@/lib/weeks";

import { FULL_DAY_BP } from "./day-fraction";

/**
 * Every French string the CRA screen says, in one place. "CRA" itself stays as it is:
 * it is French fiscal vocabulary, not a word to translate.
 */

/** The repo's eyebrow: a small caps label above a group. */
export const EYEBROW =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

export const CRA_TITLE = "Comptes rendus";
export const SEARCH_PLACEHOLDER = "Client, mission, mois";
export const NO_MATCH = "Aucun CRA ne correspond";

export const FILL_WEEKDAYS = "Remplir les jours ouvrés";
export const RESET_DAYS = "Rétablir mes entrées";
export const REVIEW_TITLE = "Avant l'envoi";
export const CHECK_DAYS = "Jours saisis";
export const CHECK_DAYS_MATCHING = "conforme au temps suivi ce mois";
export const CHECK_RECIPIENT = "Destinataire";
export const CHECK_RECIPIENT_DETAIL = "signera le bon pour accord";
export const CHECK_SIGNATURE = "Signature";
export const CHECK_SIGNATURE_READY = "prête à être apposée sur le document";
export const CHECK_SIGNATURE_MISSING =
  "aucune signature enregistrée dans vos réglages";
export const CHECK_SIGNATURE_ON = "Enregistrée";
export const CHECK_SIGNATURE_OFF = "Absente";

export const LEGEND_WORKED = "Journée saisie";
export const LEGEND_IDLE = "Non saisi";
export const LEGEND_CLOSED = "Week-end ou férié";
export const GRID_HINT = "Cliquez une cellule : 1 → 0,5 → vide";
export const GRID_FOOTER_HINT = "Cliquez les jours travaillés";
export const HOLIDAY_SHORT = "Férié";

export const SIGNATURE_ON = "Apposer ma signature";
export const SIGNATURE_MISSING = "Enregistrer ma signature";

export const SIGNED_RETURN_TITLE = "Enregistrer le retour signé";
export const SIGNED_RETURN_DROP = "Déposer le CRA signé";
export const SIGNED_RETURN_HINT =
  "PDF, JPG ou PNG — glissez le fichier ou cliquez pour parcourir";
export const SIGNED_RETURN_REMOVE = "Retirer";
export const CANCEL = "Annuler";

export const STAT_REPORTED = "Jours reportés";
export const STAT_AMOUNT = "Montant HT";
export const STAT_DIFFERENCE = "Écarts avec le suivi";
export const STAT_OFF_DAYS = "Non ouvrés travaillés";
/** A tile reads better empty than at zero: there is nothing to look into. */
export const NOTHING = "aucun";

/** "3 à produire" — the aside's counter. */
export function toProduceLabel(count: number): string {
  return `${count} à produire`;
}

/** "1 CRA" / "4 CRA" — CRA does not take a plural s. */
export function craCountLabel(count: number): string {
  return `${count} CRA`;
}

/** "2,5 j" — a day count, in the unit the whole app uses for days. */
export const daysLabel = formatBilledDays;

/** "−0,5 j par rapport au temps suivi" — why the day count is being questioned. */
export function checkDaysDrift(locale: Locale, days: number): string {
  return `${differenceLabel(locale, days)} par rapport au temps suivi`;
}

/** The écart, signed, so a shortfall and a surplus do not read alike. */
export function differenceLabel(locale: Locale, days: number): string {
  if (days === 0) {
    return NOTHING;
  }

  const formatted = daysLabel(locale, Math.abs(days));

  return days > 0 ? `+${formatted}` : `−${formatted}`;
}

/** The tile's value: how many days nobody was expected to work but which carry time. */
export function offDaysWorkedLabel(count: number): string {
  if (count === 0) {
    return NOTHING;
  }

  return count === 1 ? "1 jour" : `${count} jours`;
}

/**
 * The line under the month: who it is for, on what, and where the grid came from.
 * The client leads because that is who signs it.
 */
export function craSubtitle(
  clientName: string,
  isIntermediary: boolean,
  missionName: string,
  isDirty: boolean,
): string {
  const client = isIntermediary ? `${clientName} (ESN)` : clientName;
  const origin = isDirty
    ? "modifié à la main"
    : "pré-rempli depuis vos entrées";

  return `${client} · ${missionName} · ${origin}`;
}

/** What the calendar's header says the grid currently reports. */
export function reportedAgainstTrackedLabel(
  locale: Locale,
  reported: number,
  tracked: number,
): string {
  if (reported === tracked) {
    return `${daysLabel(locale, reported)} — conforme au temps suivi`;
  }

  return `${daysLabel(locale, reported)} saisis · ${daysLabel(locale, tracked)} suivis`;
}

/**
 * What a screen reader hears on a day cell: the date, then what it reports, then why
 * it is greyed when it is.
 */
export function cellAriaLabel(locale: Locale, day: CraDayData): string {
  // The weekday, not just the date: in a calendar grid it is what tells you which
  // column you have landed in.
  const date = weekdayDateLabel(day.date);
  const worked =
    day.dayFractionBp > 0
      ? daysLabel(locale, day.dayFractionBp / FULL_DAY_BP)
      : "aucune journée";

  if (day.isHoliday) {
    return `${date}, ${day.holidayName ?? "jour férié"}, ${worked}`;
  }

  if (day.isWeekend) {
    return `${date}, week-end, ${worked}`;
  }

  return `${date}, ${worked}`;
}
