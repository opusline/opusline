import type {
  ClientRevenueData,
  FixedPriceBudgetData,
  FixedPriceBudgetState,
  Locale,
} from "@opusline/api-client";

import {
  daysAtRate,
  formatPercentFromBp,
  formatWholeAmount,
  type MoneyFormat,
  shareBp,
} from "@/lib/billing";
import { indexMissionRevenue } from "@/lib/client-revenue";
import { formatBilledDays, formatWorkedDays } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";

/**
 * The tone a budget figure carries. `brand` while the forfait still has room,
 * `warn` once the time tracked has eaten past it — the same two everywhere, so the
 * banner, the tile, the badge and the « À traiter » row never disagree about how
 * bad a number is.
 */
export type BudgetTone = "brand" | "warn";

export function budgetTone(state: FixedPriceBudgetState): BudgetTone {
  return state === 2 ? "warn" : "brand";
}

/** "126 %" — the figure every consumption surface leads with. */
export function budgetShareLabel(locale: Locale, shareBp: number): string {
  return m.common_percent({ value: budgetShareFigure(locale, shareBp) });
}

export type BudgetAlert = {
  tone: BudgetTone;
  title: string;
  body: string;
};

/**
 * The banner a forfait earns once it is worth interrupting for: how far the tracked
 * time has eaten into the price, and what that leaves. Null while the forfait is
 * still comfortable, or while no reference TJM makes the question answerable.
 */
export function budgetAlert(
  format: MoneyFormat,
  budget: FixedPriceBudgetData,
): BudgetAlert | null {
  const { consumption } = budget;

  if (consumption === null || consumption.state === 0) {
    return null;
  }

  const tracked = formatWorkedDays(format.locale, consumption.trackedDays);

  if (consumption.state === 1) {
    return {
      tone: "brand",
      title: m.missions_budget_warning_title({
        share: budgetShareFigure(format.locale, consumption.consumedShareBp),
      }),
      body: m.missions_budget_warning_body({
        tracked,
        covered: formatWorkedDays(format.locale, consumption.coveredDays),
        remaining: formatWorkedDays(format.locale, consumption.remainingDays),
      }),
    };
  }

  return {
    tone: "warn",
    title: m.missions_budget_exceeded_title({
      amount: formatWholeAmount(format, consumption.overrun.amount),
    }),
    body: m.missions_budget_exceeded_body({
      tracked,
      rate: formatWholeAmount(format, consumption.referenceDailyRate.amount),
      consumed: formatWholeAmount(format, consumption.consumed.amount),
      forfait: formatWholeAmount(format, budget.forfait.amount),
      over: formatWorkedDays(format.locale, -consumption.remainingDays),
    }),
  };
}

/**
 * The tooltip behind a consumption badge, which on its own is a bare percentage.
 */
export function budgetShareTitle(
  locale: Locale,
  budget: FixedPriceBudgetData,
): string | null {
  const { consumption } = budget;

  return consumption === null
    ? null
    : m.missions_budget_share_title({
        tracked: formatWorkedDays(locale, consumption.trackedDays),
        covered: formatWorkedDays(locale, consumption.coveredDays),
      });
}

export type BudgetProjection = {
  tone: BudgetTone;
  note: string;
};

/**
 * What one more entry of `addedDays` would do to the forfait, so a dialog can say it
 * before the entry is saved. The stored figures still come from the API; this only
 * projects the day being typed on top of them.
 */
export function projectedBudget(
  format: MoneyFormat,
  budget: FixedPriceBudgetData,
  addedDays: number,
): BudgetProjection | null {
  const { consumption } = budget;

  if (consumption === null) {
    return null;
  }

  const forfaitCents = budget.forfait.amount;
  const consumedCents =
    consumption.consumed.amount +
    daysAtRate(consumption.referenceDailyRate.amount, addedDays);
  const projectedShareBp = shareBp(consumedCents, forfaitCents);

  if (consumedCents <= forfaitCents) {
    return {
      tone: "brand",
      note: m.week_forfait_projection({
        entry: formatBilledDays(format.locale, addedDays),
        share: budgetShareFigure(format.locale, projectedShareBp),
        consumed: formatWholeAmount(format, consumedCents),
        forfait: formatWholeAmount(format, forfaitCents),
      }),
    };
  }

  return {
    tone: "warn",
    note: m.week_forfait_over_projection({
      share: budgetShareFigure(format.locale, projectedShareBp),
      tracked: formatWorkedDays(
        format.locale,
        consumption.trackedDays + addedDays,
      ),
      over: formatWorkedDays(
        format.locale,
        addedDays - consumption.remainingDays,
      ),
    }),
  };
}

/**
 * The bare figure a "%" is glued to, for the messages that carry the sign themselves
 * ("Forfait consommé à {share} %"). Whole percents: a budget is read, not reconciled.
 */
export function budgetShareFigure(locale: Locale, shareBp: number): string {
  return formatPercentFromBp(locale, shareBp, 0, 0);
}

/**
 * The account's forfait budgets, keyed by mission id, from the revenue listing —
 * the one payload that already carries every mission's figures.
 */
export function indexMissionBudgets(
  clients: ClientRevenueData[] | undefined,
): Map<number, FixedPriceBudgetData> {
  const budgets = new Map<number, FixedPriceBudgetData>();

  for (const [missionId, revenue] of indexMissionRevenue(clients)) {
    if (revenue.fixedPrice != null) {
      budgets.set(missionId, revenue.fixedPrice);
    }
  }

  return budgets;
}
