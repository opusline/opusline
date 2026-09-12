import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { stubClipboard } from "@/test/clipboard";
import { StoryRouter } from "@/test/story-router";

import {
  creditCarriedVatDeclaration,
  creditVatDeclaration,
  vatDeclaration,
} from "../lib/fixtures";
import { VatDeclarationCard } from "./vat-declaration-card";

const clipboard = stubClipboard();

function renderCard(
  overrides: Partial<Parameters<typeof VatDeclarationCard>[0]> = {},
) {
  const props = {
    vat: vatDeclaration(),
    isBusy: false,
    onMarkFiled: vi.fn(),
    onMarkPaid: vi.fn(),
    onUndo: vi.fn(),
    ...overrides,
  };

  render(
    <StoryRouter>
      <VatDeclarationCard {...props} />
    </StoryRouter>,
  );

  return props;
}

it("lists every box of the form in its order, the sales line as A1", async () => {
  renderCard();

  expect(await screen.findByText("TVA · CA3 juillet")).toBeInTheDocument();
  expect(screen.getByText("réel normal · mensuel")).toBeInTheDocument();

  const boxes = screen
    .getAllByText(/^case /)
    .map((node) => node.textContent?.split(" · ")[0]);

  expect(boxes).toEqual([
    "case A1",
    "case 2A",
    "case 3B",
    "case 08",
    "case 19",
    "case 20",
    "case 21",
    "case 22",
    "case 32",
  ]);
});

it("links the sales and the purchases to where they come from", async () => {
  renderCard();

  expect(await screen.findByRole("link", { name: /10\s450/ })).toHaveAttribute(
    "href",
    "/invoices",
  );
  expect(screen.getByRole("link", { name: /9 dépenses →/ })).toHaveAttribute(
    "href",
    "/expenses?period=2026-07",
  );
  expect(screen.getByText("case 20")).toHaveTextContent(
    /^case 20 · dont 20\s€ autoliquidés$/,
  );
});

it("shows both figures of box 08 and the tax to pay", async () => {
  renderCard();

  expect(await screen.findByText(/^10\s549$/)).toBeInTheDocument();
  expect(screen.getByText(/^2\s110$/)).toBeInTheDocument();
  expect(screen.getByText(/^1\s978$/)).toHaveClass("text-primary-text");
});

it("adds box 25 and quiets box 32 when the month ends in credit", async () => {
  renderCard({ vat: creditVatDeclaration() });

  expect(await screen.findByText("Crédit de TVA")).toBeInTheDocument();
  expect(screen.getByText("case 25")).toHaveTextContent(
    /^case 25 · reporté en case 22 sur la CA3 suivante · remboursable en fin d'année si ≥ 150\s€$/,
  );
  expect(screen.getByText("case 32")).toHaveTextContent(
    "case 32 · rien à payer ce mois",
  );
  expect(
    screen.getByText(
      /^Crédit de TVA de 466\s€ : il réduira la TVA à payer du mois prochain\.$/,
    ),
  ).toBeInTheDocument();
});

it("explains a credit carried in from the month before", async () => {
  renderCard({ vat: creditCarriedVatDeclaration() });

  expect(await screen.findByText("case 22")).toHaveTextContent(
    "case 22 · crédit de TVA de juin (case 25)",
  );
  expect(
    screen.getByText(
      /^Le crédit de 466\s€ reporté de juin réduit la TVA à payer : 1\s978\s€ − 466\s€ = 1\s512\s€\.$/,
    ),
  ).toBeInTheDocument();
});

it("copies every box at once, one per line, whole euros", async () => {
  renderCard();

  fireEvent.click(await screen.findByRole("button", { name: "Tout copier" }));

  expect(clipboard.writeText).toHaveBeenCalledWith(
    [
      "A1\t10450",
      "2A\t31",
      "3B\t68",
      "08\t10549",
      "08\t2110",
      "19\t0",
      "20\t132",
      "21\t0",
      "22\t0",
      "32\t1978",
    ].join("\n"),
  );
  expect(
    await screen.findByRole("button", { name: "10 cases copiées" }),
  ).toBeInTheDocument();
});

it("copies each figure of the dual line on its own", async () => {
  renderCard();

  fireEvent.click(
    await screen.findByRole("button", { name: "Copier la base imposable" }),
  );
  expect(clipboard.writeText).toHaveBeenLastCalledWith("10549");

  fireEvent.click(
    screen.getByRole("button", { name: "Copier la TVA collectée" }),
  );
  expect(clipboard.writeText).toHaveBeenLastCalledWith("2110");
});

it("tells a reduced-rate month where its base goes on the form", async () => {
  renderCard({ vat: vatDeclaration({ rateBp: 1000 }) });

  expect(await screen.findByText("case 08")).toHaveTextContent(
    /^case 08 · facturé à 10\s% : ligne 9B ou 09 du formulaire$/,
  );
});

it("asks a mixed-rate month to split its base", async () => {
  renderCard({ vat: vatDeclaration({ rateBp: null }) });

  expect(await screen.findByText("case 08")).toHaveTextContent(
    "plusieurs taux ce mois : ventilez sur les lignes 08, 9B et 09",
  );
});

it("records the filing", async () => {
  const props = renderCard();

  fireEvent.click(
    await screen.findByRole("button", { name: "Marquer comme déclarée" }),
  );

  expect(props.onMarkFiled).toHaveBeenCalled();
});
