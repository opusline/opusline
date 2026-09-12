import type { Meta, StoryObj } from "@storybook/react";

import { CategoryBars } from "./category-bars";

const meta = {
  title: "Web/Expenses/CategoryBars",
  component: CategoryBars,
  tags: ["autodocs"],
  args: {
    title: "Par catégorie · HT",
    caption: "Août 2026",
    formatValue: (cents) => `${Math.round(cents / 100)} €`,
    rows: [
      { key: "hosting", label: "Hébergement", cents: 28_800 },
      { key: "phone", label: "Téléphone", cents: 29_004 },
      {
        key: "subscriptions",
        label: "Abonnements",
        cents: 14_200,
        tone: "quiet",
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CategoryBars>;

export default meta;
type Story = StoryObj<typeof CategoryBars>;

export const Default: Story = {};
