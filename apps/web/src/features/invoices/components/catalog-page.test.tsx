import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { catalogFixture } from "../lib/catalog-fixture";
import { CatalogPage } from "./catalog-page";

function renderPage(vatLiable = true, items = catalogFixture) {
  const onSave = vi.fn().mockResolvedValue(true);
  const onRemove = vi.fn();

  render(
    <CatalogPage
      error={null}
      isSaving={false}
      items={items}
      onRemove={onRemove}
      onSave={onSave}
      vatLiable={vatLiable}
    />,
  );

  return { onSave, onRemove };
}

it("adds a service with its price in cents", async () => {
  const { onSave } = renderPage();

  fireEvent.click(screen.getByTestId("catalog-add"));
  fireEvent.change(screen.getByTestId("catalog-form-label"), {
    target: { value: "Recette et mise en ligne" },
  });
  fireEvent.change(screen.getByTestId("catalog-form-unit"), {
    target: { value: "2" },
  });
  fireEvent.change(screen.getByTestId("catalog-form-price"), {
    target: { value: "500" },
  });
  fireEvent.click(screen.getByTestId("catalog-form-save"));

  await waitFor(() =>
    expect(onSave).toHaveBeenCalledWith(null, {
      label: "Recette et mise en ligne",
      detail: null,
      unit: 2,
      unitPrice: { amount: 50_000, currency: "EUR" },
      vatRateBp: 2000,
    }),
  );
  await waitFor(() =>
    expect(screen.queryByTestId("catalog-form")).not.toBeInTheDocument(),
  );
});

it("asks for a name and a price before saving", () => {
  const { onSave } = renderPage();

  fireEvent.click(screen.getByTestId("catalog-add"));
  fireEvent.click(screen.getByTestId("catalog-form-save"));

  expect(onSave).not.toHaveBeenCalled();
  expect(screen.getByText("Donnez un nom à la prestation")).toBeInTheDocument();
  expect(
    screen.getByText("Indiquez un prix supérieur à zéro"),
  ).toBeInTheDocument();
});

it("edits a service from its stored values", async () => {
  const { onSave } = renderPage();

  fireEvent.click(screen.getAllByTestId("catalog-item-edit")[1] as HTMLElement);
  expect(screen.getByTestId("catalog-form-price")).toHaveValue("85");
  fireEvent.click(screen.getByTestId("catalog-form-save"));

  await waitFor(() =>
    expect(onSave).toHaveBeenCalledWith(
      2,
      expect.objectContaining({
        unitPrice: { amount: 8_500, currency: "EUR" },
      }),
    ),
  );
});

it("reads « franchise » in the VAT column for an account without VAT", () => {
  renderPage(false);

  expect(screen.getAllByText("franchise")).toHaveLength(catalogFixture.length);
});

it("says the catalogue is empty", () => {
  renderPage(true, []);

  expect(screen.getByTestId("catalog-empty")).toBeInTheDocument();
});

it("points each invalid input at its own error message", async () => {
  renderPage();

  fireEvent.click(screen.getByTestId("catalog-add"));
  fireEvent.click(screen.getByTestId("catalog-form-save"));

  for (const testId of ["catalog-form-label", "catalog-form-price"]) {
    const input = screen.getByTestId(testId);
    expect(input).toHaveAttribute("aria-invalid", "true");
    const errorId = input.getAttribute("aria-describedby");
    expect(errorId).not.toBeNull();
    expect(document.getElementById(errorId as string)).toHaveTextContent(/./);
  }
});
