import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { emptyRevenueData, revenueData } from "../lib/fixtures";
import { RevenueChart } from "./revenue-chart";

it("draws one clickable bar per month and reports the clicked one", () => {
  const onSelectMonth = vi.fn();
  render(
    <RevenueChart
      accountToday="2026-08-13"
      basis="invoiced"
      months={revenueData().months}
      onSelectMonth={onSelectMonth}
    />,
  );

  const bars = screen.getAllByRole("button");
  expect(bars).toHaveLength(8);

  fireEvent.click(screen.getByRole("button", { name: /^Juin 2026/ }));
  expect(onSelectMonth).toHaveBeenCalledWith("2026-06");
});

it("refuses to navigate into a month that has not happened", () => {
  const onSelectMonth = vi.fn();
  render(
    <RevenueChart
      accountToday="2026-06-15"
      basis="invoiced"
      months={revenueData().months}
      onSelectMonth={onSelectMonth}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: /^Juillet 2026/ }));
  expect(onSelectMonth).not.toHaveBeenCalled();
});

it("labels only the months that earned something", () => {
  render(
    <RevenueChart
      accountToday="2026-08-13"
      basis="invoiced"
      months={revenueData().months}
      onSelectMonth={() => {}}
    />,
  );

  // 11 410 € in thousands, French decimal.
  expect(screen.getByText("11,4")).toBeInTheDocument();
  // Five earning months in the fixture window, so five value labels.
  expect(screen.getAllByText(/^\d+(?:,\d+)?$/)).toHaveLength(5);
});

it("hides the label when the amount would round to zero", () => {
  const months = revenueData().months.map((bar) =>
    bar.month === "2026-03"
      ? { ...bar, total: { amount: 4_000, currency: "EUR" as const } }
      : bar,
  );

  render(
    <RevenueChart
      accountToday="2026-08-13"
      basis="invoiced"
      months={months}
      onSelectMonth={() => {}}
    />,
  );

  // A 40 € month must not wear a "0" — that reads as an empty month.
  expect(screen.queryByText("0")).not.toBeInTheDocument();
  expect(screen.getAllByText(/^\d+(?:,\d+)?$/)).toHaveLength(4);
});

it("still names every month on an empty window", () => {
  render(
    <RevenueChart
      accountToday="2026-08-13"
      basis="collected"
      months={emptyRevenueData().months}
      onSelectMonth={() => {}}
    />,
  );

  expect(screen.getAllByRole("button")).toHaveLength(12);
  expect(screen.queryByText(/^\d+(?:,\d+)?$/)).not.toBeInTheDocument();
});
