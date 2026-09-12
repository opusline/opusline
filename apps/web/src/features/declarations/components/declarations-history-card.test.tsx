import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import { StoryRouter } from "@/test/story-router";

import { declarationsData } from "../lib/fixtures";
import { DeclarationsHistoryCard } from "./declarations-history-card";

it("reads each month's state across both filings", async () => {
  render(
    <StoryRouter>
      <DeclarationsHistoryCard
        history={declarationsData().history}
        period="2026-07"
      />
    </StoryRouter>,
  );

  const july = await screen.findByRole("row", { name: /^Juillet 2026/ });
  const june = screen.getByRole("row", { name: /^Juin 2026/ });
  const may = screen.getByRole("row", { name: /^Mai 2026/ });

  expect(july).toHaveClass("bg-primary/6");
  expect(within(july).getAllByText("à déclarer")).toHaveLength(2);
  expect(within(july).getAllByText("—")).toHaveLength(2);

  expect(within(june).getByText("28/07/2026")).toBeInTheDocument();
  expect(within(june).getByText(/^crédit 466\s€$/)).toBeInTheDocument();
  expect(within(june).getByText("14/07/2026")).toBeInTheDocument();
  // A credit month owes nothing: filed is done.
  expect(within(june).queryByText("à payer")).not.toBeInTheDocument();

  expect(within(may).getAllByText("15/06/2026")).toHaveLength(2);
});

it("links every row to its month", async () => {
  render(
    <StoryRouter>
      <DeclarationsHistoryCard
        history={declarationsData().history}
        period="2026-07"
      />
    </StoryRouter>,
  );

  expect(
    await screen.findByRole("link", { name: "Juin 2026" }),
  ).toHaveAttribute("href", "/declarations?period=2026-06");
});
