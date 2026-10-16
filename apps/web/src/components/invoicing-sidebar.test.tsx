import { showInvoiceSummaryQueryKey } from "@opusline/api-client/react-query";
import { SidebarProvider, useSidebar } from "@opusline/ui/components/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it } from "vitest";

import { seedCurrentUser } from "@/test/current-user";
import { eur, invoiceSummary } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { InvoicingSidebar } from "./invoicing-sidebar";

function OpenOnMobile() {
  const { setOpenMobile } = useSidebar();

  return (
    <button
      data-testid="open-mobile"
      onClick={() => setOpenMobile(true)}
      type="button"
    >
      open
    </button>
  );
}

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
          <OpenOnMobile />
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

it("keeps the New menu within reach of a collapsed sidebar, as links", async () => {
  renderSidebar(0, 0);

  fireEvent.click(await screen.findByTestId("invoicing-new-collapsed"));

  const items = await screen.findAllByTestId("invoicing-new-item");
  const external = items.find(
    (item) => item.dataset.kind === "external-invoice",
  );

  expect(external).toHaveAttribute("href", "/invoicing/invoices?add=external");
  expect(
    items.find((item) => item.dataset.kind === "external-quote"),
  ).toHaveAttribute("href", "/invoicing/quotes/external");
});

it("names the open count in the Factures link", async () => {
  renderSidebar(4, 0);

  const link = await screen.findByRole("link", { name: /^Factures/ });
  expect(link).toHaveAccessibleName("Factures 4 factures ouvertes");
});

it("closes the phone sheet when the New menu only changes the search", async () => {
  window.innerWidth = 500;
  renderSidebar(0, 0);
  fireEvent.click(await screen.findByTestId("open-mobile"));
  fireEvent.click(await screen.findByTestId("invoicing-new"));
  const items = await screen.findAllByTestId("invoicing-new-item");

  fireEvent.click(items[0] as HTMLElement);

  await waitFor(() =>
    expect(screen.queryByTestId("invoicing-new")).not.toBeInTheDocument(),
  );
  window.innerWidth = 1024;
});
