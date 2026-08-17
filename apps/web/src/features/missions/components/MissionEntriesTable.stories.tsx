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

const entries: TimeEntryData[] = [
  {
    ...baseEntry,
    id: 1,
    date: "2026-08-14",
    durationMinutes: 480,
    billable: true,
    invoiced: false,
    note: "Refonte du tunnel de paiement",
  },
  {
    ...baseEntry,
    id: 2,
    date: "2026-08-13",
    durationMinutes: 210,
    billable: true,
    invoiced: false,
    note: null,
  },
  {
    ...baseEntry,
    id: 3,
    date: "2026-07-31",
    durationMinutes: 480,
    billable: true,
    invoiced: true,
    note: "Recette et livraison",
  },
  {
    ...baseEntry,
    id: 4,
    date: "2026-07-30",
    durationMinutes: 90,
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
