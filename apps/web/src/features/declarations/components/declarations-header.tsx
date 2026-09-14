import { PeriodNavigator } from "@opusline/ui/components/period-navigator";

import { useLocale } from "@/components/money-format-provider";
import { calendarMonthYearLabel } from "@/lib/dates";
import { monthStart } from "@/lib/months";
import { m } from "@/paraglide/messages.js";

type DeclarationsHeaderProps = {
  /** `YYYY-MM`. */
  period: string;
  onPeriodChange: (period: string) => void;
  previousPeriod: string;
  nextPeriod: string | null;
};

export function DeclarationsHeader({
  period,
  onPeriodChange,
  previousPeriod,
  nextPeriod,
}: DeclarationsHeaderProps) {
  const locale = useLocale();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi leading-tight">
          {m.declarations_title()}
        </h1>
        <p className="mt-1 text-muted-foreground-3 text-sm">
          {m.declarations_intro()}
        </p>
      </div>
      <PeriodNavigator
        isNextDisabled={nextPeriod === null}
        label={calendarMonthYearLabel(locale, monthStart(period))}
        nextLabel={m.common_next_period()}
        onNext={() => {
          if (nextPeriod !== null) {
            onPeriodChange(nextPeriod);
          }
        }}
        onPrevious={() => onPeriodChange(previousPeriod)}
        previousLabel={m.common_previous_period()}
      />
    </div>
  );
}
