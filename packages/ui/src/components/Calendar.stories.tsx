import { Calendar } from "@opusline/ui/components/calendar";
import type { Meta, StoryObj } from "@storybook/react";
import { fr } from "react-day-picker/locale";

const AUGUST_21 = new Date(2026, 7, 21);

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  args: {
    mode: "single",
    defaultMonth: AUGUST_21,
    selected: AUGUST_21,
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};

/** Month and weekday names come from the locale, and the week starts on Monday. */
export const French: Story = {
  args: { locale: fr },
};

/** Days outside the window are greyed out and cannot be picked. */
export const Bounded: Story = {
  args: {
    disabled: [
      { before: new Date(2026, 7, 10) },
      { after: new Date(2026, 7, 21) },
    ],
    endMonth: AUGUST_21,
    startMonth: new Date(2026, 7, 10),
  },
};

export const NothingSelected: Story = {
  args: { selected: undefined },
};
