import type { SubscriptionsData } from "@opusline/api-client";
import { Toaster, ToastProvider } from "@opusline/ui/components/toast";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { StoryRouter } from "@/test/story-router";

import { emptySubscriptionDraft } from "../lib/subscription-draft";
import {
  emptySubscriptionsData,
  SUBSCRIPTIONS_TODAY,
  subscriptionsData,
} from "../lib/subscription-fixtures";
import type { SubscriptionSheetState } from "./subscription-sheet";
import { SubscriptionsPanel } from "./subscriptions-panel";

type ExampleProps = {
  data: SubscriptionsData;
  isVatLiable?: boolean;
  showCancelled?: boolean;
  initialSheet?: SubscriptionSheetState | null;
};

/**
 * The panel owns its writes, so it needs a query client and the toast host the
 * authed layout normally mounts. The sheet is route state in the app, so the
 * story holds it the same way the route does.
 */
function Example({
  data,
  isVatLiable = true,
  showCancelled = false,
  initialSheet = null,
}: ExampleProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } },
      }),
  );
  const [sheet, setSheet] = useState<SubscriptionSheetState | null>(
    initialSheet,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <StoryRouter>
          <SubscriptionsPanel
            data={data}
            isRefreshing={false}
            isVatLiable={isVatLiable}
            onSheetChange={setSheet}
            sheet={sheet}
            showCancelled={showCancelled}
            today={SUBSCRIPTIONS_TODAY}
          />
        </StoryRouter>
        <Toaster closeLabel="Fermer" />
      </ToastProvider>
    </QueryClientProvider>
  );
}

const meta = {
  title: "Web/Expenses/SubscriptionsPanel",
  component: Example,
  tags: ["autodocs"],
  args: { data: subscriptionsData() },
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof Example>;

/** Five rows, a missing receipt on one strip, and a detected debit to adopt. */
export const Default: Story = {};

/** Cancelled rows are kept out until they are asked for. */
export const WithCancelled: Story = {
  args: { showCancelled: true },
};

/**
 * Franchise en base: no TVA anywhere, so the recoverable and reverse-charged
 * figures have nothing to report.
 */
export const NotVatLiable: Story = {
  args: { isVatLiable: false },
};

/** Nothing recorded yet — the first thing a new account sees on the tab. */
export const Empty: Story = {
  args: { data: emptySubscriptionsData() },
};

/** The sheet opened from the page header, on a blank draft. */
export const CreatingASubscription: Story = {
  args: {
    initialSheet: {
      mode: "create",
      initial: emptySubscriptionDraft(SUBSCRIPTIONS_TODAY),
    },
  },
};
