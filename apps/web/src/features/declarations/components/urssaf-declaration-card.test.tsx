import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { stubClipboard } from "@/test/clipboard";
import { eur } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import { shortSettlement, urssafDeclaration } from "../lib/fixtures";
import { UrssafDeclarationCard } from "./urssaf-declaration-card";

const clipboard = stubClipboard();

function renderCard(
  overrides: Partial<Parameters<typeof UrssafDeclarationCard>[0]> = {},
) {
  const props = {
    urssaf: urssafDeclaration(),
    isBusy: false,
    onMarkFiled: vi.fn(),
    onMarkPaid: vi.fn(),
    onUndo: vi.fn(),
    ...overrides,
  };

  render(
    <StoryRouter>
      <UrssafDeclarationCard {...props} />
    </StoryRouter>,
  );

  return props;
}

it("titles the month, shows the collected base and where it comes from", async () => {
  renderCard();

  expect(await screen.findByText("URSSAF · juillet")).toBeInTheDocument();
  expect(screen.getByText("mensuel · encaissements")).toBeInTheDocument();
  expect(screen.getByText(/^10\s450$/)).toBeInTheDocument();
  expect(screen.getByText("3 factures encaissées →")).toBeInTheDocument();
});

it("titles the declared quarter for a quarterly account", async () => {
  renderCard({
    urssaf: urssafDeclaration({ period: "2026-Q2", periodicity: 1 }),
  });

  expect(await screen.findByText("URSSAF · T2 2026")).toBeInTheDocument();
  expect(screen.getByText("trimestriel · encaissements")).toBeInTheDocument();
});

it("breaks the contributions down line by line to the total", async () => {
  renderCard();

  expect(await screen.findByText("Cotisations sociales")).toHaveTextContent(
    /26,1\s%/,
  );
  expect(screen.getByText("CFP")).toHaveTextContent(/0,2\s%/);
  expect(screen.getByText("Versement libératoire")).toHaveTextContent(/2,2\s%/);
  expect(
    screen.getByText("Total à payer").nextElementSibling,
  ).toHaveTextContent(/^2\s978\s€$/);
});

it("compares what is expected with what the compte pro set aside", async () => {
  renderCard({ urssaf: urssafDeclaration({ settlement: shortSettlement() }) });

  expect(
    (await screen.findByText("Provisionné sur le compte pro"))
      .nextElementSibling,
  ).toHaveTextContent(/^2\s500\s€$/);
  expect(screen.getByText("Écart").nextElementSibling).toHaveTextContent(
    /^−478\s€$/,
  );
});

it("colours the deadline as it closes in", async () => {
  renderCard({
    urssaf: urssafDeclaration({
      deadline: { dueOn: "2026-08-31", daysLeft: 3 },
    }),
  });

  expect(
    await screen.findByText(/À déclarer avant le 31\/08\/2026 · dans 3 j/),
  ).toHaveClass("text-attention");
});

it("says so once the deadline is past", async () => {
  renderCard({
    urssaf: urssafDeclaration({
      deadline: { dueOn: "2026-08-31", daysLeft: -2 },
    }),
  });

  expect(
    await screen.findByText(
      /À déclarer avant le 31\/08\/2026 · échéance dépassée/,
    ),
  ).toHaveClass("text-destructive");
});

it("records the filing", async () => {
  const props = renderCard();

  fireEvent.click(
    await screen.findByRole("button", { name: "Marquer comme déclarée" }),
  );

  expect(props.onMarkFiled).toHaveBeenCalled();
});

it("shows the filing and turns the deadline into a plain date", async () => {
  renderCard({
    urssaf: urssafDeclaration({
      completion: { declaredOn: "2026-08-09", paidOn: null },
    }),
  });

  expect(
    await screen.findByText(/Déclarée le 09\/08\/2026/),
  ).toBeInTheDocument();
  expect(screen.getByText(/Échéance : 31\/08\/2026/)).toBeInTheDocument();
});

it("then records the payment, or walks the filing back", async () => {
  const props = renderCard({
    urssaf: urssafDeclaration({
      completion: { declaredOn: "2026-08-09", paidOn: null },
    }),
  });

  fireEvent.click(await screen.findByRole("button", { name: "Marquer payée" }));
  expect(props.onMarkPaid).toHaveBeenCalled();

  fireEvent.click(screen.getByRole("button", { name: "Annuler" }));
  expect(props.onUndo).toHaveBeenCalledWith({
    declaredOn: "2026-08-09",
    paidOn: null,
  });
});

it("says the deadline is today", async () => {
  renderCard({
    urssaf: urssafDeclaration({
      deadline: { dueOn: "2026-08-31", daysLeft: 0 },
    }),
  });

  expect(
    await screen.findByText(/À déclarer avant le 31\/08\/2026 · aujourd'hui/),
  ).toHaveClass("text-attention");
});

it("shows the previous quarter while the running one cannot be filed", async () => {
  renderCard({
    urssaf: urssafDeclaration({
      period: "2026-Q2",
      periodicity: 1,
      coversShownMonth: false,
    }),
  });

  expect(
    await screen.findByText(
      "Le trimestre en cours se déclare à sa fin ; voici le précédent.",
    ),
  ).toBeInTheDocument();
});

it("shows the payment date and no further step once paid", async () => {
  renderCard({
    urssaf: urssafDeclaration({
      completion: { declaredOn: "2026-08-09", paidOn: "2026-08-12" },
    }),
  });

  expect(
    await screen.findByText(
      /Déclarée le 09\/08\/2026 · Payée le 12\/08\/2026 \(compte pro\)/,
    ),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Marquer payée" }),
  ).not.toBeInTheDocument();
});

it("copies the base as whole euros without spaces", async () => {
  renderCard();

  fireEvent.click(await screen.findByRole("button", { name: "Copier" }));

  expect(clipboard.writeText).toHaveBeenCalledWith("10450");
  expect(
    await screen.findByRole("button", { name: "Copié" }),
  ).toBeInTheDocument();
});

it("says so when the clipboard is unavailable over plain http", async () => {
  Reflect.deleteProperty(navigator, "clipboard");

  renderCard();
  fireEvent.click(await screen.findByRole("button", { name: "Copier" }));

  expect(
    await screen.findByRole("button", { name: "Échec de la copie" }),
  ).toBeInTheDocument();
});

it("shows a quiet period as a zero to declare rather than an empty card", async () => {
  renderCard({ urssaf: urssafDeclaration({ base: eur(0) }) });

  expect(await screen.findByText("0")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Copier" })).toBeInTheDocument();
});
