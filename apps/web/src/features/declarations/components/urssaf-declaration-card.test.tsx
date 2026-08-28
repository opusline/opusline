import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { stubClipboard } from "@/test/clipboard";
import { eur } from "@/test/fixtures";

import { urssafDeclaration } from "../lib/fixtures";
import { UrssafDeclarationCard } from "./urssaf-declaration-card";

const clipboard = stubClipboard();

it("titles the declared month and shows the collected base", () => {
  render(<UrssafDeclarationCard urssaf={urssafDeclaration()} />);

  expect(screen.getByText("URSSAF · juillet")).toBeInTheDocument();
  expect(screen.getByText("mensuel · encaissements")).toBeInTheDocument();
  expect(screen.getByText("10 450")).toBeInTheDocument();
});

it("titles the declared quarter for a quarterly account", () => {
  render(
    <UrssafDeclarationCard
      urssaf={urssafDeclaration({ period: "2026-Q2", periodicity: 1 })}
    />,
  );

  expect(screen.getByText("URSSAF · T2 2026")).toBeInTheDocument();
  expect(screen.getByText("trimestriel · encaissements")).toBeInTheDocument();
});

it("copies the base as whole euros without spaces", async () => {
  render(<UrssafDeclarationCard urssaf={urssafDeclaration()} />);
  fireEvent.click(screen.getByRole("button", { name: "Copier" }));

  expect(clipboard.writeText).toHaveBeenCalledWith("10450");
  expect(
    await screen.findByRole("button", { name: "Copié" }),
  ).toBeInTheDocument();
});

it("says so when the clipboard is unavailable over plain http", async () => {
  Reflect.deleteProperty(navigator, "clipboard");

  render(<UrssafDeclarationCard urssaf={urssafDeclaration()} />);
  fireEvent.click(screen.getByRole("button", { name: "Copier" }));

  expect(
    await screen.findByRole("button", { name: "Échec de la copie" }),
  ).toBeInTheDocument();
});

it("shows a quiet period as a zero to declare rather than an empty card", () => {
  render(
    <UrssafDeclarationCard urssaf={urssafDeclaration({ base: eur(0) })} />,
  );

  expect(screen.getByText("0")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Copier" })).toBeInTheDocument();
});
