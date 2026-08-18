import type { MonthWorkloadData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import { WeekSummaryTiles } from "./week-summary-tiles";

const meta = {
  title: "Web/Week/WeekSummaryTiles",
  component: WeekSummaryTiles,
  tags: ["autodocs"],
} satisfies Meta<typeof WeekSummaryTiles>;

export default meta;
type Story = StoryObj<typeof WeekSummaryTiles>;

/** 18,5 days behind you out of the 21 that August 2026 offers. */
const AUGUST: MonthWorkloadData = {
  month: "2026-08",
  businessDays: 21,
  workedDays: 18.5,
};

export const Default: Story = {
  args: {
    monthWorkload: AUGUST,
    summary: {
      amountCents: 275_000,
      valuedEntryCount: 5,
      nonBillableEntryCount: 0,
      fixedPriceEntryCount: 0,
      unratedEntryCount: 0,
    },
  },
};

/** A week that also carries time the figure deliberately leaves out. */
export const WithExcludedTime: Story = {
  args: {
    monthWorkload: AUGUST,
    summary: {
      amountCents: 192_500,
      valuedEntryCount: 3,
      nonBillableEntryCount: 2,
      fixedPriceEntryCount: 1,
      unratedEntryCount: 1,
    },
  },
};

export const NothingBillable: Story = {
  args: {
    monthWorkload: { ...AUGUST, workedDays: 0 },
    summary: {
      amountCents: 0,
      valuedEntryCount: 0,
      nonBillableEntryCount: 1,
      fixedPriceEntryCount: 0,
      unratedEntryCount: 0,
    },
  },
};

/** The month has not loaded yet, so the row stands on the billable tile alone. */
export const WithoutMonth: Story = {
  args: {
    monthWorkload: null,
    summary: {
      amountCents: 275_000,
      valuedEntryCount: 5,
      nonBillableEntryCount: 0,
      fixedPriceEntryCount: 0,
      unratedEntryCount: 0,
    },
  },
};

/** A month worked past its business days still stops the bar at full. */
export const MonthOverrun: Story = {
  args: {
    monthWorkload: { ...AUGUST, workedDays: 23 },
    summary: {
      amountCents: 412_500,
      valuedEntryCount: 8,
      nonBillableEntryCount: 0,
      fixedPriceEntryCount: 0,
      unratedEntryCount: 0,
    },
  },
};
