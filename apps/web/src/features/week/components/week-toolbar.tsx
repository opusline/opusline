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

const WEEKEND_LOCK_REASON =
  "Le week-end reste ouvert : il contient des entrées cette semaine.";

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
          aria-label="Semaine précédente"
          onClick={() => onWeekChange(shiftIsoWeek(week, -1))}
          size="icon-lg"
          title="Semaine précédente"
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
          aria-label="Semaine suivante"
          onClick={() => onWeekChange(shiftIsoWeek(week, 1))}
          size="icon-lg"
          title="Semaine suivante"
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
          title={isWeekendLocked ? WEEKEND_LOCK_REASON : undefined}
          variant="outline"
        >
          {weekendToggleLabel(weekendShown)}
        </Button>
        {isWeekendLocked && (
          <span className="sr-only" id={weekendLockId}>
            {WEEKEND_LOCK_REASON}
          </span>
        )}
        <Button aria-keyshortcuts="n" onClick={onNewEntry} size="xl">
          <PlusIcon aria-hidden data-icon="inline-start" strokeWidth={2.2} />
          Nouvelle entrée
          <Kbd>N</Kbd>
        </Button>
      </div>
    </div>
  );
}
