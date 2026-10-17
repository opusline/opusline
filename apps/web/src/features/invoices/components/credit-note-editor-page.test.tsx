import { fireEvent, render, screen } from "@testing-library/react";
import { type ComponentProps, useState } from "react";
import { expect, it, vi } from "vitest";

import { eur } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { newCreditNoteDraft } from "../lib/credit-note-draft";
import { documentDetail } from "../lib/invoice-document-fixture";
import { CreditNoteEditorPage } from "./credit-note-editor-page";

type Props = ComponentProps<typeof CreditNoteEditorPage>;

function Controlled(props: Props) {
  const [draft, setDraft] = useState(props.draft);

  return <CreditNoteEditorPage {...props} draft={draft} onChange={setDraft} />;
}

function renderEditor(overrides: Partial<Props> = {}) {
  const onIssue = vi.fn();

  render(
    <StoryRouter>
      <Controlled
        canIssue
        detail={documentDetail()}
        draft={newCreditNoteDraft(1, false)}
        error={null}
        isPending={false}
        nextNumber="A-2026-001"
        onChange={() => {}}
        onIssue={onIssue}
        paper={null}
        vatLiable
        {...overrides}
      />
    </StoryRouter>,
  );

  return { onIssue };
}

it("takes a line of the invoice back, at its rate", async () => {
  renderEditor();

  fireEvent.click(await screen.findByTestId("credit-note-take-line"));

  expect(screen.getByTestId("credit-note-line")).toHaveAttribute(
    "data-from-invoice",
    "true",
  );
  expect(screen.getByTestId("credit-note-line-label")).toHaveValue(
    "Atelier de cadrage",
  );
});

it("offers the full credit note only before any other one", async () => {
  renderEditor({
    detail: documentDetail({ amountCredited: eur(12_000) }),
  });

  await screen.findByTestId("credit-note-take-line");
  const kinds = screen
    .getAllByTestId("credit-note-kind")
    .map((kind) => kind.getAttribute("data-kind"));

  expect(kinds).not.toContain("full");
});

it("asks nothing about the money of an unpaid invoice", async () => {
  renderEditor();

  await screen.findByTestId("credit-note-take-line");
  expect(screen.queryByTestId("credit-note-settlement")).toBeNull();
});

it("asks what becomes of the money once some was received", async () => {
  renderEditor({ detail: documentDetail({ amountPaid: eur(198_000) }) });

  expect(await screen.findAllByTestId("credit-note-settlement")).toHaveLength(
    2,
  );
});

it("offers a corrected invoice for a full credit note", async () => {
  renderEditor({ draft: newCreditNoteDraft(0, true) });

  expect(await screen.findByTestId("credit-note-reissue")).toBeInTheDocument();
});

it("issues when the route can", async () => {
  const { onIssue } = renderEditor();

  fireEvent.click(await screen.findByTestId("credit-note-issue"));

  expect(onIssue).toHaveBeenCalledTimes(1);
});

it("does not offer a discount line to take back", async () => {
  const detail = documentDetail();
  const content = detail.content;
  if (content === null) {
    throw new Error("The fixture invoice has no content");
  }
  const [line] = content.lines;
  renderEditor({
    detail: {
      ...detail,
      content: {
        ...content,
        lines: [line, { ...line, id: line.id + 1, unitPrice: eur(-5_000) }],
      },
    },
  });

  expect(await screen.findAllByTestId("credit-note-take-line")).toHaveLength(1);
});
