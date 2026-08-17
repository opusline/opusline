import type { TimeEntryData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { StoryRouter } from "@/test/story-router";
import { MissionEntriesTable } from "./mission-entries-table";

const meta = {
  title: "Web/MissionEntriesTable",
  component: MissionEntriesTable,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof MissionEntriesTable>;

export default meta;
type Story = StoryObj<typeof MissionEntriesTable>;

const baseEntry = {
  missionId: 1,
  rounding: null,
  valuedMinutes: null,
  valuedDayFraction: null,
} satisfies Partial<TimeEntryData>;

/**
 * A day-billed mission: the API values each entry as a fraction of a workday,
 * rounded up to the mission's increment, so a 3.5-hour morning bills half a day.
 */
const entries: TimeEntryData[] = [
  {
    ...baseEntry,
    id: 1,
    date: "2026-08-14",
    durationMinutes: 480,
    valuedDayFraction: 1,
    billable: true,
    invoiced: false,
    note: "Refonte du tunnel de paiement",
  },
  {
    ...baseEntry,
    id: 2,
    date: "2026-08-13",
    durationMinutes: 210,
    valuedDayFraction: 0.5,
    billable: true,
    invoiced: false,
    note: null,
  },
  {
    ...baseEntry,
    id: 3,
    date: "2026-07-31",
    durationMinutes: 480,
    valuedDayFraction: 1,
    billable: true,
    invoiced: true,
    note: "Recette et livraison",
  },
  {
    ...baseEntry,
    id: 4,
    date: "2026-07-30",
    durationMinutes: 90,
    valuedDayFraction: 0.5,
    billable: false,
    invoiced: false,
    note: "Point interne, non refacturé",
  },
];

export const Default: Story = {
  args: {
    entries,
  },
};

/** An hourly mission values the same entries in hours instead of days. */
export const HourlyMission: Story = {
  args: {
    entries: [
      {
        ...baseEntry,
        id: 1,
        date: "2026-08-14",
        durationMinutes: 450,
        valuedMinutes: 450,
        billable: true,
        invoiced: false,
        note: "Correctifs après mise en production",
      },
      {
        ...baseEntry,
        id: 2,
        date: "2026-08-13",
        durationMinutes: 200,
        valuedMinutes: 210,
        billable: true,
        invoiced: true,
        note: "Filtre agences",
      },
    ],
  },
};

/**
 * A fixed-price mission still counts days — it rounds to quarters, since a fixed
 * mission stores no increment of its own — even though nothing prices them.
 */
export const FixedPriceMission: Story = {
  args: {
    entries: [
      {
        ...baseEntry,
        id: 1,
        date: "2026-08-14",
        durationMinutes: 450,
        valuedDayFraction: 1,
        billable: true,
        invoiced: false,
        note: "Cadrage V2",
      },
      {
        ...baseEntry,
        id: 2,
        date: "2026-08-13",
        durationMinutes: 30,
        valuedDayFraction: 0.25,
        billable: true,
        invoiced: false,
        note: "Point hebdo",
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    entries: [],
  },
};

export const Loading: Story = {
  args: {
    entries: [],
    isPending: true,
  },
};

export const Failed: Story = {
  args: {
    entries: [],
    isError: true,
  },
};
