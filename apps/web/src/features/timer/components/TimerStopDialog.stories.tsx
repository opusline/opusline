import type { Meta, StoryObj } from "@storybook/react";

import { fixedPriceBudget, overrunFixedPriceBudget } from "@/test/fixtures";
import { defaultStopOption, stopChoices } from "../lib/rounding";
import {
  DEMO_ELAPSED_SECONDS,
  DEMO_MISSIONS,
  DEMO_WORKDAY_MINUTES,
} from "../lib/timer-fixtures";
import { TimerStopDialog } from "./timer-stop-dialog";

const halfDayMission = { ...DEMO_MISSIONS.orvella, rounding: 0 as const };
const { options: dailyOptions } = stopChoices(
  "fr-FR",
  DEMO_ELAPSED_SECONDS,
  halfDayMission,
  DEMO_WORKDAY_MINUTES,
);
const { options: hourlyOptions } = stopChoices(
  "fr-FR",
  DEMO_ELAPSED_SECONDS,
  DEMO_MISSIONS.vesterhus,
  DEMO_WORKDAY_MINUTES,
);

const meta = {
  title: "Web/Timer/TimerStopDialog",
  component: TimerStopDialog,
  tags: ["autodocs"],
  args: {
    billable: true,
    correctionDraft: "",
    measuredLabel: null,
    onCorrectDuration: () => undefined,
    quickDurations: [60, 120, 240, DEMO_WORKDAY_MINUTES],
    workdayMinutes: DEMO_WORKDAY_MINUTES,
    clockLabel: "03:42:18",
    dateLabel: "jeudi 30 juillet",
    error: null,
    isSaving: false,
    missionName: "Orvella front",
    missionRoundingLabel: "0,5 j",
    note: "",
    noteSuggestions: ["Correctifs QA", "Sprint 23 · recette", "Filtre agences"],
    onChangeBillable: () => undefined,
    onChangeNote: () => undefined,
    onOpenChange: () => undefined,
    onSelectRounding: () => undefined,
    onSubmit: () => undefined,
    open: true,
    options: dailyOptions,
    selectedKey: defaultStopOption(dailyOptions).key,
  },
} satisfies Meta<typeof TimerStopDialog>;

export default meta;
type Story = StoryObj<typeof TimerStopDialog>;

export const MissionDefault: Story = {};

export const DeviatingFromTheMission: Story = {
  args: { selectedKey: "exact" },
};

export const HourlyMission: Story = {
  args: {
    missionRoundingLabel: "15 min",
    options: hourlyOptions,
    selectedKey: defaultStopOption(hourlyOptions).key,
  },
};

/** The measured time is offered for replacement, not silently recorded. */
export const CorrectingAForgottenTimer: Story = {
  args: { clockLabel: "13:05:00", measuredLabel: "13 h 05" },
};

export const NotBillable: Story = {
  args: { billable: false },
};

export const WithNote: Story = {
  args: { note: "Cadrage V2" },
};

export const Saving: Story = {
  args: { isSaving: true },
};

export const SaveRefused: Story = {
  args: { error: "Le suivi n'existe plus." },
};

/**
 * The mission is a forfait: the entry bills nothing on its own, and what it does
 * do is eat the price — so the dialog says how much of it this one takes.
 */
export const OnAForfaitMission: Story = {
  args: {
    missionBudget: fixedPriceBudget(),
    missionName: "Lunaprint refonte boutique",
    missionRounding: 0,
  },
};

/** The same entry once the forfait has already been overrun. */
export const OnAnOverrunForfait: Story = {
  args: {
    missionBudget: overrunFixedPriceBudget(),
    missionName: "Ateliers Ruche vitrine",
    missionRounding: 0,
  },
};
