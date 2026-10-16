import { fireEvent, render, screen } from "@testing-library/react";
import { type ComponentProps, useState } from "react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";
import { catalogFixture } from "../lib/catalog-fixture";
import { freeLine, newInvoiceDraft } from "../lib/invoice-draft";
import {
  editorClients,
  editorUnbilledTime,
} from "../lib/invoice-editor-fixture";
import { invoicingSettingsFixture } from "../lib/invoicing-settings-fixture";
import { InvoiceEditorPage } from "./invoice-editor-page";

type Props = ComponentProps<typeof InvoiceEditorPage>;

function Controlled(props: Props) {
  const [draft, setDraft] = useState(props.draft);

  return <InvoiceEditorPage {...props} draft={draft} onChange={setDraft} />;
}

function renderEditor(overrides: Partial<Props> = {}) {
  const onSave = vi.fn();
  const onValidate = vi.fn();

  render(
    <StoryRouter>
      <Controlled
        catalog={catalogFixture}
        clients={editorClients}
        defaultVatRateBp={0}
        draft={{
          ...newInvoiceDraft("fr-FR", invoicingSettingsFixture),
          clientId: 1,
          missionId: 10,
        }}
        error={null}
        invoiceId={null}
        kind="invoice"
        isSaving={false}
        onChange={() => {}}
        onSave={onSave}
        onValidate={onValidate}
        paper={null}
        seller={{ iban: null, email: "theo@marchand.dev" }}
        settings={invoicingSettingsFixture}
        today="2026-10-14"
        unbilledTime={editorUnbilledTime}
        {...overrides}
      />
    </StoryRouter>,
  );

  return { onSave, onValidate };
}

it("imports the unbilled time as a line, then only once", async () => {
  const { onSave } = renderEditor();

  fireEvent.click(await screen.findByTestId("editor-import-time"));

  expect(screen.getAllByTestId("editor-line")).toHaveLength(1);
  expect(screen.getByTestId("editor-line-quantity")).toHaveValue("12,5");
  expect(screen.getByTestId("editor-import-time")).toBeDisabled();
  expect(screen.getByTestId("editor-time-linked")).toHaveAttribute(
    "data-entries",
    "3",
  );

  fireEvent.click(screen.getByTestId("editor-save"));

  expect(onSave).toHaveBeenCalledWith(
    expect.objectContaining({ timeEntryIds: [101, 102, 103] }),
  );
});

it("refuses to save while a line is unfinished", async () => {
  const { onSave, onValidate } = renderEditor({
    draft: {
      ...newInvoiceDraft("fr-FR", invoicingSettingsFixture),
      clientId: 1,
      lines: [{ ...freeLine(0), label: "Atelier" }],
    },
  });

  fireEvent.click(await screen.findByTestId("editor-validate"));

  expect(onValidate).not.toHaveBeenCalled();
  expect(onSave).not.toHaveBeenCalled();
  expect(screen.getByTestId("editor-lines-incomplete")).toBeInTheDocument();
  expect(screen.getByTestId("editor-line")).toHaveAttribute(
    "data-invalid",
    "true",
  );
});

it("copies a catalogue service at its stored price", async () => {
  renderEditor();

  fireEvent.click(await screen.findByTestId("editor-add-catalog"));
  const [first] = await screen.findAllByTestId("editor-catalog-item");

  if (first === undefined) {
    throw new Error("the catalogue menu lists no service");
  }

  fireEvent.click(first);

  expect(screen.getByTestId("editor-line-label")).toHaveValue(
    catalogFixture[0]?.label,
  );
});

it("cannot save before a client is chosen", async () => {
  renderEditor({
    draft: newInvoiceDraft("fr-FR", invoicingSettingsFixture),
  });

  expect(await screen.findByTestId("editor-save")).toBeDisabled();
  expect(screen.getByTestId("editor-mission")).toBeDisabled();
});

it("releases the imported time when the mission changes", async () => {
  renderEditor();

  fireEvent.click(await screen.findByTestId("editor-import-time"));
  expect(screen.getAllByTestId("editor-line")).toHaveLength(1);

  fireEvent.change(screen.getByTestId("editor-mission"), {
    target: { value: "" },
  });

  expect(screen.queryByTestId("editor-line")).not.toBeInTheDocument();
  expect(screen.queryByTestId("editor-time-linked")).not.toBeInTheDocument();
});

it("asks a quote for its validity and deposit, nothing about payment or time", async () => {
  const { onValidate } = renderEditor({
    kind: "quote",
    draft: {
      ...newInvoiceDraft("fr-FR", invoicingSettingsFixture),
      clientId: 1,
      lines: [{ ...freeLine(2000), label: "Audit", unitPrice: "1 200" }],
    },
  });

  expect(await screen.findByTestId("editor-validity")).toBeInTheDocument();
  expect(screen.queryByTestId("editor-import-time")).toBeNull();
  expect(screen.queryByTestId("editor-term")).toBeNull();
  expect(screen.queryByTestId("editor-period-start")).toBeNull();

  fireEvent.change(screen.getByTestId("editor-validity"), {
    target: { value: "60" },
  });
  fireEvent.change(screen.getByTestId("editor-deposit"), {
    target: { value: "3000" },
  });
  fireEvent.click(screen.getByTestId("editor-validate"));

  expect(onValidate).toHaveBeenCalledWith(
    expect.objectContaining({ validityDays: 60, depositRateBp: 3000 }),
  );
});
