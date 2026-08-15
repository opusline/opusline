import { Button } from "@opusline/ui/components/button";
import { Kbd } from "@opusline/ui/components/kbd";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";
import { useId } from "react";
import { useLocale } from "@/components/money-format-provider";
import {
  isoWeekOf,
  isoWeekRangeLabel,
  isoWeekTitle,
  shiftIsoWeek,
} from "@/lib/weeks";
import { m } from "@/paraglide/messages.js";
import { weekendToggleLabel } from "../lib/labels";

type WeekToolbarProps = {
  week: string;
  /** `Y-m-d`, passed in rather than read from the clock so stories stay fixed. */
  today: string;
  weekendShown: boolean;
  /** The weekend is open because it holds entries, so it cannot be hidden. */
  isWeekendLocked: boolean;
  onWeekChange: (week: string) => void;
  onWeekendToggle: () => void;
  onNewEntry: () => void;
};

export function WeekToolbar({
  week,
  today,
  weekendShown,
  isWeekendLocked,
  onWeekChange,
  onWeekendToggle,
  onNewEntry,
}: WeekToolbarProps) {
  const weekendLockId = useId();
  const locale = useLocale();

  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          aria-label={m.week_previous()}
          onClick={() => onWeekChange(shiftIsoWeek(week, -1))}
          size="icon-lg"
          title={m.week_previous()}
          variant="outline"
        >
          <ChevronLeftIcon aria-hidden />
        </Button>
        <h1 className="whitespace-nowrap font-heading font-semibold text-2xl text-foreground-hi leading-tight">
          {isoWeekTitle(week)}{" "}
          <span aria-hidden className="font-normal text-muted-foreground-5">
            ·
          </span>{" "}
          <span className="whitespace-nowrap font-normal text-foreground-3 text-xl">
            {isoWeekRangeLabel(locale, week)}
          </span>
        </h1>
        <Button
          aria-label={m.week_next()}
          onClick={() => onWeekChange(shiftIsoWeek(week, 1))}
          size="icon-lg"
          title={m.week_next()}
          variant="outline"
        >
          <ChevronRightIcon aria-hidden />
        </Button>
        <Button
          disabled={week === isoWeekOf(today)}
          onClick={() => onWeekChange(isoWeekOf(today))}
          variant="outline"
        >
          Aujourd'hui
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {/* Locked rather than removed: a button nobody can reach is a button
            nobody can ask about, so it stays focusable and says why. */}
        <Button
          aria-describedby={isWeekendLocked ? weekendLockId : undefined}
          disabled={isWeekendLocked}
          focusableWhenDisabled
          onClick={onWeekendToggle}
          size="xl"
          title={isWeekendLocked ? m.week_weekend_lock_reason() : undefined}
          variant="outline"
        >
          {weekendToggleLabel(weekendShown)}
        </Button>
        {isWeekendLocked && (
          <span className="sr-only" id={weekendLockId}>
            {m.week_weekend_lock_reason()}
          </span>
        )}
        <Button aria-keyshortcuts="n" onClick={onNewEntry} size="xl">
          <PlusIcon aria-hidden data-icon="inline-start" strokeWidth={2.2} />
          {m.week_new_entry()}
          <Kbd>N</Kbd>
        </Button>
      </div>
    </div>
  );
}
