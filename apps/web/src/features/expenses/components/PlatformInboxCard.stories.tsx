import type { Meta, StoryObj } from "@storybook/react";

import { eInvoicingConnected } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { PlatformInboxCard } from "./platform-inbox-card";

const meta = {
  title: "Web/Expenses/PlatformInboxCard",
  component: PlatformInboxCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="max-w-180">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
  args: {
    settings: {
      ...eInvoicingConnected,
      lastSyncedAt: "2026-10-16T05:30:00+02:00",
    },
    count: 3,
    isSyncing: false,
    error: null,
    onSync: () => {},
  },
} satisfies Meta<typeof PlatformInboxCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Synced: Story = {};

/** Connected, never read yet: the first sync brings the whole inbox. */
export const NeverSynced: Story = {
  args: { settings: eInvoicingConnected, count: 0 },
};

export const Syncing: Story = {
  args: { isSyncing: true },
};

/** The nightly run was refused: the connection says why. */
export const Refused: Story = {
  args: {
    settings: {
      ...eInvoicingConnected,
      lastSyncedAt: "2026-10-14T05:30:00+02:00",
      lastError: 1,
    },
  },
};

export const SyncFailed: Story = {
  args: {
    error:
      "La plateforme de facturation électronique est injoignable. Réessayez plus tard.",
  },
};
