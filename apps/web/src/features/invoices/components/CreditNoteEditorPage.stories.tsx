import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentProps, useState } from "react";

import { eur } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { newCreditNoteDraft } from "../lib/credit-note-draft";
import { documentDetail } from "../lib/invoice-document-fixture";
import { invoicePaperFixture } from "../lib/invoice-paper-fixture";
import { CreditNoteEditorPage } from "./credit-note-editor-page";

function Controlled(props: ComponentProps<typeof CreditNoteEditorPage>) {
  const [draft, setDraft] = useState(props.draft);

  return <CreditNoteEditorPage {...props} draft={draft} onChange={setDraft} />;
}

const meta = {
  title: "Web/CreditNoteEditorPage",
  component: CreditNoteEditorPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
  render: (args) => <Controlled {...args} />,
  args: {
    detail: documentDetail(),
    draft: newCreditNoteDraft(1, false),
    onChange: () => {},
    paper: null,
    nextNumber: "A-2026-001",
    vatLiable: true,
    isPending: false,
    error: null,
    canIssue: false,
    onIssue: () => {},
  },
} satisfies Meta<typeof CreditNoteEditorPage>;

export default meta;
type Story = StoryObj<typeof CreditNoteEditorPage>;

/** A partial credit note before its reason: nothing to print yet. */
export const Partial: Story = {};

/** « Corriger la facture »: the whole invoice taken back, a corrected one to follow. */
export const Correct: Story = {
  args: {
    draft: { ...newCreditNoteDraft(0, true), reason: 0 },
    paper: { ...invoicePaperFixture, title: "Avoir", stamp: "Brouillon" },
    canIssue: true,
  },
};

/** The invoice was paid: the money goes back by transfer or off the next invoice. */
export const PaidInvoice: Story = {
  args: { detail: documentDetail({ status: 2, amountPaid: eur(198_000) }) },
};
