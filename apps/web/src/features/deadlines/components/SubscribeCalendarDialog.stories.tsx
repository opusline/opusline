import type { Meta, StoryObj } from "@storybook/react";

import { DEMO_BOARD, DEMO_SUBSCRIBED_BOARD } from "../lib/fixtures";
import { SubscribeCalendarDialog } from "./subscribe-calendar-dialog";

const meta = {
  title: "Web/Deadlines/SubscribeCalendarDialog",
  component: SubscribeCalendarDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    onOpenChange: () => {},
    calendarToken: DEMO_BOARD.calendarToken,
    feed: DEMO_BOARD.calendarFeed,
    subscribedOn: null,
    lastSyncedAt: null,
    isSaving: false,
    onSave: () => {},
    isRotating: false,
    onRotate: () => {},
    isInterrupting: false,
    onInterrupt: () => {},
  },
} satisfies Meta<typeof SubscribeCalendarDialog>;

export default meta;
type Story = StoryObj<typeof SubscribeCalendarDialog>;

/** First contact: the address as a calendar app wants it, and what it will carry. */
export const Default: Story = {};

/**
 * Once the address lives in a calendar: the management flavor, with the
 * heartbeat line and « Interrompre » in place of Annuler.
 */
export const Subscribed: Story = {
  args: {
    subscribedOn: DEMO_SUBSCRIBED_BOARD.calendarSubscribedOn,
    lastSyncedAt: DEMO_SUBSCRIBED_BOARD.calendarLastSyncedAt,
  },
};
