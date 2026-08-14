import type {
  EntryRounding,
  MissionData,
  TimerData,
} from "@opusline/api-client";
import {
  discardTimerMutation,
  listClientsOptions,
  listTimeEntriesOptions,
  pauseTimerMutation,
  resumeTimerMutation,
  showTimerOptions,
  showTimerQueryKey,
  startTimerMutation,
  stopTimerMutation,
  trimTimerMutation,
  updateTimerMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMachine } from "@xstate/react";
import type { ReactNode } from "react";
import {
  createContext,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
} from "react";
import { useMoneyFormat } from "@/components/money-format-provider";
import { collectNoteSuggestions } from "@/components/note-suggestions";
import {
  addCalendarDays,
  toCalendarDate,
  todayCalendarDate,
} from "@/lib/dates";
import { serverErrorMessage } from "@/lib/validation";

import { type IdleNotice, idleNotice, trimSeconds } from "../lib/idle";
import { isLongRun, longRunHours, parseWorkedDuration } from "../lib/long-run";
import type { TimerMissionOption } from "../lib/mission-options";
import { findMissionById, trackableMissions } from "../lib/mission-options";
import { createNoteQueue } from "../lib/note-queue";
import { timerMachine } from "../lib/timer-machine";
import { useActivity } from "../lib/use-activity";
import { useLiveTimer } from "../lib/use-live-timer";

const WRITE_FAILED = "L'opération a échoué. Réessayez dans un instant.";
const NOTE_DEBOUNCE_MS = 600;
const SUGGESTION_WINDOW_DAYS = 60;

export type StopSubmission = {
  durationMinutes: number;
  rounding: EntryRounding | null;
};

export type TimerContextValue = {
  billable: boolean;
  longRunHours: string | null;
  correctedMinutes: number | null;
  correctionDraft: string;
  elapsedSeconds: number;
  error: string | null;
  idle: IdleNotice | null;
  isBusy: boolean;
  isConfirmingDiscard: boolean;
  isRunning: boolean;
  isSaving: boolean;
  isStarting: boolean;
  mission: MissionData | null;
  missions: TimerMissionOption[];
  noteDraft: string;
  noteSuggestions: string[];
  overlay: "closed" | "start" | "detail" | "stopping";
  startDate: string | null;
  stopChoice: string | null;
  timer: TimerData | null;
  cancelDiscard: () => void;
  changeNote: (note: string) => void;
  close: () => void;
  confirmDiscard: () => void;
  discard: () => void;
  dismissIdle: () => void;
  openStart: () => void;
  openStop: () => void;
  pick: (missionId: number) => void;
  correctDuration: (draft: string) => void;
  keepLongRun: () => void;
  selectRounding: (key: string) => void;
  setBillable: (billable: boolean) => void;
  stop: (submission: StopSubmission) => void;
  toggleDetail: () => void;
  togglePause: () => void;
  trimIdle: () => void;
};

const TimerContext = createContext<TimerContextValue | null>(null);

export function useTimer(): TimerContextValue {
  const value = use(TimerContext);

  if (value === null) {
    throw new Error("useTimer must be used inside a <TimerProvider>");
  }

  return value;
}

