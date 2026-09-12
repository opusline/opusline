import type { Meta, StoryObj } from "@storybook/react";

import { eur } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import {
  settledSettlement,
  shortSettlement,
  urssafDeclaration,
} from "../lib/fixtures";
import { UrssafDeclarationCard } from "./urssaf-declaration-card";

const meta = {
  title: "Web/Declarations/UrssafDeclarationCard",
  component: UrssafDeclarationCard,
  tags: ["autodocs"],
  args: {
    urssaf: urssafDeclaration(),
    isBusy: false,
    onMarkFiled: () => {},
    onMarkPaid: () => {},
    onUndo: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="max-w-lg">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof UrssafDeclarationCard>;

export default meta;
type Story = StoryObj<typeof UrssafDeclarationCard>;

export const Default: Story = {};

export const Quarterly: Story = {
  args: {
    urssaf: urssafDeclaration({ period: "2026-Q2", periodicity: 1 }),
  },
};

/** A quarterly account looked at mid-quarter: the fileable one is the previous. */
export const RunningQuarter: Story = {
  args: {
    urssaf: urssafDeclaration({
      period: "2026-Q2",
      periodicity: 1,
      coversShownMonth: false,
    }),
  },
};

export const DueSoon: Story = {
  args: {
    urssaf: urssafDeclaration({
      deadline: { dueOn: "2026-08-31", daysLeft: 3 },
    }),
  },
};

export const Overdue: Story = {
  args: {
    urssaf: urssafDeclaration({
      deadline: { dueOn: "2026-08-31", daysLeft: -4 },
      settlement: shortSettlement(),
    }),
  },
};

export const Filed: Story = {
  args: {
    urssaf: urssafDeclaration({
      completion: { declaredOn: "2026-08-09", paidOn: null },
    }),
  },
};

export const Paid: Story = {
  args: {
    urssaf: urssafDeclaration({
      completion: { declaredOn: "2026-08-09", paidOn: "2026-08-12" },
      settlement: settledSettlement(),
    }),
  },
};

export const QuietMonth: Story = {
  args: {
    urssaf: urssafDeclaration({
      base: eur(0),
      invoiceCount: 0,
      lines: [
        { kind: 0, rateBp: 2610, amount: eur(0) },
        { kind: 1, rateBp: 20, amount: eur(0) },
        { kind: 2, rateBp: 220, amount: eur(0) },
      ],
      total: eur(0),
      settlement: {
        expected: eur(0),
        provisioned: eur(0),
        gap: { amount: 0, currency: "EUR" },
        detectedPayments: eur(0),
      },
    }),
  },
};
