import type { Meta, StoryObj } from "@storybook/react";

import { InstanceDialog } from "./instance-dialog";

const recentBackup = {
  takenAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  archive: "./backups/opusline-20260909-030004.tar.gz",
  bytes: 41_234_567,
};

const meta = {
  title: "Web/InstanceDialog",
  component: InstanceDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    onOpenChange: () => {},
    version: "0.24.0",
    database: "pgsql",
    backup: recentBackup,
    isPending: false,
    error: null,
  },
} satisfies Meta<typeof InstanceDialog>;

export default meta;
type Story = StoryObj<typeof InstanceDialog>;

export const BackedUp: Story = {};

export const BackedUpToday: Story = {
  args: { backup: { ...recentBackup, takenAt: new Date().toISOString() } },
};

/** The state every fresh self-hosted instance is in until someone runs the script. */
export const NeverBackedUp: Story = {
  args: { backup: null },
};

export const Loading: Story = {
  args: { isPending: true, backup: null, database: null, version: null },
};

export const Unreadable: Story = {
  args: {
    error: "Impossible de lire cette instance.",
    backup: null,
    database: null,
    version: null,
  },
};
