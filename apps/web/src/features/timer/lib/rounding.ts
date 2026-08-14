import type { EntryRounding, Locale, MissionData } from "@opusline/api-client";

import {
  EXACT_ROUNDING,
  formatDecimalHours,
  MAX_MINUTES_PER_DAY,
  provisionalBilledLabel,
} from "@/lib/durations";

const MIN_MINUTES = 1;

export type StopOption = {
  rounding: EntryRounding | null;
  isDefault: boolean;
  key: string;
  label: string;
  minutes: number;
};

export type StopChoices = {
  options: [StopOption, ...StopOption[]];
  droppedMinutes: number;
};

function clamp(minutes: number): number {
  return Math.min(
    MAX_MINUTES_PER_DAY,
    Math.max(MIN_MINUTES, Math.round(minutes)),
  );
}

export function stopChoices(
  locale: Locale,
  elapsedSeconds: number,
  mission: MissionData | null,
  workdayMinutes: number,
): StopChoices {
  const measured = Math.max(MIN_MINUTES, Math.round(elapsedSeconds / 60));
  const minutes = clamp(measured);
  const droppedMinutes = measured - minutes;

  const exact: StopOption = {
    isDefault: mission === null,
    key: "exact",
    label: formatDecimalHours(locale, minutes),
    minutes,
    rounding: EXACT_ROUNDING,
  };

  if (mission === null) {
    return { droppedMinutes, options: [exact] };
  }

  const asMissionRounds: StopOption = {
    isDefault: true,
    key: "mission",
    label: provisionalBilledLabel(
      locale,
      minutes,
      { billingMode: mission.billingMode, workdayMinutes },
      mission.rounding,
    ),
    minutes,
    rounding: null,
  };

  return {
    droppedMinutes,
    options:
      mission.rounding === EXACT_ROUNDING
        ? [asMissionRounds]
        : [asMissionRounds, exact],
  };
}

export function defaultStopOption(
  options: [StopOption, ...StopOption[]],
): StopOption {
  return options.find((option) => option.isDefault) ?? options[0];
}
