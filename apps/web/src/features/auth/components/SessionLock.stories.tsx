import type { Meta, StoryObj } from "@storybook/react";
import { SessionLock } from "./session-lock";

const meta = {
  title: "Web/Auth/SessionLock",
  component: SessionLock,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    error: null,
    isPending: false,
    onSignOut: () => {},
    onUnlock: async () => null,
    reason: "inactivity",
  },
} satisfies Meta<typeof SessionLock>;

export default meta;
type Story = StoryObj<typeof SessionLock>;

export const Inactivity: Story = {};

export const Expired: Story = {
  args: { reason: "expired" },
};

export const WithRunningTimer: Story = {
  args: {
    status: (
      <div className="mt-4 rounded-md border bg-card px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-1.5 shrink-0 animate-pulse rounded-full bg-primary-text"
          />
          <span className="font-medium text-foreground-3 text-sm">
            Suivi en cours
          </span>
          <span className="flex-1" />
          <span className="font-mono text-primary-text text-sm tabular-nums">
            02:14:09
          </span>
        </div>
        <p className="mt-1.5 truncate text-muted-foreground-3 text-sm">
          Callisto front
        </p>
      </div>
    ),
  },
};

export const Pending: Story = {
  args: { isPending: true },
};

export const WithError: Story = {
  args: { error: "Trop de tentatives. Réessayez dans une minute." },
};
