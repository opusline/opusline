import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { CreateInvoiceMenu } from "./create-invoice-menu";

it.each([
  [0, "opusline"],
  [1, "elsewhere"],
] as const)(
  "makes the settings' way the button's own (mode %i)",
  (mode, kind) => {
    const onCreate = vi.fn();
    const onAddElsewhere = vi.fn();

    render(
      <CreateInvoiceMenu
        mode={mode}
        onAddElsewhere={onAddElsewhere}
        onCreate={onCreate}
      />,
    );

    fireEvent.click(screen.getByTestId("invoice-create"));

    expect(screen.getByTestId("invoice-create")).toHaveAttribute(
      "data-kind",
      kind,
    );
    expect(kind === "opusline" ? onCreate : onAddElsewhere).toHaveBeenCalled();
  },
);

it("keeps the other way in its menu", async () => {
  const onAddElsewhere = vi.fn();

  render(
    <CreateInvoiceMenu
      mode={0}
      onAddElsewhere={onAddElsewhere}
      onCreate={vi.fn()}
    />,
  );

  fireEvent.click(screen.getByTestId("invoice-create-menu"));
  const items = await screen.findAllByTestId("invoice-create-item");
  const elsewhere = items.find(
    (item) => item.getAttribute("data-kind") === "elsewhere",
  );

  if (elsewhere === undefined) {
    throw new Error("the menu offers no way to record an invoice");
  }

  fireEvent.click(elsewhere);

  expect(onAddElsewhere).toHaveBeenCalled();
});
