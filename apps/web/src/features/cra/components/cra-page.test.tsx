import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { craDetail, craItem, DEMO_SETTINGS } from "../lib/fixtures";
import { CraPage } from "./cra-page";

const items = [
  craItem({ id: null, month: "2026-08", status: 0 }),
  craItem({ id: 1, month: "2026-07", status: 0 }),
];

function renderPage(
  overrides: Partial<React.ComponentProps<typeof CraPage>> = {},
) {
  const handlers = {
    onDaysChange: vi.fn(),
    onDownload: vi.fn(),
    onGoToClients: vi.fn(),
    onOpenSignatureSettings: vi.fn(),
    onPick: vi.fn(),
    onReopen: vi.fn(),
    onReset: vi.fn(),
    onSend: vi.fn(),
    onSignedReturnOpenChange: vi.fn(),
    onStepChange: vi.fn(),
    onUploadSignedReturn: vi.fn(),
  };

  render(
    <CraPage
      counts={{ toProduce: 2, sent: 0, signed: 0 }}
      detail={craDetail()}
      error={null}
      isBusy={false}
      isDetailPending={false}
      isSignedReturnOpen={false}
      issuerFallbackName="Théo Marchand"
      items={items}
      settings={DEMO_SETTINGS}
      signatureSrc=""
      step="days"
      uploadError={null}
      {...handlers}
      {...overrides}
    />,
  );

  return handlers;
}

it("opens on the day grid", () => {
  renderPage();

  expect(
    screen.getByRole("grid", { name: "Jours du mois" }),
  ).toBeInTheDocument();
});

it("shows the review panel on the second step", () => {
  renderPage({ step: "review" });

  expect(screen.getByText("Avant l'envoi")).toBeInTheDocument();
  expect(screen.queryByRole("grid")).not.toBeInTheDocument();
});

it("shows the document on the third step", () => {
  renderPage({ step: "document" });

  expect(screen.getByText("Compte rendu d'activité")).toBeInTheDocument();
});

it("reports which step was asked for", () => {
  const { onStepChange } = renderPage();

  // The tracker and the footer both offer "Vérifier"; the tracker is the one that
  // jumps between steps, so the query says which list it means.
  const steps = screen.getByRole("list", { name: "Étapes du compte rendu" });
  fireEvent.click(within(steps).getByRole("button", { name: /Vérifier/ }));

  expect(onStepChange).toHaveBeenCalledWith("review");
});

it("sends from the last step of the guided flow, not from the header", () => {
  const { onSend } = renderPage({ step: "document" });

  fireEvent.click(screen.getByRole("button", { name: "Marquer envoyé" }));

  expect(onSend).toHaveBeenCalledWith(true);
});

it("asks for the next step rather than the send while the grid is still open", () => {
  const { onSend, onStepChange } = renderPage();

  fireEvent.click(screen.getByRole("button", { name: "Vérifier" }));

  expect(onSend).not.toHaveBeenCalled();
  expect(onStepChange).toHaveBeenCalledWith("review");
});

it("shows the grid and the document side by side once sent, with no steps left to walk", () => {
  renderPage({
    detail: craDetail({ status: 1, sentOn: "2026-08-01", editable: false }),
  });

  expect(
    screen.getByRole("grid", { name: "Jours du mois" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Compte rendu d'activité")).toBeInTheDocument();
  expect(
    screen.queryByRole("list", { name: "Étapes du compte rendu" }),
  ).not.toBeInTheDocument();
});

it("offers the signed return rather than another send once it is out", () => {
  renderPage({
    detail: craDetail({ status: 1, sentOn: "2026-08-01", editable: false }),
  });

  expect(
    screen.getByRole("button", { name: "Enregistrer le retour signé" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Marquer envoyé" }),
  ).not.toBeInTheDocument();
});

it("stops offering to edit a CRA the client already holds", () => {
  renderPage({
    detail: craDetail({ status: 1, sentOn: "2026-08-01", editable: false }),
  });

  expect(
    screen.queryByRole("button", { name: "Remplir les jours ouvrés" }),
  ).not.toBeInTheDocument();
});

it("surfaces a failed write", () => {
  renderPage({ error: "L'enregistrement a échoué." });

  expect(screen.getByText("L'enregistrement a échoué.")).toBeInTheDocument();
});

it("explains an account with nothing to report", () => {
  renderPage({
    counts: { toProduce: 0, sent: 0, signed: 0 },
    detail: null,
    items: [],
  });

  expect(
    screen.getByText("Aucune mission ne demande de CRA"),
  ).toBeInTheDocument();
});

it("waits on a skeleton rather than an empty screen", () => {
  renderPage({ detail: null, isDetailPending: true });

  expect(screen.queryByRole("grid")).not.toBeInTheDocument();
});
