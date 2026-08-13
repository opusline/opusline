import type { Meta, StoryObj } from "@storybook/react";

import { craDetail } from "../lib/fixtures";
import { CraStatTiles } from "./cra-stat-tiles";

const meta = {
  title: "Web/Cra/CraStatTiles",
  component: CraStatTiles,
  tags: ["autodocs"],
  args: { cra: craDetail().cra, offDaysWorked: 0 },
  decorators: [
    (Story) => (
      <div className="max-w-4xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraStatTiles>;

export default meta;
type Story = StoryObj<typeof CraStatTiles>;

export const Default: Story = {};

export const WithAnEcart: Story = {
  args: { cra: craDetail({ differenceDays: -0.5, dirty: true }).cra },
};

export const NotPriced: Story = {
  args: { cra: craDetail({ estimatedAmount: null }).cra },
};

export const WithWorkedOffDays: Story = {
  args: { offDaysWorked: 2 },
};
