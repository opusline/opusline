import type { DeadlineBoardData, TimeEntryData } from "@opusline/api-client";
import {
  createTimeEntryMutation,
  deleteTimeEntryMutation,
  listClientsOptions,
  listTimeEntriesOptions,
  listTimeEntriesQueryKey,
  summarizeMonthWorkloadOptions,
  updateTimeEntryMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useTimer } from "@/features/timer/components/timer-provider";
import type { NewEntrySubmit } from "@/features/week/components/new-entry-dialog";
import { WeekPage } from "@/features/week/components/week-page";
import type { NextDeadline } from "@/features/week/components/week-summary-tiles";
import { planWeekRepeat } from "@/features/week/lib/repeat-week";
import { cellKeyFor, type LiveCell } from "@/features/week/lib/week-grid";
import {
  accountTodayCalendarDate,
  browserTodayCalendarDate,
} from "@/lib/dates";
import { deadlinesQueryOptions } from "@/lib/deadlines";
import { isFixedPrice } from "@/lib/durations";
import { findMissionById } from "@/lib/missions";
import {
  invalidateTimeEntries,
  operationFilter,
} from "@/lib/query-invalidation";
import { useMissionBudgets } from "@/lib/use-mission-budgets";
import { serverErrorMessage } from "@/lib/validation";
import { isIsoWeek, isoWeekOf, isoWeekRange, shiftIsoWeek } from "@/lib/weeks";
import { m } from "@/paraglide/messages.js";

type SemaineSearch = { week?: string; weekend?: true };

export const Route = createFileRoute("/_authed/week")({
  validateSearch: (search: Record<string, unknown>): SemaineSearch => ({
    week: isIsoWeek(search.week) ? search.week : undefined,
    weekend:
      search.weekend === true || search.weekend === "true" ? true : undefined,
  }),
  component: SemaineRoute,
});

function writeErrorMessage(error: unknown): string {
  return serverErrorMessage(error, m.common_save_failed());
}

/**
 * What the week tile should show, given the query and whether the French fiscal
 * calendar applies to the account at all.
 */
function resolveNextDeadline(
  hasFrenchFiscality: boolean,
  deadlines: { data: DeadlineBoardData | undefined; isError: boolean },
): NextDeadline {
  if (!hasFrenchFiscality) {
    return "none";
  }

  if (deadlines.data !== undefined) {
    return deadlines.data.next ?? "none";
  }

  return deadlines.isError ? "unavailable" : null;
}

