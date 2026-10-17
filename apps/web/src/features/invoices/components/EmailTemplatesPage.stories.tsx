import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";
import { EMAIL_PREVIEW, EMAIL_TEMPLATES } from "../lib/email-template-fixtures";
import { EmailTemplatesPage } from "./email-templates-page";

const meta = {
  title: "Web/EmailTemplatesPage",
  component: EmailTemplatesPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
  args: {
    templates: EMAIL_TEMPLATES,
    selected: 0,
    onSelect: () => {},
    draft: {
      subject: EMAIL_TEMPLATES[0]?.subject ?? "",
      body: EMAIL_TEMPLATES[0]?.body ?? "",
    },
    onDraftChange: () => {},
    isDirty: false,
    isSaving: false,
    onSave: () => {},
    onCancel: () => {},
    onReset: () => {},
    preview: EMAIL_PREVIEW,
    isPreviewFailed: false,
    mailEnabled: true,
    isSendingTest: false,
    onSendTest: () => {},
    error: null,
  },
} satisfies Meta<typeof EmailTemplatesPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The new-invoice template as shipped, with its preview. */
export const Default: Story = {};

/** A reworded reminder, « modifié » in the list, with a way back to the default. */
export const Reworded: Story = {
  args: {
    selected: 3,
    draft: {
      subject: EMAIL_TEMPLATES[3]?.subject ?? "",
      body: EMAIL_TEMPLATES[3]?.body ?? "",
    },
  },
};

/** Typing: the save bar waits at the bottom. */
export const Editing: Story = {
  args: {
    isDirty: true,
    draft: {
      subject: "Votre facture {numero}",
      body: EMAIL_TEMPLATES[0]?.body ?? "",
    },
  },
};

/** No mailer on this instance: no test send, and a word on why. */
export const NoMailer: Story = {
  args: { mailEnabled: false },
};

/** The preview could not be rendered. */
export const PreviewFailed: Story = {
  args: { preview: null, isPreviewFailed: true },
};
