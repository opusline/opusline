import type { Meta, StoryObj } from "@storybook/react";

import { buildCraGrid } from "../lib/cra-grid";
import { craDays, DEMO_MONTH } from "../lib/fixtures";
import { CraMonthGrid } from "./cra-month-grid";

function model(overrides: Record<string, number> = {}, month = DEMO_MONTH) {
  return buildCraGrid({
    locale: "fr-FR",
    month,
    days: craDays(overrides, month),
  });
}

const meta = {
  title: "Web/Cra/CraMonthGrid",
  component: CraMonthGrid,
  tags: ["autodocs"],
  args: {
    editable: true,
    isDirty: false,
    model: model(),
    onChange: () => undefined,
    onFillWeekdays: () => undefined,
    onReset: () => undefined,
    reportedDays: 21,
    trackedDays: 21,
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraMonthGrid>;

export default meta;
type Story = StoryObj<typeof CraMonthGrid>;

export const Default: Story = {};

export const Dirty: Story = {
  args: {
    isDirty: true,
    model: model({ "2026-07-06": 5_000 }),
    reportedDays: 20.5,
  },
};

export const WeekendWorked: Story = {
  args: { model: model({ "2026-07-11": 5_000 }), reportedDays: 21.5 },
};

export const ReadOnly: Story = {
  args: { editable: false },
};

export const Saving: Story = {
  args: { pendingDates: new Set(["2026-07-06"]) },
};

export const SpillsToSixWeeks: Story = {
  args: { model: model({}, "2026-08"), reportedDays: 20, trackedDays: 20 },
};
