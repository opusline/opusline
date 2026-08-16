import {
  showInvoiceOptions,
  showInvoiceSummaryOptions,
  showRevenueOptions,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { InvoiceDrawer } from "@/features/invoices/components/invoice-drawer";
import { RevenuePage } from "@/features/revenue/components/revenue-page";
import {
  REVENUE_BASIS_VALUES,
  type RevenueBasisKey,
} from "@/features/revenue/lib/labels";
import { accountTodayCalendarDate } from "@/lib/dates";
import { requireFrenchFiscality } from "@/lib/fiscality";
import { isPeriod } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

type RevenusSearch = { period?: string; basis?: "collected" };

export const Route = createFileRoute("/_authed/revenue")({
  validateSearch: (search: Record<string, unknown>): RevenusSearch => ({
    period: isPeriod(search.period) ? search.period : undefined,
    basis: search.basis === "collected" ? "collected" : undefined,
  }),
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: RevenusRoute,
});

function RevenusRoute() {
  const search = Route.useSearch();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  const basis: RevenueBasisKey = search.basis ?? "invoiced";

  // A bare URL deliberately sends no period: the server then falls back to the
  // last active period when the current month is empty, and `fellBack` explains
  // it. Defaulting the search param here would silently kill that behavior.
  const revenue = useQuery({
    ...showRevenueOptions({
      query: { period: search.period, basis: REVENUE_BASIS_VALUES[basis] },
    }),
    placeholderData: keepPreviousData,
  });

  const summary = useQuery(showInvoiceSummaryOptions());

  const [openInvoiceId, setOpenInvoiceId] = useState<number | null>(null);
  const detail = useQuery({
    ...showInvoiceOptions({ path: { invoice: openInvoiceId ?? 0 } }),
    enabled: openInvoiceId !== null,
  });

  const showPeriod = (period: string) => {
    navigate({ to: "/revenue", search: { ...search, period } });
  };

  const showBasis = (nextBasis: RevenueBasisKey) => {
    navigate({
      to: "/revenue",
      search: {
        // Each basis would fall back to its own last active period, so an
        // unpinned toggle could silently change the month under the figures.
        // Whatever is on screen is what the other basis must be read against.
        period: search.period ?? revenue.data?.period,
        basis: nextBasis === "collected" ? "collected" : undefined,
      },
    });
  };

  const detailFailed = openInvoiceId !== null && detail.isError;

  if (revenue.isPending) {
    return (
      <div className="flex flex-col gap-3.5">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (revenue.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.revenue_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* A failed refetch keeps the last good figures on screen — the arrows
          and toggles are the way back, so they must survive the error. */}
      {revenue.isError && (
        <Alert variant="destructive">
          <AlertDescription>{m.revenue_load_failed()}</AlertDescription>
        </Alert>
      )}
      {summary.isError && (
        <Alert variant="destructive">
          <AlertDescription>{m.invoices_load_failed()}</AlertDescription>
        </Alert>
      )}
      {detailFailed && (
        <Alert variant="destructive">
          <AlertDescription>{m.revenue_invoice_open_failed()}</AlertDescription>
        </Alert>
      )}

      <RevenuePage
        accountToday={accountTodayCalendarDate(user.timezone)}
        data={revenue.data}
        isRefreshing={revenue.isPlaceholderData}
        onBasisChange={showBasis}
        onGoToInvoices={() => navigate({ to: "/invoices" })}
        onOpenInvoice={setOpenInvoiceId}
        onPeriodChange={showPeriod}
        requestedBasis={basis}
        requestedPeriod={search.period ?? revenue.data.period}
        summary={summary.data}
      />

      {/* The fiche opens over the figures; acting on an invoice (payment,
          reminder…) stays on the Factures screen. */}
      <InvoiceDrawer
        detail={detail.data}
        actions={null}
        open={openInvoiceId !== null && !detail.isError}
        onOpenChange={(open) => {
          if (!open) {
            setOpenInvoiceId(null);
          }
        }}
      />
    </div>
  );
}
