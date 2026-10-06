import type { Meta, StoryObj } from "@storybook/react";

import { EmailNotificationsCard } from "./email-notifications-card";

const meta = {
  title: "Web/Settings/EmailNotificationsCard",
  component: EmailNotificationsCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-160">
        <Story />
      </div>
    ),
  ],
  args: {
    preferences: { securityAlerts: true, deadlineReminders: true },
    isMailEnabled: true,
    isSaving: false,
    error: null,
    onChange: () => {},
  },
} satisfies Meta<typeof EmailNotificationsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllOn: Story = {};

export const RemindersOff: Story = {
  args: { preferences: { securityAlerts: true, deadlineReminders: false } },
};

/** An instance whose operator configured no mailer: the choices are kept for later. */
export const MailNotConfigured: Story = {
  args: { isMailEnabled: false },
};

export const Saving: Story = {
  args: { isSaving: true },
};

export const SaveFailed: Story = {
  args: { error: "The preferences could not be saved." },
};
