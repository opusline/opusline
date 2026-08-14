import type { TimeEntryData } from "@opusline/api-client";
import {
  createTimeEntryMutation,
  deleteTimeEntryMutation,
  listClientsOptions,
  listTimeEntriesOptions,
  listTimeEntriesQueryKey,
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
import { formatClock } from "@/features/timer/lib/elapsed";
import { findMissionById } from "@/features/timer/lib/mission-options";
import type { NewEntrySubmit } from "@/features/week/components/new-entry-dialog";
import { WeekPage } from "@/features/week/components/week-page";
import { planWeekRepeat } from "@/features/week/lib/repeat-week";
import { cellKeyFor, type LiveCell } from "@/features/week/lib/week-grid";
import { todayCalendarDate } from "@/lib/dates";
import { provisionalBilledLabel } from "@/lib/durations";
import { serverErrorMessage } from "@/lib/validation";
import { isIsoWeek, isoWeekOf, isoWeekRange, shiftIsoWeek } from "@/lib/weeks";

type SemaineSearch = { week?: string; weekend?: true };

export const Route = createFileRoute("/_authed/semaine")({
  validateSearch: (search: Record<string, unknown>): SemaineSearch => ({
    week: isIsoWeek(search.week) ? search.week : undefined,
    weekend:
      search.weekend === true || search.weekend === "true" ? true : undefined,
  }),
  component: SemaineRoute,
});

const WRITE_FAILED = "L'enregistrement a échoué. Réessayez dans un instant.";

function writeErrorMessage(error: unknown): string {
  return serverErrorMessage(error, WRITE_FAILED);
}

function SemaineRoute() {
  const search = Route.useSearch();
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const today = todayCalendarDate();
  const week = search.week ?? isoWeekOf(today);
  const previousWeek = shiftIsoWeek(week, -1);

  const [pendingCellKeys, setPendingCellKeys] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const [error, setError] = useState<string | null>(null);
  const [isRepeating, setIsRepeating] = useState(false);

  const {
    elapsedSeconds,
    isRunning: isTimerRunning,
    openStop,
    startDate: timerStartDate,
    timer,
  } = useTimer();

  const clients = useQuery(listClientsOptions());
  const entries = useQuery({
    ...listTimeEntriesOptions({ query: isoWeekRange(week) }),
    placeholderData: keepPreviousData,
  });
  const previousEntries = useQuery({
    ...listTimeEntriesOptions({ query: isoWeekRange(previousWeek) }),
    placeholderData: keepPreviousData,
  });

  const createEntry = useMutation(createTimeEntryMutation());
  const updateEntry = useMutation(updateTimeEntryMutation());
  const deleteEntry = useMutation(deleteTimeEntryMutation());

  const refreshEntries = (scope: "week" | "all" = "week") =>
    queryClient.invalidateQueries({
      queryKey:
        scope === "all"
          ? [{ _id: "listTimeEntries" }]
          : listTimeEntriesQueryKey({ query: isoWeekRange(week) }),
    });

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
        to: "/semaine",
      });
    }

    return true;
  };

  const handleRepeatPreviousWeek = async () => {
    if (previousEntries.isError) {
      setError(
        "La semaine précédente n'a pas pu être chargée. Réessayez dans un instant.",
      );

      return;
    }

    if (previousEntries.isPlaceholderData) {
      setError(
        "La semaine précédente est encore en cours de chargement. Réessayez dans un instant.",
      );

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
        `${copied} entrée(s) reprises, ${failures.length} échouée(s) : ${writeErrorMessage(failures[0])}`,
      );

      return;
    }

    if (copied === 0) {
      setError("Aucune entrée à reprendre sur la semaine précédente.");
    }
  };

  const isPending = clients.isPending || entries.isPending;
  const isError = clients.isError || entries.isError;

  const liveMission =
    timer === null
      ? null
      : findMissionById(clients.data?.clients ?? [], timer.missionId);

  const live: LiveCell | null =
    timer === null || liveMission === null
      ? null
      : {
          billedLabel: provisionalBilledLabel(
            user.locale,
            Math.round(elapsedSeconds / 60),
            {
              billingMode: liveMission.billingMode,
              workdayMinutes: user.workdayMinutes,
            },
            liveMission.rounding,
          ),
          clockLabel: formatClock(elapsedSeconds),
          date: timerStartDate ?? today,
          isRunning: isTimerRunning,
          missionId: timer.missionId,
          onStop: openStop,
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
          <AlertDescription>
            Impossible de charger la semaine. Réessayez dans un instant.
          </AlertDescription>
        </Alert>
      )}
      {clients.data !== undefined && entries.data !== undefined && (
        <WeekPage
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
          onSubmitNewEntry={handleSubmitNewEntry}
          onUpdate={handleUpdate}
          onWeekChange={(nextWeek) =>
            void navigate({
              search: { ...search, week: nextWeek },
              to: "/semaine",
            })
          }
          onWeekendToggle={(open) =>
            void navigate({
              search: { ...search, weekend: open ? true : undefined },
              to: "/semaine",
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
