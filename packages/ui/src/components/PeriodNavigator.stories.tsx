import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PeriodNavigator } from "./period-navigator";

const MONTHS = ["juin 2026", "juillet 2026", "août 2026", "septembre 2026"];

const meta = {
  title: "UI/PeriodNavigator",
  component: PeriodNavigator,
  tags: ["autodocs"],
  args: {
    label: "août 2026",
    previousLabel: "Mois précédent",
    nextLabel: "Mois suivant",
    onPrevious: () => {},
    onNext: () => {},
  },
} satisfies Meta<typeof PeriodNavigator>;

export default meta;
type Story = StoryObj<typeof PeriodNavigator>;

export const Default: Story = {};

/** The next arrow stops at the current period: no screen shows a month that has not happened. */
export const AtCurrentPeriod: Story = {
  args: { label: "septembre 2026", isNextDisabled: true },
};

export const Small: Story = {
  args: { size: "sm" },
};

function SteppingNavigator() {
  const [index, setIndex] = useState(2);

  return (
    <PeriodNavigator
      isNextDisabled={index === MONTHS.length - 1}
      isPreviousDisabled={index === 0}
      label={MONTHS[index]}
      nextLabel="Mois suivant"
      onNext={() => setIndex((current) => current + 1)}
      onPrevious={() => setIndex((current) => current - 1)}
      previousLabel="Mois précédent"
    />
  );
}

export const Stepping: Story = {
  render: () => <SteppingNavigator />,
};