export function TimerProvider({
  children,
  workdayMinutes,
}: {
  children: ReactNode;
  workdayMinutes: number;
}) {
  const format = useMoneyFormat();
  const queryClient = useQueryClient();

  const { elapsedSeconds, isRunning, lastMissionId, now, timer } =
    useLiveTimer();
  const clientsQuery = useQuery(listClientsOptions());

  const [state, send] = useMachine(timerMachine);
  const { clearIdleSpan, idleSpan, lastActivityAt } = useActivity();

  const timerId = timer?.id ?? null;
  const latestServerNote = useEffectEvent(() => timer?.note ?? "");

  useEffect(() => {
    if (timerId !== null) {
      send({ type: "SYNC_NOTE", note: latestServerNote() });
    }
  }, [timerId, send]);

  const noteTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noteWrites = useRef(createNoteQueue());

  const cancelPendingNote = () => {
    if (noteTimeout.current !== null) {
      clearTimeout(noteTimeout.current);
      noteTimeout.current = null;
    }
  };

  /*
   * `PUT /timer` targets whichever timer is running when it lands, so a note
   * still in flight when this one is stopped would be written onto the next
   * timer the user starts. Drop what has not fired and wait out what has.
   */
  const settlePendingNotes = async () => {
    cancelPendingNote();
    await noteWrites.current.settle();
  };

  useEffect(
    () => () => {
      if (noteTimeout.current !== null) {
        clearTimeout(noteTimeout.current);
      }
    },
    [],
  );

  const hadTimerRef = useRef(timer !== null);

  useEffect(() => {
    if (timer === null && hadTimerRef.current) {
      send({ type: "TIMER_GONE" });
    }

    hadTimerRef.current = timer !== null;
  }, [timer, send]);

  const start = useMutation(startTimerMutation());
  const pause = useMutation(pauseTimerMutation());
  const resume = useMutation(resumeTimerMutation());
  const trim = useMutation(trimTimerMutation());
  const updateNote = useMutation(updateTimerMutation());
  const discardTimer = useMutation(discardTimerMutation());
  const stopTimer = useMutation(stopTimerMutation());

  const isBusy =
    start.isPending ||
    pause.isPending ||
    resume.isPending ||
    trim.isPending ||
    discardTimer.isPending ||
    stopTimer.isPending;

  const run = async (write: () => Promise<unknown>): Promise<boolean> => {
    const hadTimer = timer !== null;

    try {
      await write();
      send({ type: "SETTLED" });
      await queryClient.invalidateQueries({ queryKey: showTimerQueryKey() });

      return true;
    } catch (caught) {
      const fresh = await queryClient
        .fetchQuery({ ...showTimerOptions(), staleTime: 0 })
        .catch(() => undefined);

      if (hadTimer && fresh?.timer === null) {
        send({ type: "TIMER_GONE" });
      } else {
        send({
          type: "FAILED",
          hasTimer: fresh === undefined ? hadTimer : fresh.timer !== null,
          message: serverErrorMessage(caught, WRITE_FAILED),
        });
      }

      return false;
    }
  };

  const isStopping = state.matches("stopping");
  const today = todayCalendarDate();
  const recentEntries = useQuery({
    ...listTimeEntriesOptions({
      query: {
        from: addCalendarDays(today, -SUGGESTION_WINDOW_DAYS),
        to: today,
      },
    }),
    enabled: isStopping,
  });

  const clients = clientsQuery.data?.clients ?? [];
  const missions = useMemo(
    () => trackableMissions(format, clients, lastMissionId),
    [clients, format, lastMissionId],
  );
  const mission =
    timer === null ? null : findMissionById(clients, timer.missionId);

  const idle =
    timer === null
      ? null
      : idleNotice({
          dismissedIdleAt: state.context.dismissedIdleAt,
          isRunning,
          lastActivityAt: lastActivityAt(),
          now,
          recordedSpan: idleSpan,
        });

  const looksForgotten =
    timer !== null &&
    !state.context.keptLongRun &&
    isLongRun(elapsedSeconds, workdayMinutes);

  const missionId = timer?.missionId ?? null;
  const noteSuggestions = useMemo(
    () =>
      missionId === null
        ? []
        : collectNoteSuggestions(
            recentEntries.data?.timeEntries ?? [],
            missionId,
          ),
    [recentEntries.data, missionId],
  );

  const changeNote = (note: string) => {
    send({ type: "CHANGE_NOTE", note });

    if (noteTimeout.current !== null) {
      clearTimeout(noteTimeout.current);
    }

    noteTimeout.current = setTimeout(() => {
      noteTimeout.current = null;
      const trimmed = note.trim();

      noteWrites.current.push(() =>
        run(() =>
          updateNote.mutateAsync({
            body: { note: trimmed === "" ? null : trimmed },
          }),
        ),
      );
    }, NOTE_DEBOUNCE_MS);
  };

  const trimIdle = async () => {
    if (idle === null) {
      return;
    }

    const trimmed = await run(() =>
      trim.mutateAsync({
        body: { seconds: trimSeconds(idle.idleSeconds, elapsedSeconds) },
      }),
    );

    if (trimmed) {
      send({ type: "DISMISS_IDLE", lastActivityAt: idle.key });
      clearIdleSpan();
    }
  };

  const startDate =
    timer === null ? null : toCalendarDate(new Date(timer.startedAt));

  const stop = async ({ durationMinutes, rounding }: StopSubmission) => {
    if (startDate === null) {
      return;
    }

    await settlePendingNotes();

    const trimmed = state.context.noteDraft.trim();
    const saved = await run(() =>
      stopTimer.mutateAsync({
        body: {
          billable: state.context.billable,
          date: startDate,
          durationMinutes,
          note: trimmed === "" ? null : trimmed,
          rounding,
        },
      }),
    );

    if (saved) {
      send({ type: "SAVED" });
      await queryClient.invalidateQueries({
        queryKey: [{ _id: "listTimeEntries" }],
      });
    }
  };

  const overlay = state.matches("start")
    ? "start"
    : state.matches("stopping")
      ? "stopping"
      : state.matches("detail")
        ? "detail"
        : "closed";

  const value: TimerContextValue = {
    billable: state.context.billable,
    correctDuration: (draft) =>
      send({
        type: "CORRECT_DURATION",
        draft,
        minutes: parseWorkedDuration(draft, workdayMinutes),
      }),
    correctedMinutes: state.context.correctedMinutes,
    correctionDraft: state.context.correctionDraft,
    keepLongRun: () => send({ type: "KEEP_LONG_RUN" }),
    longRunHours: looksForgotten ? longRunHours(elapsedSeconds) : null,
    cancelDiscard: () => send({ type: "CANCEL" }),
    changeNote,
    close: () => send({ type: "CLOSE" }),
    confirmDiscard: () => {
      send({ type: "CONFIRM_DISCARD" });
      void settlePendingNotes().then(() =>
        run(() => discardTimer.mutateAsync({})),
      );
    },
    discard: () => send({ type: "DISCARD" }),
    dismissIdle: () => {
      if (idle !== null) {
        send({ type: "DISMISS_IDLE", lastActivityAt: idle.key });
      }

      clearIdleSpan();
    },
    elapsedSeconds,
    error: state.context.error,
    idle,
    isBusy,
    isConfirmingDiscard: state.matches({ detail: "confirming" }),
    isRunning,
    isSaving: stopTimer.isPending,
    isStarting: start.isPending,
    mission,
    missions,
    noteDraft: state.context.noteDraft,
    noteSuggestions,
    openStart: () => send({ type: "OPEN_START" }),
    openStop: () => send({ type: "OPEN_STOP" }),
    overlay,
    pick: (missionId) => {
      send({ type: "PICK", missionId });
      void run(() => start.mutateAsync({ body: { missionId } }));
    },
    selectRounding: (key) => send({ type: "SELECT_ROUNDING", key }),
    setBillable: (billable) => send({ type: "SET_BILLABLE", billable }),
    startDate,
    stop: (submission) => void stop(submission),
    stopChoice: state.context.stopChoice,
    timer,
    toggleDetail: () => send({ type: "TOGGLE_DETAIL" }),
    togglePause: () =>
      void run(() =>
        isRunning ? pause.mutateAsync({}) : resume.mutateAsync({}),
      ),
    trimIdle: () => void trimIdle(),
  };

  return <TimerContext value={value}>{children}</TimerContext>;
}
