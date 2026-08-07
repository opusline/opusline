import { Button } from "@opusline/ui/components/button";
import { Kbd } from "@opusline/ui/components/kbd";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from "lucide-react";

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

export function WeekToolbar({
  week,
  today,
  weekendShown,
  isWeekendLocked,
  onWeekChange,
  onWeekendToggle,
  onNewEntry,
}: WeekToolbarProps) {
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
            {isoWeekRangeLabel(week)}
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
        <Button
          disabled={isWeekendLocked}
          onClick={onWeekendToggle}
          size="xl"
          title={
            isWeekendLocked
              ? "Le week-end reste ouvert : il contient des entrées cette semaine."
              : undefined
          }
          variant="outline"
        >
          {weekendToggleLabel(weekendShown)}
        </Button>
        <Button aria-keyshortcuts="n" onClick={onNewEntry} size="xl">
          <PlusIcon aria-hidden data-icon="inline-start" strokeWidth={2.2} />
          Nouvelle entrée
          <Kbd>N</Kbd>
        </Button>
      </div>
    </div>
  );
}
