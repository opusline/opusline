import type { Locale, RevenueBasis } from "@opusline/api-client";

import { cachedFormatter, formatPercentFromBp } from "@/lib/billing";
import type { PeriodKind } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

/** The URL's readable spelling of the API's int-backed basis. */
export type RevenueBasisKey = "invoiced" | "collected";

export const REVENUE_BASIS_VALUES: Record<RevenueBasisKey, RevenueBasis> = {
  invoiced: 0,
  collected: 1,
};

const BASIS_KEYS: Record<RevenueBasis, RevenueBasisKey> = {
  0: "invoiced",
  1: "collected",
};

export function revenueBasisKey(basis: RevenueBasis): RevenueBasisKey {
  return BASIS_KEYS[basis];
}

/**
 * Every basis-dependent string of the screen, grouped per basis the way
 * `VAT_REGIME_MESSAGES` groups its texts — message references, called at
 * render time.
 */
const BASIS_TEXT: Record<
  RevenueBasisKey,
  {
    label: () => string;
    subtitle: () => string;
    fallbackSubtitle: () => string;
    kpiTitle: () => string;
    kpiZero: () => string;
    chartTitle: () => string;
    invoicesTitle: () => string;
    invoicesEmpty: (params: { period: string }) => string;
    rowDate: (params: { date: string }) => string;
    emptyTitle: (params: { period: string }) => string;
    emptyBody: () => string;
  }
> = {
  invoiced: {
    label: m.revenue_basis_invoiced,
    subtitle: m.revenue_subtitle_invoiced,
    fallbackSubtitle: m.revenue_subtitle_fallback_invoiced,
    kpiTitle: m.revenue_kpi_invoiced_title,
    kpiZero: m.revenue_kpi_zero_invoiced,
    chartTitle: m.revenue_chart_title_invoiced,
    invoicesTitle: m.revenue_invoices_title_invoiced,
    invoicesEmpty: m.revenue_invoices_empty_invoiced,
    rowDate: m.revenue_row_issued,
    emptyTitle: m.revenue_empty_title_invoiced,
    emptyBody: m.revenue_empty_body_invoiced,
  },
  collected: {
    label: m.revenue_basis_collected,
    subtitle: m.revenue_subtitle_collected,
    fallbackSubtitle: m.revenue_subtitle_fallback_collected,
    kpiTitle: m.revenue_kpi_collected_title,
    kpiZero: m.revenue_kpi_zero_collected,
    chartTitle: m.revenue_chart_title_collected,
    invoicesTitle: m.revenue_invoices_title_collected,
    invoicesEmpty: m.revenue_invoices_empty_collected,
    rowDate: m.revenue_row_collected,
    emptyTitle: m.revenue_empty_title_collected,
    emptyBody: m.revenue_empty_body_collected,
  },
};

export function basisText(basis: RevenueBasisKey) {
  return BASIS_TEXT[basis];
}

export function revenueSubtitle(
  basis: RevenueBasisKey,
  fellBack: boolean,
): string {
  const text = BASIS_TEXT[basis];

  return fellBack ? text.fallbackSubtitle() : text.subtitle();
}

const PERIOD_KIND_MESSAGES: Record<PeriodKind, () => string> = {
  month: m.revenue_period_month,
  quarter: m.revenue_period_quarter,
  year: m.revenue_period_year,
};

export function periodKindLabel(kind: PeriodKind): string {
  return PERIOD_KIND_MESSAGES[kind]();
}

const TREND_NONE_MESSAGES: Record<PeriodKind, () => string> = {
  month: m.revenue_trend_none_month,
  quarter: m.revenue_trend_none_quarter,
  year: m.revenue_trend_none_year,
};

export function revenueTrendNoneLabel(kind: PeriodKind): string {
  return TREND_NONE_MESSAGES[kind]();
}

/**
 * "11,4" — a bar's label in thousands. Presentation scaling of one server
 * figure, like `formatWholeAmount`'s cents-to-units division; never a sum.
 */
export function thousandsLabel(locale: Locale, amountCents: number): string {
  return cachedFormatter(locale, { maximumFractionDigits: 1 }).format(
    amountCents / 100_000,
  );
}

/** "92 %" — a client's share, rounded: the column is scanned, not reconciled. */
export function shareLabel(locale: Locale, shareBp: number): string {
  return m.common_percent({
    value: formatPercentFromBp(locale, shareBp, 0, 0),
  });
}

/** "-3" or "+12" — the signed percent beside the trend arrow. */
export function trendDeltaLabel(locale: Locale, changeBp: number): string {
  return cachedFormatter(locale, {
    maximumFractionDigits: 0,
    signDisplay: "exceptZero",
  }).format(changeBp / 100);
}
