import type { Meta, StoryObj } from "@storybook/react";
import { DeclarationsPage } from "./declarations-page";

const meta = {
  title: "Web/DeclarationsPage",
  component: DeclarationsPage,
  tags: ["autodocs"],
  args: { onMarkFiled: () => {} },
} satisfies Meta<typeof DeclarationsPage>;

export default meta;
type Story = StoryObj<typeof DeclarationsPage>;

function money(amount: number) {
  return { amount, currency: "EUR" as const };
}

export const Default: Story = {
  args: {
    declarations: {
      hasUncomputedVatSchedule: false,
      declarations: [
        {
          kind: 1,
          period: "2026-06",
          dueOn: "2026-07-31",
          amount: money(243_000),
          filedOn: "2026-07-28",
          declaredAmount: null,
          isFiled: true,
          isLate: false,
        },
        {
          kind: 0,
          period: "2026-07",
          dueOn: "2026-08-15",
          amount: money(199_400),
          filedOn: null,
          declaredAmount: null,
          isFiled: false,
          isLate: false,
        },
        {
          kind: 1,
          period: "2026-07",
          dueOn: "2026-08-31",
          amount: money(287_000),
          filedOn: null,
          declaredAmount: null,
          isFiled: false,
          isLate: false,
        },
      ],
    },
  },
};

export const WithLateFiling: Story = {
  args: {
    declarations: {
      hasUncomputedVatSchedule: false,
      declarations: [
        {
          kind: 1,
          period: "2026-05",
          dueOn: "2026-06-30",
          amount: money(198_000),
          filedOn: null,
          declaredAmount: null,
          isFiled: false,
          isLate: true,
        },
        {
          kind: 1,
          period: "2026-06",
          dueOn: "2026-07-31",
          amount: money(243_000),
          filedOn: "2026-08-04",
          declaredAmount: null,
          isFiled: true,
          isLate: false,
        },
      ],
    },
  },
};

/** The accountant adjusted the figure, so the filing records what went in. */
export const DeclaredFigureDiffers: Story = {
  args: {
    declarations: {
      hasUncomputedVatSchedule: false,
      declarations: [
        {
          kind: 0,
          period: "2026-06",
          dueOn: "2026-07-15",
          amount: money(199_400),
          filedOn: "2026-07-14",
          declaredAmount: money(201_100),
          isFiled: true,
          isLate: false,
        },
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    declarations: { hasUncomputedVatSchedule: false, declarations: [] },
  },
};
