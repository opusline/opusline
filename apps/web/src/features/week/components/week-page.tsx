import type {
  ClientWithMissionsData,
  TimeEntryData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { cn } from "@opusline/ui/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useMoneyFormat } from "@/components/money-format-provider";
import { collectNoteSuggestions } from "@/components/note-suggestions";
import { isoWeekDates } from "@/lib/weeks";
import type { PillSkin } from "../lib/pill-skins";
import {
  buildWeekGrid,
  type LiveCell,
  shouldShowWeekend,
} from "../lib/week-grid";
import { summarizeWeekBillable } from "../lib/week-money";
import { NewEntryDialog, type NewEntrySubmit } from "./new-entry-dialog";
import { WeekBillableTile } from "./week-billable-tile";
import { WeekEmptyBanner } from "./week-empty-banner";
import { WeekGrid, type WeekGridProps } from "./week-grid";
import { WEEK_SKINS, WeekLegend } from "./week-legend";

const LIVE_SKINS: PillSkin[] = [...WEEK_SKINS, "live"];

import { WeekMissionsEmptyState } from "./week-missions-empty-state";
import { WeekToolbar } from "./week-toolbar";

export type WeekPageProps = {
  live: LiveCell | null;
  clients: ClientWithMissionsData[];
  timeEntries: TimeEntryData[];
  previousWeekEntries: TimeEntryData[];
  week: string;
  /** `Y-m-d`, passed in rather than read from the clock so stories stay fixed. */
  today: string;
  workdayMinutes: number;
  weekendOpen: boolean;
  isRefreshing: boolean;
  isRepeating: boolean;
  error: string | null;
  pendingCellKeys: ReadonlySet<string>;
  onWeekChange: (week: string) => void;
  onWeekendToggle: (open: boolean) => void;
  onRepeatPreviousWeek: () => void;
  onCreate: WeekGridProps["onCreate"];
  onUpdate: WeekGridProps["onUpdate"];
  onDelete: WeekGridProps["onDelete"];
  /** Resolves to whether the entry was saved; a rejected one keeps the dialog
      open with everything the user typed still in it. */
  onSubmitNewEntry: (input: NewEntrySubmit) => Promise<boolean>;
  /** Entries across every loaded week, and the range they cover. */
  knownEntries: TimeEntryData[];
  knownEntryRange: { from: string; to: string };
};

/** The notes already used this week — enough of a vocabulary to type less. */
function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
  );
}

export function WeekPage({
  clients,
  timeEntries,
  previousWeekEntries,
  week,
  today,
  live,
  workdayMinutes,
  weekendOpen,
  isRefreshing,
  isRepeating,
  error,
  pendingCellKeys,
  onWeekChange,
  onWeekendToggle,
  onRepeatPreviousWeek,
  onCreate,
  onUpdate,
  onDelete,
  onSubmitNewEntry,
  knownEntries,
  knownEntryRange,
}: WeekPageProps) {
  const format = useMoneyFormat();
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  const liveHere =
    live !== null && isoWeekDates(week).includes(live.date) ? live : null;

  const weekendShown = shouldShowWeekend(
    weekendOpen,
    week,
    timeEntries,
    liveHere?.date ?? null,
  );
  const model = useMemo(
    () =>
      buildWeekGrid({
        clients,
        format,
        liveMissionId: liveHere?.missionId ?? null,
        timeEntries,
        today,
        week,
        weekendShown,
      }),
    [
      clients,
      format,
      liveHere?.missionId,
      timeEntries,
      today,
      week,
      weekendShown,
    ],
  );
  const noteSuggestions = useMemo(
    () => collectNoteSuggestions(timeEntries),
    [timeEntries],
  );
  const billable = useMemo(
    () => summarizeWeekBillable(clients, timeEntries),
    [clients, timeEntries],
  );

  useEffect(() => {
    const startNewEntry = (event: KeyboardEvent) => {
      if (
        event.key !== "n" ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.defaultPrevented ||
        isTypingTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      setIsNewEntryOpen(true);
    };

    window.addEventListener("keydown", startNewEntry);

    return () => window.removeEventListener("keydown", startNewEntry);
  }, []);

  if (model.rows.length === 0 && !model.hasEntries) {
    return (
      <div className="flex flex-col gap-5">
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          Semaine
        </h1>
        <WeekMissionsEmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <WeekToolbar
        isWeekendLocked={weekendShown && !weekendOpen}
        onNewEntry={() => setIsNewEntryOpen(true)}
        onWeekChange={onWeekChange}
        onWeekendToggle={() => onWeekendToggle(!weekendOpen)}
        today={today}
        week={week}
        weekendShown={weekendShown}
      />
      {error !== null && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!model.hasEntries && previousWeekEntries.length > 0 && (
        <WeekEmptyBanner
          isRepeating={isRepeating}
          onRepeat={onRepeatPreviousWeek}
          previousWeekEntryCount={previousWeekEntries.length}
        />
      )}
      <div
        className={cn(
          "transition-opacity",
          isRefreshing && "pointer-events-none opacity-60",
        )}
        // `pointer-events-none` only stops the mouse; the grid owns keyboard
        // handlers and a tab stop that must go quiet too while the week lands.
        inert={isRefreshing}
      >
        <WeekGrid
          live={liveHere}
          model={model}
          noteSuggestions={noteSuggestions}
          onCreate={onCreate}
          onDelete={onDelete}
          onUpdate={onUpdate}
          pendingCellKeys={pendingCellKeys}
          workdayMinutes={workdayMinutes}
        />
      </div>
      <WeekLegend skins={liveHere === null ? WEEK_SKINS : LIVE_SKINS} />
      <WeekBillableTile summary={billable} />
      <NewEntryDialog
        isSaving={pendingCellKeys.size > 0}
        knownRange={knownEntryRange}
        missionOptions={model.missionOptions}
        noteSuggestions={noteSuggestions}
        onOpenChange={setIsNewEntryOpen}
        onSubmit={async (input) => {
          const saved = await onSubmitNewEntry(input);

          if (saved) {
            setIsNewEntryOpen(false);
          }

          return saved;
        }}
        open={isNewEntryOpen}
        timeEntries={knownEntries}
        today={today}
        workdayMinutes={workdayMinutes}
      />
    </div>
  );
}
