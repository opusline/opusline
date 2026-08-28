import type { DeadlineBoardData, DeadlineItemData } from "@opusline/api-client";
import {
  completeDeadlineMutation,
  confirmCalendarSubscriptionMutation,
  interruptCalendarSubscriptionMutation,
  listDeadlinesQueryKey,
  markDeadlineRemindersReadMutation,
  regenerateCalendarTokenMutation,
  uncompleteDeadlineMutation,
  updateCalendarFeedMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  type DeadlineFilter,
  DeadlinesPage,
} from "@/features/deadlines/components/deadlines-page";
import { SubscribeCalendarDialog } from "@/features/deadlines/components/subscribe-calendar-dialog";
import { accountTodayCalendarDate } from "@/lib/dates";
import {
  deadlineItemKey,
  deadlinesQueryOptions,
  unreadReminderCount,
} from "@/lib/deadlines";
import { requireFrenchFiscality } from "@/lib/fiscality";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/deadlines")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: DeadlinesRoute,
});

function DeadlinesRoute() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const today = accountTodayCalendarDate(user.timezone);

  const board = useQuery({
    ...deadlinesQueryOptions(user.hasFrenchFiscality),
    placeholderData: keepPreviousData,
  });

  const [filter, setFilter] = useState<DeadlineFilter>("all");
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  // Every write answers with the recomputed board: ticking one deadline off
  // moves the next one and the sidebar badge at once, so writing the response
  // into the cache spares a second identical GET.
  const accept = (data: DeadlineBoardData) => {
    queryClient.setQueryData(listDeadlinesQueryKey(), data);
  };

  const writing = (whenItFails: string) => ({
    onSuccess: accept,
    onError: (cause: unknown) =>
      setError(serverErrorMessage(cause, whenItFails)),
  });

  const releasing = { onSettled: () => setPendingKey(null) };

  const complete = useMutation({
    ...completeDeadlineMutation(),
    ...writing(m.deadlines_complete_failed()),
    ...releasing,
  });

  const uncomplete = useMutation({
    ...uncompleteDeadlineMutation(),
    ...writing(m.deadlines_complete_failed()),
    ...releasing,
  });

  const markRead = useMutation({
    ...markDeadlineRemindersReadMutation(),
    ...writing(m.deadlines_reminders_failed()),
  });

  const updateFeed = useMutation({
    ...updateCalendarFeedMutation(),
    ...writing(m.deadlines_feed_save_failed()),
  });

  const rotateCalendar = useMutation({
    ...regenerateCalendarTokenMutation(),
    ...writing(m.deadlines_calendar_rotate_failed()),
  });

  const confirmSubscription = useMutation({
    ...confirmCalendarSubscriptionMutation(),
    ...writing(m.deadlines_subscribe_confirm_failed()),
  });

  const interruptSubscription = useMutation({
    ...interruptCalendarSubscriptionMutation(),
    ...writing(m.deadlines_interrupt_failed()),
  });

  // « J'ai ajouté l'adresse » commits the checkboxes AND the claim in one
  // gesture; « Enregistrer » only the checkboxes. Errors keep the dialog open.
  const saveSubscription = async (feed: DeadlineBoardData["calendarFeed"]) => {
    setError(null);

    try {
      await updateFeed.mutateAsync({ body: feed });

      if (board.data?.calendarSubscribedOn == null) {
        await confirmSubscription.mutateAsync({});
      }

      setSubscribeOpen(false);
    } catch {
      // writing() already surfaced the failure.
    }
  };

  // The page IS the notification center: visiting it is reading it, the way
  // opening a mail thread marks it read. No button to remember.
  const hasUnread = unreadReminderCount(board.data?.reminders ?? []) > 0;
  const markReadMutate = markRead.mutate;

  useEffect(() => {
    if (hasUnread) {
      markReadMutate({});
    }
  }, [hasUnread, markReadMutate]);

  const toggleFiscal = (item: DeadlineItemData) => {
    const fiscal = item.fiscal;

    if (fiscal === null) {
      return;
    }

    setError(null);
    setPendingKey(deadlineItemKey(item));

    if (fiscal.completedOn === null) {
      complete.mutate({
        body: { kind: fiscal.kind, periodKey: fiscal.periodKey },
      });

      return;
    }

    uncomplete.mutate({
      path: { kind: fiscal.kind, periodKey: fiscal.periodKey },
    });
  };

  if (board.isPending) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-3.5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const loadFailed = (
    <Alert variant="destructive">
      <AlertDescription>{m.deadlines_load_failed()}</AlertDescription>
    </Alert>
  );

  if (board.data === undefined) {
    return loadFailed;
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* A failed refetch keeps the last good board on screen. */}
      {board.isError && loadFailed}
      {error !== null && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <DeadlinesPage
        board={board.data}
        filter={filter}
        isRefreshing={board.isPlaceholderData}
        onFilterChange={setFilter}
        onOpenSubscribe={() => setSubscribeOpen(true)}
        onToggleFiscal={toggleFiscal}
        pendingKey={pendingKey}
        today={today}
      />

      <SubscribeCalendarDialog
        calendarToken={board.data.calendarToken}
        feed={board.data.calendarFeed}
        isInterrupting={interruptSubscription.isPending}
        isRotating={rotateCalendar.isPending}
        isSaving={updateFeed.isPending || confirmSubscription.isPending}
        lastSyncedAt={board.data.calendarLastSyncedAt}
        onInterrupt={() => {
          setError(null);
          interruptSubscription.mutate({});
        }}
        onOpenChange={setSubscribeOpen}
        onRotate={() => {
          setError(null);
          rotateCalendar.mutate({});
        }}
        onSave={(feed) => void saveSubscription(feed)}
        open={subscribeOpen}
        subscribedOn={board.data.calendarSubscribedOn}
      />
    </div>
  );
}
