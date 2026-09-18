import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";
import { bankConnection } from "../lib/fixtures";
import { BankConnectionCard } from "./bank-connection-card";

const meta = {
  title: "Web/Bank/BankConnectionCard",
  component: BankConnectionCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="max-w-4xl">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
  args: {
    data: { bankSyncConfigured: true, connection: bankConnection() },
    isSyncing: false,
    isDisconnecting: false,
    onConnect: () => {},
    onChooseAccount: () => {},
    onSync: () => {},
    onDisconnect: () => {},
  },
} satisfies Meta<typeof BankConnectionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Syncing: Story = {
  args: { isSyncing: true },
};

export const LastSyncFailed: Story = {
  args: {
    data: {
      bankSyncConfigured: true,
      connection: bankConnection({
        lastError: 1,
      }),
    },
  },
};

export const ConsentEndingSoon: Story = {
  args: {
    data: {
      bankSyncConfigured: true,
      connection: bankConnection({
        validUntil: new Date(Date.now() + 5 * 86_400_000).toISOString(),
      }),
    },
  },
};

export const AwaitingAccount: Story = {
  args: {
    data: {
      bankSyncConfigured: true,
      connection: bankConnection({
        status: 1,
        account: null,
        accounts: [
          { uid: "a-1", name: "Compte pro", ibanLast4: "0185" },
          { uid: "a-2", name: "Compte réserve", ibanLast4: "0999" },
        ],
      }),
    },
  },
};

export const Expired: Story = {
  args: {
    data: {
      bankSyncConfigured: true,
      connection: bankConnection({ status: 2, lastError: 2 }),
    },
  },
};

export const ReadyToConnect: Story = {
  args: { data: { bankSyncConfigured: true, connection: null } },
};

export const NotSetUp: Story = {
  args: { data: { bankSyncConfigured: false, connection: null } },
};
