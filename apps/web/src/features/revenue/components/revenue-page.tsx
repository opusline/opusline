import type { InvoiceSummaryData, RevenueData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";

import { useLocale } from "@/components/money-format-provider";
import { periodTitle } from "@/lib/periods";

import { type RevenueBasisKey, revenueBasisKey } from "../lib/labels";
import { RevenueBreakdown } from "./revenue-breakdown";
import { RevenueChart } from "./revenue-chart";
import { RevenueHeader } from "./revenue-header";
import { RevenueInvoicesCard } from "./revenue-invoices-card";
import { RevenueKpiCards } from "./revenue-kpi-cards";
import { RevenueUnbilledCallout } from "./revenue-unbilled-callout";

type RevenuePageProps = {
  data: RevenueData;
  /** The invoice summary feeding the unbilled callout; absent while it loads. */
  summary: InvoiceSummaryData | undefined;
  accountToday: string;
  isRefreshing: boolean;
  /**
   * The URL's period and basis — what the controls reflect and compute from.
   * They run ahead of `data`, which keepPreviousData keeps stale while a fetch
   * is in flight: arrows computed from the echo would repeat the same step.
   */
  requestedPeriod: string;
  requestedBasis: RevenueBasisKey;
  onPeriodChange: (period: string) => void;
  onBasisChange: (basis: RevenueBasisKey) => void;
  onOpenInvoice: (invoiceId: number) => void;
  onGoToInvoices: () => void;
};

export function RevenuePage({
  data,
  summary,
  accountToday,
  isRefreshing,
  requestedPeriod,
  requestedBasis,
  onPeriodChange,
  onBasisChange,
  onOpenInvoice,
  onGoToInvoices,
}: RevenuePageProps) {
  const locale = useLocale();
  const basis = revenueBasisKey(data.basis);
  const periodLabel = periodTitle(locale, data.period);

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 transition-opacity",
        isRefreshing && "opacity-60",
      )}
    >
      <RevenueHeader
        accountToday={accountToday}
        basis={requestedBasis}
        fellBack={data.fellBack}
        onBasisChange={onBasisChange}
        onPeriodChange={onPeriodChange}
        period={requestedPeriod}
      />

      <RevenueKpiCards basis={basis} data={data} />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-3.5">
        <RevenueChart
          accountToday={accountToday}
          basis={basis}
          months={data.months}
          onSelectMonth={onPeriodChange}
        />
        <div className="flex flex-col gap-3.5">
          {summary !== undefined && (
            <RevenueUnbilledCallout
              onGoToInvoices={onGoToInvoices}
              summary={summary}
            />
          )}
          <RevenueInvoicesCard
            basis={basis}
            invoices={data.invoices}
            onOpenInvoice={onOpenInvoice}
            periodTitle={periodLabel}
          />
        </div>
      </div>

      <RevenueBreakdown
        basis={basis}
        clients={data.clients}
        invoices={data.invoices}
        lastActivePeriod={data.lastActivePeriod}
        onOpenInvoice={onOpenInvoice}
        onShowPeriod={onPeriodChange}
        periodLabel={periodLabel}
      />
    </div>
  );
}
