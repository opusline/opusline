import type { MonthWorkloadData } from "@opusline/api-client";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { fiscalDeadlineItem } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";

import type { WeekBillableSummary } from "../lib/week-money";
import { type NextDeadline, WeekSummaryTiles } from "./week-summary-tiles";

const TODAY = "2026-08-13";

function summary(
  overrides: Partial<WeekBillableSummary> = {},
): WeekBillableSummary {
  return {
    amountCents: 275_000,
    valuedEntryCount: 5,
    nonBillableEntryCount: 0,
    fixedPriceEntryCount: 0,
    unratedEntryCount: 0,
    ...overrides,
  };
}

function month(overrides: Partial<MonthWorkloadData> = {}): MonthWorkloadData {
  return {
    month: "2026-08",
    businessDays: 21,
    workedDays: 18.5,
    ...overrides,
  };
}

/**
 * The row under test. `nextDeadline` defaults to "none", so a test about the
 * other two tiles has exactly one meter on screen to assert against.
 */
async function renderTiles({
  monthWorkload = null,
  nextDeadline = "none",
  billable = summary(),
}: {
  monthWorkload?: MonthWorkloadData | "unavailable" | null;
  nextDeadline?: NextDeadline;
  billable?: WeekBillableSummary;
} = {}) {
  const rendered = render(
    <StoryRouter>
      <WeekSummaryTiles
        monthWorkload={monthWorkload}
        nextDeadline={nextDeadline}
        summary={billable}
        today={TODAY}
      />
    </StoryRouter>,
  );

  // The router mounts its route tree asynchronously.
  await screen.findByText("Facturable cette semaine");

  return rendered;
}

it("shows the week's billable total as a whole HT figure", async () => {
  await renderTiles();

  expect(screen.getByText("2 750 €")).toBeInTheDocument();
  expect(screen.getByText("HT")).toBeInTheDocument();
  expect(screen.getByText("sur 5 entrées")).toBeInTheDocument();
});

it("mentions the time it deliberately left out", async () => {
  await renderTiles({
    billable: summary({ nonBillableEntryCount: 2, fixedPriceEntryCount: 1 }),
  });

  expect(
    screen.getByText("sur 5 entrées · 1 au forfait · 2 non facturables"),
  ).toBeInTheDocument();
});

it("mentions the time it could not value", async () => {
  await renderTiles({ billable: summary({ unratedEntryCount: 3 }) });

  expect(screen.getByText("sur 5 entrées · 3 sans tarif")).toBeInTheDocument();
});

it("says nothing billable was tracked rather than showing a bare zero", async () => {
  await renderTiles({
    billable: summary({
      amountCents: 0,
      valuedEntryCount: 0,
      nonBillableEntryCount: 2,
      fixedPriceEntryCount: 1,
    }),
  });

  expect(
    screen.getByText(
      "Rien de facturable saisi cette semaine · 1 au forfait · 2 non facturables",
    ),
  ).toBeInTheDocument();
});

it("reads the month as days worked against its business days", async () => {
  await renderTiles({ monthWorkload: month() });

  expect(screen.getByText("18,5 j")).toBeInTheDocument();
  expect(screen.getByText("sur 21 jours ouvrés")).toBeInTheDocument();
});

it("rounds a month of part-days rather than reading it to the hundredth", async () => {
  await renderTiles({ monthWorkload: month({ workedDays: 12.46 }) });

  expect(screen.getByText("12,5 j")).toBeInTheDocument();
});

it("fills the meter with the share of the month already worked", async () => {
  const { container } = await renderTiles({
    monthWorkload: month({ businessDays: 20, workedDays: 10 }),
  });

  expect(container.querySelector<HTMLElement>(".bg-primary")).toHaveStyle({
    width: "50%",
  });
});

it("stops the meter at full when the month ran past its business days", async () => {
  const { container } = await renderTiles({
    monthWorkload: month({ businessDays: 20, workedDays: 23 }),
  });

  expect(container.querySelector<HTMLElement>(".bg-primary")).toHaveStyle({
    width: "100%",
  });
});

it("leaves the month out until it loads", async () => {
  await renderTiles();

  expect(screen.queryByText("Mois en cours")).toBeNull();
});

it("reads the next deadline as what it is, when, and how much", async () => {
  await renderTiles({ nextDeadline: fiscalDeadlineItem() });

  expect(screen.getByText("Déclaration URSSAF")).toBeInTheDocument();
  expect(screen.getByText("1 240 €")).toBeInTheDocument();
  expect(
    screen.getByText("Échéance 31/08/2026 · dans 18 jours"),
  ).toBeInTheDocument();
});

it("says how late a deadline already is", async () => {
  await renderTiles({
    nextDeadline: fiscalDeadlineItem({ dueOn: "2026-08-10" }),
  });

  expect(
    screen.getByText("Échéance 10/08/2026 · en retard de 3 jours"),
  ).toBeInTheDocument();
});

it("links the whole tile through to the deadlines screen", async () => {
  await renderTiles({ nextDeadline: fiscalDeadlineItem() });

  expect(
    screen.getByRole("link", { name: /Prochaine échéance/ }),
  ).toHaveAttribute("href", "/deadlines");
});

it("shows a placeholder rather than a zero for an amount nobody knows yet", async () => {
  await renderTiles({ nextDeadline: fiscalDeadlineItem({ amount: null }) });

  expect(screen.getByText("—")).toBeInTheDocument();
});

it("fills the deadline meter with the share of the period already elapsed", async () => {
  // 1 July to 31 August is 61 days, and 13 August is day 43 of them.
  const { container } = await renderTiles({
    nextDeadline: fiscalDeadlineItem(),
  });
  const meters = container.querySelectorAll<HTMLElement>(".bg-primary");

  expect(meters).toHaveLength(1);
  expect(meters[0].style.width).toBe(`${(43 / 61) * 100}%`);
});

it("keeps the row's columns filled when only the deadline tile is there", async () => {
  const { container } = await renderTiles({
    monthWorkload: null,
    nextDeadline: fiscalDeadlineItem(),
  });

  // Billable(1) + fiscalDeadlineItem(2): four columns would leave one painted empty.
  expect(
    container.querySelector('[data-slot="stat-tile-row"]')?.className,
  ).toContain("lg:grid-cols-3");
});

it("keeps the failed deadline tile the width of the one it replaces", async () => {
  const { container } = await renderTiles({
    monthWorkload: month(),
    nextDeadline: "unavailable",
  });

  expect(screen.getByText("n’a pas pu être chargée")).toBeInTheDocument();
  expect(
    container.querySelectorAll('[data-slot="stat-tile"].lg\\:col-span-2'),
  ).toHaveLength(1);
});

it("says nothing is due for a business the French calendar does not cover", async () => {
  await renderTiles({ nextDeadline: "none" });

  expect(screen.queryByText("Déclaration URSSAF")).toBeNull();
  expect(screen.getByText("Rien à venir")).toBeInTheDocument();
});

it("leaves the deadline tile out until it loads", async () => {
  await renderTiles({ nextDeadline: null });

  expect(screen.queryByText("Prochaine échéance")).toBeNull();
});
