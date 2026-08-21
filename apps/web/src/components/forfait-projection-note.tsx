import type { EntryRounding, FixedPriceBudgetData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { CircleAlert } from "lucide-react";
import { useMoneyFormat } from "@/components/money-format-provider";
import { valueAsDayFraction } from "@/lib/durations";
import { projectedBudget } from "@/lib/fixed-price-budget";

type ForfaitProjectionNoteProps = {
  budget: FixedPriceBudgetData | null;
  /** The entry being written, before rounding — null while nothing is typed yet. */
  minutes: number | null;
  rounding: EntryRounding | null;
  workdayMinutes: number;
};

/**
 * What the entry being written would do to the forfait it lands on. Projected in the
 * browser on purpose: it describes something that has not been saved, so there is no
 * server figure to ask for.
 */
export function ForfaitProjectionNote({
  budget,
  minutes,
  rounding,
  workdayMinutes,
}: ForfaitProjectionNoteProps) {
  const format = useMoneyFormat();

  if (budget === null || minutes === null) {
    return null;
  }

  const projection = projectedBudget(
    format,
    budget,
    valueAsDayFraction(minutes, rounding, workdayMinutes),
  );

  if (projection === null) {
    return null;
  }

  return (
    <Alert variant={projection.tone}>
      <CircleAlert />
      <AlertDescription>{projection.note}</AlertDescription>
    </Alert>
  );
}
