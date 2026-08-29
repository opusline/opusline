import {
  listInvoicesInfiniteQueryKey,
  showInvoiceOptions,
} from "@opusline/api-client/react-query";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { StoryRouter } from "@/test/story-router";

import { invoiceDetail, invoiceItem } from "../lib/fixtures";
import { InvoiceDrawerProvider } from "./invoice-drawer-provider";
import { InvoiceListTab } from "./invoice-list-tab";

const CLIENT_QUERY = { clientId: 1 };

/** Seeds the cache the tab reads, so the story needs no network. */
function Example({ invoices }: { invoices: ReturnType<typeof invoiceItem>[] }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    // The tab reads an infinite query, so the seed must be InfiniteData under
    // the infinite variant of the key.
    client.setQueryData(listInvoicesInfiniteQueryKey({ query: CLIENT_QUERY }), {
      pages: [{ invoices, clientTotals: [], nextCursor: null }],
      pageParams: [{}],
    });

    // The fiche each row opens, so picking one resolves from the cache and the
    // story needs no request handler.
    for (const { invoice } of invoices) {
      client.setQueryData(
        showInvoiceOptions({ path: { invoice: invoice.id } }).queryKey,
        invoiceDetail(invoice),
      );
    }

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <StoryRouter>
        <InvoiceDrawerProvider timezone="Europe/Paris">
          <InvoiceListTab
            accountToday="2026-08-14"
            emptyHint="Les factures apparaîtront ici dès que du temps facturable aura été saisi sur une mission de ce client."
            query={CLIENT_QUERY}
            withMission
          />
        </InvoiceDrawerProvider>
      </StoryRouter>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/InvoiceListTab",
  component: InvoiceListTab,
  tags: ["autodocs"],
} satisfies Meta<typeof InvoiceListTab>;

export default meta;
type Story = StoryObj<typeof InvoiceListTab>;

/** Picking a row opens the fiche the provider owns, over the page. */
export const Default: Story = {
  render: () => (
    <Example
      invoices={[
        invoiceItem({ periodStart: "2026-07-01", periodEnd: "2026-07-31" }),
        invoiceItem({
          id: 2,
          number: "2026-012",
          isLate: true,
          dueOn: "2026-06-30",
          amountTtc: { amount: 96_000, currency: "EUR" },
        }),
      ]}
    />
  ),
};

export const Empty: Story = {
  render: () => <Example invoices={[]} />,
};
