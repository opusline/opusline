import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import { MAX_STATEMENT_BYTES } from "../lib/statements";
import { ImportStatementDialog } from "./import-statement-dialog";

function renderDialog(
  overrides: Partial<ComponentProps<typeof ImportStatementDialog>> = {},
) {
  const onSubmit = vi.fn();

  render(
    <ImportStatementDialog
      open
      isSaving={false}
      error={null}
      onOpenChange={() => {}}
      onSubmit={onSubmit}
      {...overrides}
    />,
  );

  return { onSubmit };
}

function fileInput(): HTMLInputElement {
  return screen.getByLabelText(
    "Déposer le fichier, ou cliquer pour le choisir",
  ) as HTMLInputElement;
}

function pickFile(file: File) {
  fireEvent.change(fileInput(), { target: { files: [file] } });
}

it("refuses to submit before a file is chosen", () => {
  renderDialog();

  expect(
    screen.getByRole("button", { name: "Analyser le relevé" }),
  ).toBeDisabled();
});

it("shows the chosen file and submits it", () => {
  const { onSubmit } = renderDialog();
  const file = new File(["Date;Libellé;Montant"], "releve-aout.csv");

  pickFile(file);

  expect(screen.getByText(/releve-aout\.csv/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Analyser le relevé" }));

  expect(onSubmit).toHaveBeenCalledWith({ file, balanceCents: null });
});

it("sends the typed balance as signed cents", () => {
  const { onSubmit } = renderDialog();

  pickFile(new File(["x"], "releve.csv"));
  fireEvent.change(
    screen.getByLabelText("Solde du compte pro à la date du relevé"),
    { target: { value: "14820,50" } },
  );
  fireEvent.click(screen.getByRole("button", { name: "Analyser le relevé" }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ balanceCents: 1_482_050 }),
  );
});

it("refuses to submit an unreadable balance and says why", () => {
  const { onSubmit } = renderDialog();

  pickFile(new File(["x"], "releve.csv"));
  fireEvent.change(
    screen.getByLabelText("Solde du compte pro à la date du relevé"),
    { target: { value: "12," } },
  );

  expect(
    screen.getByRole("button", { name: "Analyser le relevé" }),
  ).toBeDisabled();
  expect(
    screen.getByLabelText("Solde du compte pro à la date du relevé"),
  ).toHaveAccessibleDescription(/Montant illisible/);
  expect(onSubmit).not.toHaveBeenCalled();
});

it("rejects a format no bank exports", () => {
  const { onSubmit } = renderDialog();

  pickFile(new File(["x"], "releve.pdf"));

  expect(
    screen.getByText("Format non pris en charge (CSV, OFX, QIF ou CAMT)."),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Analyser le relevé" }),
  ).toBeDisabled();
  expect(onSubmit).not.toHaveBeenCalled();
});

it("rejects an oversized file", () => {
  renderDialog();
  const file = new File(["x"], "releve.csv");
  Object.defineProperty(file, "size", { value: MAX_STATEMENT_BYTES + 1 });

  pickFile(file);

  expect(
    screen.getByText("Ce fichier est trop lourd (max 10 Mo)."),
  ).toBeInTheDocument();
});

it("surfaces the server's refusal", () => {
  renderDialog({
    error: "Ce fichier n'a pas pu être lu comme un relevé bancaire.",
  });

  expect(
    screen.getByText("Ce fichier n'a pas pu être lu comme un relevé bancaire."),
  ).toBeInTheDocument();
});
