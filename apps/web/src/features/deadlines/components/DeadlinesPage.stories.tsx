import type { Meta, StoryObj } from "@storybook/react";
import { DeadlinesPage } from "./deadlines-page";

const meta = {
  title: "Web/DeadlinesPage",
  component: DeadlinesPage,
  tags: ["autodocs"],
} satisfies Meta<typeof DeadlinesPage>;

export default meta;
type Story = StoryObj<typeof DeadlinesPage>;

function money(amount: number) {
  return { amount, currency: "EUR" as const };
}

export const Default: Story = {
  args: {
    fiscalDeadlines: {
      hasUncomputedVatSchedule: false,
      deadlines: [
        {
          kind: 0,
          period: "2026-07",
          dueOn: "2026-08-15",
          amount: money(199_400),
          daysUntilDue: 2,
          isOverdue: false,
        },
        {
          kind: 1,
          period: "2026-07",
          dueOn: "2026-08-31",
          amount: money(287_000),
          daysUntilDue: 18,
          isOverdue: false,
        },
        {
          kind: 1,
          period: "2026-08",
          dueOn: "2026-09-30",
          amount: null,
          daysUntilDue: 48,
          isOverdue: false,
        },
      ],
    },
  },
};

export const WithOverdue: Story = {
  args: {
    fiscalDeadlines: {
      hasUncomputedVatSchedule: false,
      deadlines: [
        {
          kind: 1,
          period: "2026-06",
          dueOn: "2026-07-31",
          amount: money(243_000),
          daysUntilDue: -13,
          isOverdue: true,
        },
        {
          kind: 0,
          period: "2026-07",
          dueOn: "2026-08-15",
          amount: money(199_400),
          daysUntilDue: 2,
          isOverdue: false,
        },
      ],
    },
  },
};

/** Réel simplifié: Opusline will not guess the CA12 date, and says so. */
export const AnnualVatNotComputed: Story = {
  args: {
    fiscalDeadlines: {
      hasUncomputedVatSchedule: true,
      deadlines: [
        {
          kind: 1,
          period: "2026-07",
          dueOn: "2026-08-31",
          amount: money(287_000),
          daysUntilDue: 18,
          isOverdue: false,
        },
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    fiscalDeadlines: { hasUncomputedVatSchedule: false, deadlines: [] },
  },
};
