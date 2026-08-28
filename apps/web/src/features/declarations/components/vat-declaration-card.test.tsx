import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { stubClipboard } from "@/test/clipboard";

import { vatDeclaration } from "../lib/fixtures";
import { VatDeclarationCard } from "./vat-declaration-card";

const clipboard = stubClipboard();

it("gives only the two boxes the teledeclaration lets you type", () => {
  render(<VatDeclarationCard vat={vatDeclaration()} />);

  expect(screen.getByText("TVA · 3310-CA3 juillet")).toBeInTheDocument();
  expect(screen.getByText("Réel normal")).toBeInTheDocument();

  expect(
    screen.getByText("Ventes, prestations de services"),
  ).toBeInTheDocument();
  expect(screen.getByText("case A1")).toBeInTheDocument();
  expect(screen.getByText("Taux normal 20 %")).toBeInTheDocument();
  expect(screen.getByText("case 08 · base HT")).toBeInTheDocument();

  // Both boxes take the same HT figure, and nothing else is offered.
  expect(screen.getAllByText("10 450")).toHaveLength(2);
  expect(screen.getAllByRole("button")).toHaveLength(2);
});

it("never offers the computed boxes as something to fill", () => {
  render(<VatDeclarationCard vat={vatDeclaration()} />);

  expect(screen.queryByText("case 16")).not.toBeInTheDocument();
  expect(screen.queryByText("case 28")).not.toBeInTheDocument();
  expect(screen.queryByText("case 32")).not.toBeInTheDocument();
});

it("cites the tax the form will work out so it can be checked", () => {
  render(<VatDeclarationCard vat={vatDeclaration()} />);

  expect(
    screen.getByText(
      "Le formulaire calcule le reste : taxe due 2 090 €, puis les totaux 16, 23, 28 et 32.",
    ),
  ).toBeInTheDocument();
});

it("picks the reduced-rate line when the month was billed at 10 %", () => {
  render(<VatDeclarationCard vat={vatDeclaration({ rateBp: 1000 })} />);

  expect(screen.getByText("Taux réduit 10 %")).toBeInTheDocument();
  expect(screen.getByText("case 9B · base HT")).toBeInTheDocument();
});

it("asks the user to split the rate line when the month mixes rates", () => {
  render(<VatDeclarationCard vat={vatDeclaration({ rateBp: null })} />);

  expect(screen.getByText("Ligne du taux applicable")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Votre mois mêle plusieurs taux : ventilez la base et la taxe sur les lignes 08, 9B ou 09 correspondantes.",
    ),
  ).toBeInTheDocument();
});

it("copies each box as whole euros without spaces", () => {
  render(<VatDeclarationCard vat={vatDeclaration()} />);

  fireEvent.click(
    screen.getByRole("button", {
      name: "Copier Ventes, prestations de services",
    }),
  );

  expect(clipboard.writeText).toHaveBeenLastCalledWith("10450");

  // The rate line copies the base, not the tax — its « Taxe due » column is
  // computed by the form.
  fireEvent.click(
    screen.getByRole("button", { name: "Copier Taux normal 20 %" }),
  );

  expect(clipboard.writeText).toHaveBeenLastCalledWith("10450");
  expect(clipboard.writeText).toHaveBeenCalledTimes(2);
});
