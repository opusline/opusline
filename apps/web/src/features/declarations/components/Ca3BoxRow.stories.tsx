import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { Ca3BoxRow } from "./ca3-box-row";

const meta = {
  title: "Web/Declarations/Ca3BoxRow",
  component: Ca3BoxRow,
  tags: ["autodocs"],
  args: {
    row: {
      box: "21",
      label: "Autre TVA à déduire",
      valueCents: 33_800,
      tone: "default",
    },
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
} satisfies Meta<typeof Ca3BoxRow>;

export default meta;
type Story = StoryObj<typeof Ca3BoxRow>;

export const Default: Story = {};

/** Box 08 carries the base and the tax, each with its own copy button. */
export const Dual: Story = {
  args: {
    row: {
      box: "08",
      label: "Base imposable · TVA collectée",
      valueCents: 1_054_900,
      value2Cents: 210_980,
      tone: "default",
    },
  },
};

export const Linked: Story = {
  args: {
    row: {
      box: "20",
      label: "Autres biens et services",
      valueCents: 13_180,
      tone: "default",
      source: { to: "/expenses", period: "2026-07", caption: "9 dépenses" },
      note: "dont 20 € autoliquidés",
    },
  },
};

export const Credit: Story = {
  args: {
    row: {
      box: "25",
      label: "Crédit de TVA",
      valueCents: 46_645,
      tone: "success",
      note: "reporté en case 22 sur la CA3 suivante",
    },
  },
};

export const Due: Story = {
  args: {
    row: { box: "32", label: "TVA à payer", valueCents: 197_800, tone: "due" },
  },
};

export const NothingDue: Story = {
  args: {
    row: {
      box: "32",
      label: "TVA à payer",
      valueCents: 0,
      tone: "quiet",
      note: "rien à payer ce mois",
    },
  },
};
