import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";
import { EMAIL_PREVIEW, EMAIL_TEMPLATES } from "../lib/email-template-fixtures";
import { invoicePaperFixture } from "../lib/invoice-paper-fixture";
import { SendDocumentPage } from "./send-document-page";

const meta = {
  title: "Web/SendDocumentPage",
  component: SendDocumentPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
  args: {
    subject: { kind: "invoice", id: 41, number: "2026-041" },
    recipients: [{ address: "compta@nordlys.test", checked: true }],
    onRecipientsChange: () => {},
    senderEmail: "camille@aubrac.test",
    copyToSender: false,
    onCopyToSenderChange: () => {},
    draft: {
      subject: EMAIL_TEMPLATES[0]?.subject ?? "",
      body: EMAIL_TEMPLATES[0]?.body ?? "",
    },
    onDraftChange: () => {},
    isEdited: false,
    onResetDraft: () => {},
    preview: EMAIL_PREVIEW,
    isPreviewFailed: false,
    paper: invoicePaperFixture,
    reminders: { enabled: true, frequency: 0 },
    onRemindersChange: () => {},
    mailEnabled: true,
    isSending: false,
    onSend: () => {},
    isSendingTest: false,
    onSendTest: () => {},
    error: null,
  },
} satisfies Meta<typeof SendDocumentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An invoice about to leave, with the client's address ticked and reminders on. */
export const Invoice: Story = {};

/** A quote: no reminders aside. */
export const Quote: Story = {
  args: {
    subject: { kind: "quote", id: 3, number: "D-2026-003" },
    reminders: undefined,
    onRemindersChange: undefined,
  },
};

/** The client record has no address yet. */
export const NoContacts: Story = {
  args: { recipients: [] },
};

/** The wording was changed for this send. */
export const Reworded: Story = {
  args: {
    isEdited: true,
    draft: { subject: "Votre facture {numero}", body: "Bonjour {contact}," },
  },
};

/** No mailer on this instance. */
export const NoMailer: Story = {
  args: { mailEnabled: false },
};
