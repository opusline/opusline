import type { Meta, StoryObj } from "@storybook/react";
import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";
import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
  DEMO_WORKDAY_MINUTES,
} from "../lib/week-fixtures";
import { buildWeekGrid } from "../lib/week-grid";
import { NewEntryDialog } from "./new-entry-dialog";

const { missionOptions } = buildWeekGrid({
  clients: DEMO_CLIENTS,
  format: DEFAULT_MONEY_FORMAT,
  timeEntries: DEMO_TIME_ENTRIES,
  today: DEMO_TODAY,
  week: DEMO_WEEK,
  weekendShown: false,
});

const meta = {
  title: "Web/Week/NewEntryDialog",
  component: NewEntryDialog,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    isSaving: false,
    knownRange: { from: "2026-07-20", to: "2026-08-02" },
    missionOptions,
    noteSuggestions: ["Sprint 23 · recette", "Correctifs QA", "Filtre agences"],
    onOpenChange: () => {},
    onSubmit: () => Promise.resolve(true),
    open: true,
    timeEntries: DEMO_TIME_ENTRIES,
    today: DEMO_TODAY,
    workdayMinutes: DEMO_WORKDAY_MINUTES,
  },
} satisfies Meta<typeof NewEntryDialog>;

export default meta;
type Story = StoryObj<typeof NewEntryDialog>;

export const PickAMission: Story = {};

export const WithAMissionOffTheGrid: Story = {
  args: {
    missionOptions: [
      ...missionOptions,
      {
        billingMode: 0,
        colorClass: "bg-palette-sage",
        hasRate: true,
        isInGrid: false,
        missionId: 99,
        name: "HartPrint refonte boutique",
        subtitle: "Client direct · 480 €/j",
      },
    ],
  },
};
