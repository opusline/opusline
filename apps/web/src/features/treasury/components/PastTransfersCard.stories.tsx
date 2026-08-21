import type { Meta, StoryObj } from "@storybook/react";

import { treasuryData } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import { pendingTransferTreasuryData } from "../lib/fixtures";
import { PastTransfersCard } from "./past-transfers-card";

const meta = {
  title: "Web/Treasury/PastTransfersCard",
  component: PastTransfersCard,
  tags: ["autodocs"],
  args: {
    transfers: treasuryData().transfers,
    deletingTransferId: null,
    onDelete: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof PastTransfersCard>;

export default meta;
type Story = StoryObj<typeof PastTransfersCard>;

export const Default: Story = {};

/** The newest row is not on a relevé yet, and says so. */
export const WithPendingTransfer: Story = {
  args: { transfers: pendingTransferTreasuryData().transfers },
};

export const NothingRecorded: Story = {
  args: { transfers: [] },
};

export const Deleting: Story = {
  args: { deletingTransferId: 1 },
};
