import { showInvoiceSummaryQueryKey } from "@opusline/api-client/react-query";
import { SidebarProvider } from "@opusline/ui/components/sidebar";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { seedCurrentUser } from "@/test/current-user";
import { eur, invoiceSummary } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { InvoicingSidebar } from "./invoicing-sidebar";

function Example({ open, late }: { open?: number; late?: number }) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: Infinity } },
    });

    seedCurrentUser(client, { name: "Théo Marchand" });

    if (open !== undefined) {
      client.setQueryData(
        showInvoiceSummaryQueryKey(),
        invoiceSummary({
          toCollect: { amount: eur(1_874_400), count: open },
          overdue: { amount: eur(122_400), count: late ?? 0, maxDaysLate: 41 },
        }),
      );
    }

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <StoryRouter>
        <SidebarProvider>
          <InvoicingSidebar />
        </SidebarProvider>
      </StoryRouter>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/InvoicingSidebar",
  component: InvoicingSidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof InvoicingSidebar>;

export default meta;
type Story = StoryObj<typeof InvoicingSidebar>;

export const Default: Story = {
  render: () => <Example late={1} open={4} />,
};

export const NothingToCollect: Story = {
  render: () => <Example late={0} open={0} />,
};

/** Until the summary arrives, the tile shows a dash rather than a zero. */
export const Loading: Story = {
  render: () => <Example />,
};
