export const START_BUTTON = "Démarrer un suivi";
export const START_TITLE = "Suivre quelle mission ?";
export const START_HINT = "L'activité et l'arrondi sont demandés à l'arrêt.";
export const START_EMPTY =
  "Créez d'abord une mission — c'est elle qui porte le tarif.";
export const LAST_MISSION_PILL = "dernière";

export const RUNNING_STATE = "Suivi en cours";
export const PAUSED_STATE = "Suivi en pause";
export const CHIP_PAUSED = "En pause";

export const PAUSE = "Mettre en pause";
export const RESUME = "Reprendre";
export const PAUSE_SHORT = "Pause";
export const STOP = "Arrêter";
export const DETAILS = "Détails";

export const NOTE_LABEL = "Activité";
export const NOTE_PLACEHOLDER = "Activité en cours…";

export const STOP_AND_SAVE = "Arrêter et enregistrer";
export const DISCARD = "Abandonner sans enregistrer";
export const DISCARD_CONFIRM = "Confirmer l'abandon";
export const CANCEL = "Annuler";

export const STOP_TITLE = "Enregistrer l'entrée";
export const ROUNDING_LABEL = "Arrondi";
export const DEFAULT_BADGE = "Défaut";
export const NON_BILLABLE = "Non facturable";
export const AMOUNT_LABEL = "Montant facturable";
export const NOT_BILLABLE_VALUE = "non facturable";
export const STOP_NOTE_PLACEHOLDER = "Revue PR, cadrage…";
export const SAVE = "Enregistrer";
export const SAVING = "Enregistrement…";

export function durationClamped(droppedMinutes: number): string {
  return `Une entrée ne peut pas dépasser 24 h : ${droppedMinutes} min de ce suivi ne seront pas enregistrées.`;
}

export function missionRoundingHint(roundingLabel: string): string {
  return `mission : ${roundingLabel}`;
}

export function roundingDeviation(roundingLabel: string): string {
  return `Vous dérogez à l'arrondi ${roundingLabel} de cette mission, pour cette entrée seulement.`;
}

export const KEEP_IDLE = "Garder";

export const LONG_RUN_BADGE = "Oublié ?";
export const LONG_RUN_STOP = "Arrêter et corriger la durée";
export const LONG_RUN_KEEP = "C'est normal";
export const EXACT_DURATION_HINT = "h:mm — durée exacte";
export const EXACT_DURATION_LABEL = "Durée réellement travaillée";

export function longRunMessage(hours: string): string {
  return `Ce suivi tourne depuis ${hours}. Il a peut-être été laissé en marche : corrigez la durée avant d'enregistrer.`;
}

export function measuredDuration(duration: string): string {
  return `Durée mesurée : ${duration}. Remplacez-la par le temps réellement travaillé.`;
}

export function idleDetected(minutes: number): string {
  return `Inactivité détectée : ${minutes} min sans activité.`;
}

export function trimIdle(minutes: number): string {
  return `Retirer ${minutes} min`;
}

export function stopSummary(
  clock: string,
  missionName: string,
  dateLabel: string,
  billable: boolean,
): string {
  const parts = [`${clock} sur ${missionName}`, dateLabel.toLowerCase()];

  if (!billable) {
    parts.push(NOT_BILLABLE_VALUE);
  }

  return parts.join(" · ");
}
