import type { EntryRounding, MissionData } from "@opusline/api-client";

import {
  EXACT_ROUNDING,
  formatDecimalHours,
  isHourly,
  MAX_MINUTES_PER_DAY,
  provisionalBilledLabel,
  valueAsDayFraction,
  valueAsMinutes,
} from "@/lib/durations";

const MIN_MINUTES = 1;

function isFixed(billingMode: MissionData["billingMode"]): boolean {
  return billingMode === 2;
}

export type StopOption = {
  rounding: EntryRounding | null;
  amountCents: number | null;
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
  elapsedSeconds: number,
  mission: MissionData | null,
  workdayMinutes: number,
): StopChoices {
  const measured = Math.max(MIN_MINUTES, Math.round(elapsedSeconds / 60));
  const minutes = clamp(measured);
  const droppedMinutes = measured - minutes;

  const exact: StopOption = {
    amountCents: billableAmountCents(
      EXACT_ROUNDING,
      minutes,
      mission,
      workdayMinutes,
    ),
    isDefault: mission === null,
    key: "exact",
    label: formatDecimalHours(minutes),
    minutes,
    rounding: EXACT_ROUNDING,
  };

  if (mission === null) {
    return { droppedMinutes, options: [exact] };
  }

  const asMissionRounds: StopOption = {
    amountCents: billableAmountCents(
      mission.rounding,
      minutes,
      mission,
      workdayMinutes,
    ),
    isDefault: true,
    key: "mission",
    label: provisionalBilledLabel(
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

function billableAmountCents(
  rounding: EntryRounding | null,
  minutes: number,
  mission: MissionData | null,
  workdayMinutes: number,
): number | null {
  if (
    mission === null ||
    mission.rate === null ||
    isFixed(mission.billingMode)
  ) {
    return null;
  }

  const quantity = isHourly(mission.billingMode)
    ? valueAsMinutes(minutes, rounding) / 60
    : valueAsDayFraction(minutes, rounding, workdayMinutes);

  return Math.round(quantity * mission.rate.amount);
}
