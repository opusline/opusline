import type { Meta, StoryObj } from "@storybook/react";

import { APP_VERSION } from "@/lib/version";
import { ReleaseNotesPage } from "./release-notes-page";

const meta = {
  title: "Web/ReleaseNotes/ReleaseNotesPage",
  component: ReleaseNotesPage,
  tags: ["autodocs"],
  args: {
    seenVersion: APP_VERSION,
    isMarking: false,
    onMarkRead: () => {},
  },
} satisfies Meta<typeof ReleaseNotesPage>;

export default meta;
type Story = StoryObj<typeof ReleaseNotesPage>;

export const AllRead: Story = {};

export const WithUnread: Story = {
  args: {
    seenVersion: "0.8.0",
  },
};

export const FirstVisitAfterUpgrade: Story = {
  args: {
    seenVersion: null,
  },
};
