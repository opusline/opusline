import type { FixedPriceBudgetData } from "@opusline/api-client";
import { listClientRevenueOptions } from "@opusline/api-client/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { indexMissionBudgets } from "@/lib/fixed-price-budget";

/**
 * The account's forfait budgets, keyed by mission id.
 *
 * Behind a hook because the Map keys memoised render work — a fresh one per render
 * rebuilds the week grid on every timer tick — and because the fold behind it is the
 * heaviest read in the app: `enabled` is not optional at a call site, it is the point.
 */
export function useMissionBudgets(
  enabled: boolean,
): Map<number, FixedPriceBudgetData> {
  const { data } = useQuery({ ...listClientRevenueOptions(), enabled });

  return useMemo(() => indexMissionBudgets(data?.clients), [data]);
}
