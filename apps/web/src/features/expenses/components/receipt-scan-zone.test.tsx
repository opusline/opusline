import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { ReceiptScanZone } from "./receipt-scan-zone";

function renderDone(reader: 0 | 1, claudeFailure: 0 | 1 | 2 | null) {
  render(
    <ReceiptScanZone
      onFile={() => {}}
      onReset={() => {}}
      state={{
        status: "done",
        fileName: "facture.pdf",
        readCount: 3,
        hasCategory: false,
        reader,
        claudeFailure,
      }}
    />,
  );
}

it.each([
  [1, null, m.expenses_scan_read_by_claude()],
  [0, 0, m.expenses_scan_claude_key_rejected()],
  [0, 1, m.expenses_scan_claude_unavailable()],
  [0, 2, m.expenses_scan_claude_unreadable()],
] as const)(
  "says who read the receipt (reader %i, failure %s)",
  (reader, claudeFailure, note) => {
    renderDone(reader, claudeFailure);

    expect(screen.getByText(note)).toBeVisible();
  },
);

it("says nothing about Claude for an account without a key", () => {
  renderDone(0, null);

  expect(screen.queryByTestId("receipt-scan-reader")).toBeNull();
});

it("offers no choice of reader to an account without a key", () => {
  render(
    <ReceiptScanZone
      onFile={() => {}}
      onReset={() => {}}
      state={{ status: "idle" }}
    />,
  );

  expect(screen.queryByTestId("receipt-reader")).toBeNull();
});

it("lets an account with a key keep a receipt on the server", () => {
  const onChange = vi.fn();
  render(
    <ReceiptScanZone
      onFile={() => {}}
      onReset={() => {}}
      readerChoice={{ reader: 1, onChange }}
      state={{ status: "idle" }}
    />,
  );

  expect(screen.getByText(m.expenses_scan_zone_sub_claude())).toBeVisible();

  fireEvent.click(
    screen.getByRole("button", { name: m.expenses_scan_reader_server() }),
  );

  expect(onChange).toHaveBeenCalledWith(0);
});
