import { showInvoiceSummaryQueryKey } from "@opusline/api-client/react-query";
import { SidebarProvider } from "@opusline/ui/components/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { seedCurrentUser } from "@/test/current-user";
import { eur, invoiceSummary } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { InvoicingSidebar } from "./invoicing-sidebar";

function renderSidebar(open: number, late: number) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  seedCurrentUser(client);
  client.setQueryData(
    showInvoiceSummaryQueryKey(),
    invoiceSummary({
      toCollect: { amount: eur(1_874_400), count: open },
      overdue: { amount: eur(122_400), count: late, maxDaysLate: 41 },
    }),
  );

  render(
    <QueryClientProvider client={client}>
      <StoryRouter>
        <SidebarProvider>
          <InvoicingSidebar />
        </SidebarProvider>
      </StoryRouter>
    </QueryClientProvider>,
  );
}

it("sums up what is still owed, and how much of it is late", async () => {
  renderSidebar(4, 1);

  expect(await screen.findByTestId("invoicing-to-collect")).toHaveTextContent(
    "4 factures ouvertes · 1 en retard",
  );
});

it("leaves the late count out when nothing is late", async () => {
  renderSidebar(1, 0);

  expect(await screen.findByTestId("invoicing-to-collect")).toHaveTextContent(
    "1 facture ouverte",
  );
  expect(screen.getByTestId("invoicing-to-collect")).not.toHaveTextContent(
    "retard",
  );
});

it("leads back to the rest of the app", async () => {
  renderSidebar(0, 0);

  expect(await screen.findByTestId("invoicing-exit")).toHaveAttribute(
    "href",
    "/week",
  );
});
