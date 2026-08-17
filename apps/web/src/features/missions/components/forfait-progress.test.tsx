import type { MissionBillingProgressData } from "@opusline/api-client";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { ForfaitProgress } from "./forfait-progress";

function money(amount: number) {
  return { amount, currency: "EUR" as const };
}

function progress(
  overrides: Partial<MissionBillingProgressData> = {},
): MissionBillingProgressData {
  return {
    fixedPrice: money(1_000_000),
    invoiced: money(700_000),
    remaining: money(300_000),
    progressBp: 7000,
    isOverBilled: false,
    issuedCount: 2,
    draftCount: 0,
    ...overrides,
  };
}

it("shows what is billed against what was agreed", () => {
  render(<ForfaitProgress progress={progress()} />);

  expect(screen.getByText("7 000 €")).toBeInTheDocument();
  expect(screen.getByText("sur 10 000 € convenus")).toBeInTheDocument();
  expect(screen.getByText(/Reste à facturer · 3 000 €/)).toBeInTheDocument();
});

it("warns when more was billed than the forfait was sold for", () => {
  render(
    <ForfaitProgress
      progress={progress({
        invoiced: money(1_200_000),
        remaining: money(-200_000),
        progressBp: 12_000,
        isOverBilled: true,
      })}
    />,
  );

  expect(screen.getByText("Facturé au-delà du forfait")).toBeInTheDocument();
  expect(
    screen.getByText(/2 000 € de plus que les 10 000 € convenus/),
  ).toBeInTheDocument();
});

it("keeps the bar inside its track when the billing overran", () => {
  const { container } = render(
    <ForfaitProgress
      progress={progress({ progressBp: 12_000, isOverBilled: true })}
    />,
  );

  // 120% would otherwise paint past the rounded end of the track.
  const bar = container.querySelector<HTMLElement>("[style*='width']");
  expect(bar?.style.width).toBe("100%");
});

it("says nothing was issued rather than showing a bare zero", () => {
  render(
    <ForfaitProgress
      progress={progress({
        invoiced: money(0),
        remaining: money(1_000_000),
        progressBp: 0,
        issuedCount: 0,
      })}
    />,
  );

  expect(
    screen.getByText("Aucune échéance émise pour le moment."),
  ).toBeInTheDocument();
});

it("mentions a draft instalment that the total deliberately excludes", () => {
  render(<ForfaitProgress progress={progress({ draftCount: 1 })} />);

  expect(
    screen.getByText("Plus 1 brouillon non compté ici."),
  ).toBeInTheDocument();
});

it("pluralises the draft note", () => {
  render(<ForfaitProgress progress={progress({ draftCount: 2 })} />);

  expect(
    screen.getByText("Plus 2 brouillons non comptés ici."),
  ).toBeInTheDocument();
});
