import type { Meta, StoryObj } from "@storybook/react";

import { treasuryData } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import {
  emptyTreasuryData,
  noVatTreasuryData,
  pendingTransferTreasuryData,
  shortTreasuryData,
} from "../lib/fixtures";
import { TreasuryPage } from "./treasury-page";

const meta = {
  title: "Web/Treasury/TreasuryPage",
  component: TreasuryPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    data: treasuryData(),
    isRefreshing: false,
    deletingTransferId: null,
    onRecord: () => {},
    onDeleteTransfer: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof TreasuryPage>;

export default meta;
type Story = StoryObj<typeof TreasuryPage>;

export const Default: Story = {};

export const WithPendingTransfer: Story = {
  args: { data: pendingTransferTreasuryData() },
};

export const NotVatLiable: Story = {
  args: { data: noVatTreasuryData() },
};

export const ProvisionsExceedBalance: Story = {
  args: { data: shortTreasuryData() },
};

/** No balance recorded: the page sends the user to Compte pro first. */
export const NoBalanceYet: Story = {
  args: { data: emptyTreasuryData() },
};