function SemaineRoute() {
  const search = Route.useSearch();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const today = browserTodayCalendarDate();
  const week = search.week ?? isoWeekOf(today);
  const previousWeek = shiftIsoWeek(week, -1);

  const [pendingCellKeys, setPendingCellKeys] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [error, setError] = useState<string | null>(null);
  const [isRepeating, setIsRepeating] = useState(false);

  const {
    isRunning: isTimerRunning,
    openStop,
    startDate: timerStartDate,
    timer,
  } = useTimer();

  const clients = useQuery(listClientsOptions());
  // Only the forfait badges read this, and every grid write invalidates it — so an
  // account with no fixed-price mission never pays for it. A slow or failed fold
  // leaves the grid intact either way: the rows simply carry no consumption pill.
  const budgets = useMissionBudgets(
    clients.data?.clients.some((client) =>
      client.missions.some((mission) => isFixedPrice(mission.billingMode)),
    ) === true,
  );
  const entries = useQuery({
    ...listTimeEntriesOptions({ query: isoWeekRange(week) }),
    placeholderData: keepPreviousData,
  });
  const previousEntries = useQuery({
    ...listTimeEntriesOptions({ query: isoWeekRange(previousWeek) }),
    placeholderData: keepPreviousData,
  });
  // Reads the month the account is in, not the month the browsed week falls in:
  // it is a standing capacity figure, and an ISO week straddling two months has
  // no single month to report anyway. On the account clock rather than `today`'s
  // browser clock because the figure it sits against — jours ouvrés — is a fact
  // about the business, not about where the user happens to be reading from.
  const monthWorkload = useQuery(
    summarizeMonthWorkloadOptions({
      query: { month: accountTodayCalendarDate(user.timezone).slice(0, 7) },
    }),
  );

  // The fiscal calendar only exists for a business established in France, and
  // the week route is not gated the way the fiscal screens are, so the tile is
  // gated by the query's own `enabled`.
  const deadlines = useQuery(deadlinesQueryOptions(user.hasFrenchFiscality));

  // Three-way on the query, not on `next`: a French account that owes nothing
  // answers `next: null`, and collapsing that into the loading state would hide
  // the tile forever instead of saying so.
  const nextDeadline: NextDeadline = resolveNextDeadline(
    user.hasFrenchFiscality,
    deadlines,
  );

  const createEntry = useMutation(createTimeEntryMutation());
  const updateEntry = useMutation(updateTimeEntryMutation());
  const deleteEntry = useMutation(deleteTimeEntryMutation());

  const refreshEntries = (scope: "week" | "all" = "week") =>
    invalidateTimeEntries(
      queryClient,
      scope === "all"
        ? operationFilter("listTimeEntries")
        : { queryKey: listTimeEntriesQueryKey({ query: isoWeekRange(week) }) },
    );

  const runWrite = async (
    cellKey: string,
    write: () => Promise<unknown>,
    scope: "week" | "all" = "week",
  ): Promise<boolean> => {
    setPendingCellKeys((current) => new Set(current).add(cellKey));
    setError(null);

    try {
      await write();

      return true;
    } catch (caught) {
      setError(writeErrorMessage(caught));

      return false;
    } finally {
      await refreshEntries(scope).catch(() => undefined);
      setPendingCellKeys((current) => {
        const next = new Set(current);
        next.delete(cellKey);

        return next;
      });
    }
  };

  const knownEntries = [
    ...(entries.data?.timeEntries ?? []),
    ...(previousEntries.data?.timeEntries ?? []),
  ];
  const knownRange = {
    from: isoWeekRange(previousWeek).from,
    to: isoWeekRange(week).to,
  };

  const findEntry = (entryId: number): TimeEntryData | undefined =>
    knownEntries.find((entry) => entry.id === entryId);

  const handleCreate: React.ComponentProps<typeof WeekPage>["onCreate"] = (
    input,
  ) =>
    runWrite(input.cellKey, () =>
      createEntry.mutateAsync({
        body: {
          date: input.date,
          durationMinutes: input.durationMinutes,
          missionId: input.missionId,
          note: null,
        },
      }),
    );

  const handleUpdate: React.ComponentProps<typeof WeekPage>["onUpdate"] = (
    input,
  ) => {
    const entry = findEntry(input.entryId);

    if (entry === undefined) {
      return Promise.resolve(false);
    }

    return runWrite(input.cellKey, () =>
      updateEntry.mutateAsync({
        body: {
          billable: input.billable ?? entry.billable,
          date: entry.date,
          durationMinutes: input.durationMinutes ?? entry.durationMinutes,
          missionId: entry.missionId,
          note: input.note === undefined ? entry.note : input.note,
        },
        path: { timeEntry: entry.id },
      }),
    );
  };

  const handleDelete: React.ComponentProps<typeof WeekPage>["onDelete"] = (
    input,
  ) =>
    runWrite(input.cellKey, async () => {
      for (const entryId of input.entryIds) {
        await deleteEntry.mutateAsync({ path: { timeEntry: entryId } });
      }
    });

  const handleSubmitNewEntry = async (
    input: NewEntrySubmit,
  ): Promise<boolean> => {
    const cellKey = cellKeyFor(input.missionId, input.date);
    const [replaced, ...alsoReplaced] = input.replaceEntryIds;
    const body = {
      billable: input.billable,
      date: input.date,
      durationMinutes: input.durationMinutes,
      missionId: input.missionId,
      note: input.note,
    };

    const saved = await runWrite(
      cellKey,
      async () => {
        await (replaced === undefined
          ? createEntry.mutateAsync({ body })
          : updateEntry.mutateAsync({ body, path: { timeEntry: replaced } }));

        for (const entryId of alsoReplaced) {
          await deleteEntry.mutateAsync({ path: { timeEntry: entryId } });
        }
      },
      "all",
    );

    if (!saved) {
      return false;
    }

    const targetWeek = isoWeekOf(input.date);

    if (targetWeek !== week) {
      void navigate({
        search: { ...search, week: targetWeek },
        to: "/week",
      });
    }

    return true;
  };

  const handleRepeatPreviousWeek = async () => {
    if (previousEntries.isError) {
      setError(m.week_previous_load_failed());

      return;
    }

    if (previousEntries.isPlaceholderData) {
      setError(m.week_previous_loading());

      return;
    }

    const planned = planWeekRepeat(
      previousEntries.data?.timeEntries ?? [],
      previousWeek,
      week,
    );

    setIsRepeating(true);
    setError(null);

    let copied = 0;
    const failures: unknown[] = [];

    try {
      for (const body of planned) {
        try {
          await createEntry.mutateAsync({ body });
          copied += 1;
        } catch (caught) {
          failures.push(caught);
        }
      }

      await refreshEntries("all").catch(() => undefined);
    } finally {
      setIsRepeating(false);
    }

    if (failures.length > 0) {
      setError(
        m.week_repeat_result({
          copied,
          failed: failures.length,
          message: writeErrorMessage(failures[0]),
        }),
      );

      return;
    }

    if (copied === 0) {
      setError(m.week_repeat_none());
    }
  };

  const isPending = clients.isPending || entries.isPending;
  const isError = clients.isError || entries.isError;

  const liveMission =
    timer === null
      ? null
      : findMissionById(clients.data?.clients ?? [], timer.missionId);

  // The moving labels are derived from the timer clock inside the live pill
  // itself; handing them out from here would re-render the whole screen at
  // 1 Hz for two text nodes.
  const live: LiveCell | null =
    timer === null || liveMission === null
      ? null
      : {
          billingMode: liveMission.billingMode,
          date: timerStartDate ?? today,
          isRunning: isTimerRunning,
          locale: user.locale,
          missionId: timer.missionId,
          onStop: openStop,
          rounding: liveMission.rounding,
          workdayMinutes: user.workdayMinutes,
        };

  return (
    <div className="flex flex-col gap-5">
      {isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{m.week_load_failed()}</AlertDescription>
        </Alert>
      )}
      {clients.data !== undefined && entries.data !== undefined && (
        <WeekPage
          budgets={budgets}
          clients={clients.data.clients}
          error={error}
          isRefreshing={entries.isPlaceholderData}
          isRepeating={isRepeating}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onRepeatPreviousWeek={() => void handleRepeatPreviousWeek()}
          knownEntryRange={knownRange}
          knownEntries={knownEntries}
          live={live}
          monthWorkload={
            monthWorkload.data ?? (monthWorkload.isError ? "unavailable" : null)
          }
          nextDeadline={nextDeadline}
          onSubmitNewEntry={handleSubmitNewEntry}
          onUpdate={handleUpdate}
          onWeekChange={(nextWeek) =>
            void navigate({
              search: { ...search, week: nextWeek },
              to: "/week",
            })
          }
          onWeekendToggle={(open) =>
            void navigate({
              search: { ...search, weekend: open ? true : undefined },
              to: "/week",
            })
          }
          pendingCellKeys={pendingCellKeys}
          previousWeekEntries={previousEntries.data?.timeEntries ?? []}
          timeEntries={entries.data.timeEntries}
          today={today}
          week={week}
          weekendOpen={search.weekend === true}
          workdayMinutes={user.workdayMinutes}
        />
      )}
    </div>
  );
}
