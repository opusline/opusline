import type { Meta, StoryObj } from "@storybook/react";

import { MailDeliveryCard } from "./mail-delivery-card";

const meta = {
  title: "Web/Settings/MailDeliveryCard",
  component: MailDeliveryCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="max-w-160">
        <Story />
      </div>
    ),
  ],
  args: {
    isMailEnabled: true,
    email: "theo@studio-lorem.example",
    isSending: false,
    isSent: false,
    error: null,
    onSendTest: () => {},
  },
} satisfies Meta<typeof MailDeliveryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

/** An instance whose operator named no mailer: how to turn mail on, and no test to run. */
export const NotConfigured: Story = {
  args: { isMailEnabled: false },
};

export const Sending: Story = {
  args: { isSending: true },
};

export const TestSent: Story = {
  args: { isSent: true },
};

/** The relay's own answer is shown as it came back. */
export const TestFailed: Story = {
  args: {
    error:
      'The test email could not be sent: Connection could not be established with host "smtp.studio-lorem.example:587"',
  },
};
