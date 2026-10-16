import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentProps, useState } from "react";

import { StoryRouter } from "@/test/story-router";
import { catalogFixture } from "../lib/catalog-fixture";
import { catalogLine, freeLine, newInvoiceDraft } from "../lib/invoice-draft";
import {
  editorClients,
  editorPaper,
  editorUnbilledTime,
} from "../lib/invoice-editor-fixture";
import { invoicingSettingsFixture } from "../lib/invoicing-settings-fixture";
import { InvoiceEditorPage } from "./invoice-editor-page";

const FORMAT = { locale: "fr-FR", currency: "EUR" } as const;

/** Holds the draft the page edits, as the route's hook does. */
function ControlledEditor(props: ComponentProps<typeof InvoiceEditorPage>) {
  const [draft, setDraft] = useState(props.draft);

  return <InvoiceEditorPage {...props} draft={draft} onChange={setDraft} />;
}

const meta = {
  title: "Web/InvoiceEditorPage",
  component: InvoiceEditorPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
  render: (args) => <ControlledEditor {...args} />,
  args: {
    invoiceId: null,
    draft: newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture),
    onChange: () => {},
    clients: editorClients,
    catalog: catalogFixture,
    settings: invoicingSettingsFixture,
    seller: { iban: "FR7630006000011234567890189", email: "theo@marchand.dev" },
    defaultVatRateBp: 0,
    today: "2026-10-14",
    paper: null,
    unbilledTime: null,
    isSaving: false,
    error: null,
    onSave: () => {},
    onValidate: () => {},
  },
} satisfies Meta<typeof InvoiceEditorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A new invoice, before a client is chosen: nothing to preview yet. */
export const Empty: Story = {};

/** A client and mission chosen, its unbilled time ready to import. */
export const WithUnbilledTime: Story = {
  args: {
    draft: {
      ...newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture),
      clientId: 1,
      missionId: 10,
      title: "Refonte catalogue · septembre",
    },
    paper: { ...editorPaper, lines: [] },
    unbilledTime: editorUnbilledTime,
  },
};

/** Lines from the catalogue and by hand, previewed under the franchise. */
export const Filled: Story = {
  args: {
    invoiceId: 12,
    draft: {
      ...newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture),
      clientId: 1,
      title: "Refonte de l'espace client",
      lines: [
        ...catalogFixture.slice(0, 1).map((item) => catalogLine(FORMAT, item)),
        { ...freeLine(0), label: "Recette", quantity: "0,5", unitPrice: "480" },
      ],
    },
    paper: editorPaper,
  },
};

/** Liable for VAT: each line picks its rate. */
export const VatLiable: Story = {
  args: {
    ...Filled.args,
    settings: { ...invoicingSettingsFixture, vatLiable: true },
    defaultVatRateBp: 2000,
  },
};

/** A validation refused by the API, its reason on top. */
export const ValidationRefused: Story = {
  args: {
    ...Filled.args,
    error: "Complétez votre SIRET dans Réglages avant de valider une facture.",
  },
};
