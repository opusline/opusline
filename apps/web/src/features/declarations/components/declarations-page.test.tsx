import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { StoryRouter } from "@/test/story-router";

import {
  beforeStartDeclarationsData,
  declarationsData,
  filedDeclarationsData,
} from "../lib/fixtures";
import { DeclarationsPage } from "./declarations-page";

function renderPage(
  overrides: Partial<Parameters<typeof DeclarationsPage>[0]> = {},
) {
  const props = {
    data: declarationsData(),
    isRefreshing: false,
    pendingTarget: null,
    onPeriodChange: vi.fn(),
    onMarkFiled: vi.fn(),
    onMarkPaid: vi.fn(),
    onUnmark: vi.fn(),
    onClearPayment: vi.fn(),
    onPayCfe: vi.fn(),
    today: "2026-08-20",
    onSaveCfeAmount: vi.fn(async () => {}),
    ...overrides,
  };

  render(
    <StoryRouter>
      <DeclarationsPage {...props} />
    </StoryRouter>,
  );

  return props;
}

it("shows both cards, the ceiling and the history for a réel normal month", async () => {
  renderPage();

  expect(await screen.findByText("URSSAF · juillet")).toBeInTheDocument();
  expect(screen.getByText("TVA · CA3 juillet")).toBeInTheDocument();
  expect(screen.getByText("CA cumulé 2026")).toBeInTheDocument();
  expect(screen.getByText("Historique · 6 derniers mois")).toBeInTheDocument();
});

it("shows no CA3 card outside réel normal", async () => {
  renderPage({ data: declarationsData({ vat: null }) });

  expect(await screen.findByText("URSSAF · juillet")).toBeInTheDocument();
  expect(screen.queryByText(/CA3 juillet/)).not.toBeInTheDocument();
});

it("steps through the months from the header", async () => {
  const props = renderPage();

  fireEvent.click(
    await screen.findByRole("button", { name: "Période précédente" }),
  );

  expect(props.onPeriodChange).toHaveBeenCalledWith("2026-06");
  expect(
    screen.getByRole("button", { name: "Période suivante" }),
  ).toBeEnabled();
});

it("cannot step past the month to file next", async () => {
  renderPage({ data: declarationsData({ nextPeriod: null }) });

  expect(
    await screen.findByRole("button", { name: "Période suivante" }),
  ).toBeDisabled();
});

it("names each filing it marks", async () => {
  const props = renderPage();

  const [urssaf, vat] = await screen.findAllByRole("button", {
    name: "Marquer comme déclarée",
  });
  fireEvent.click(urssaf);
  fireEvent.click(vat);

  expect(props.onMarkFiled).toHaveBeenNthCalledWith(1, {
    kind: 0,
    periodKey: "2026-07",
  });
  expect(props.onMarkFiled).toHaveBeenNthCalledWith(2, {
    kind: 1,
    periodKey: "2026-07",
  });
});

it("undoes the payment first, then the filing", async () => {
  const props = renderPage({ data: filedDeclarationsData() });

  const [urssafUndo, vatUndo] = await screen.findAllByRole("button", {
    name: "Annuler",
  });
  fireEvent.click(urssafUndo as HTMLElement);
  fireEvent.click(vatUndo as HTMLElement);

  // URSSAF is paid: only the payment goes. The CA3 is only filed: the mark goes.
  expect(props.onClearPayment).toHaveBeenCalledWith({
    kind: 0,
    periodKey: "2026-07",
  });
  expect(props.onUnmark).toHaveBeenCalledWith({
    kind: 1,
    periodKey: "2026-07",
  });
});

it("greys out only the card being written", async () => {
  renderPage({ pendingTarget: { kind: 1, periodKey: "2026-07" } });

  const [urssaf, vat] = await screen.findAllByRole("button", {
    name: "Marquer comme déclarée",
  });

  expect(urssaf).toBeEnabled();
  expect(vat).toBeDisabled();
});

it("says so before the business started, instead of a zero card to tick", async () => {
  renderPage({ data: beforeStartDeclarationsData() });

  expect(
    await screen.findByText(
      "Aucune activité déclarable avant le début de l'activité.",
    ),
  ).toBeInTheDocument();
  expect(screen.queryByText(/URSSAF ·/)).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Marquer comme déclarée" }),
  ).not.toBeInTheDocument();
});

it("lists the year's two returns with their due dates", async () => {
  renderPage();

  expect(await screen.findByText("2042-C PRO")).toBeInTheDocument();
  expect(screen.getByText("avant le 28/05/2027")).toBeInTheDocument();
  expect(screen.getByText("15/12/2026")).toBeInTheDocument();
  expect(screen.getAllByText("À venir")).toHaveLength(2);
});

it("pays the CFE from its sheet, both steps at once", async () => {
  const props = renderPage();

  fireEvent.click(await screen.findByRole("button", { name: "Voir CFE" }));
  fireEvent.click(
    await screen.findByRole("button", { name: "Marquer comme payée" }),
  );

  expect(props.onPayCfe).toHaveBeenCalledWith({ kind: 3, periodKey: "2026" });
});

it("files a closed year's 2042 from its sheet, never the running one", async () => {
  const props = renderPage({ today: "2027-06-02" });

  fireEvent.click(
    await screen.findByRole("button", { name: "Voir 2042-C PRO" }),
  );
  fireEvent.click(
    await screen.findByRole("button", { name: "Marquer comme déclarée" }),
  );

  expect(props.onMarkFiled).toHaveBeenCalledWith({
    kind: 5,
    periodKey: "2026",
  });
});
