import { assign, setup } from "xstate";

export type TimerMachineContext = {
  billable: boolean;
  error: string | null;
  noteDraft: string;
  dismissedIdleAt: number | null;
  stopChoice: string | null;
  /** The user said a long-running timer is deliberate; stop asking. */
  keptLongRun: boolean;
  /**
   * Minutes replacing a forgotten timer's measured duration, and the raw text
   * behind them so a half-typed "3:" survives the next render.
   */
  correctedMinutes: number | null;
  correctionDraft: string;
};

export type TimerMachineEvent =
  | { type: "OPEN_START" }
  | { type: "TOGGLE_DETAIL" }
  | { type: "OPEN_STOP" }
  | { type: "CLOSE" }
  | { type: "PICK"; missionId: number }
  | { type: "SELECT_ROUNDING"; key: string }
  | { type: "SET_BILLABLE"; billable: boolean }
  | { type: "KEEP_LONG_RUN" }
  | { type: "CORRECT_DURATION"; draft: string; minutes: number | null }
  | { type: "CHANGE_NOTE"; note: string }
  | { type: "SYNC_NOTE"; note: string }
  | { type: "DISCARD" }
  | { type: "CONFIRM_DISCARD" }
  | { type: "CANCEL" }
  | { type: "DISMISS_IDLE"; lastActivityAt: number }
  | { type: "SETTLED" }
  | { type: "SAVED" }
  | { type: "FAILED"; hasTimer: boolean; message: string }
  | { type: "TIMER_GONE" };

export const timerMachine = setup({
  types: {
    context: {} as TimerMachineContext,
    events: {} as TimerMachineEvent,
  },
  guards: {
    hasTimer: ({ event }) => event.type === "FAILED" && event.hasTimer,
  },
  actions: {
    showError: assign(({ event }) => ({
      error: event.type === "FAILED" ? event.message : null,
    })),
    clearError: assign({ error: null }),
    changeNote: assign(({ context, event }) =>
      event.type === "CHANGE_NOTE" || event.type === "SYNC_NOTE"
        ? { noteDraft: event.note }
        : context,
    ),
    chooseRounding: assign(({ context, event }) =>
      event.type === "SELECT_ROUNDING" ? { stopChoice: event.key } : context,
    ),
    setBillable: assign(({ context, event }) =>
      event.type === "SET_BILLABLE" ? { billable: event.billable } : context,
    ),
    keepLongRun: assign({ keptLongRun: true }),
    correctDuration: assign(({ context, event }) =>
      event.type === "CORRECT_DURATION"
        ? { correctedMinutes: event.minutes, correctionDraft: event.draft }
        : context,
    ),
    dismissIdle: assign(({ context, event }) =>
      event.type === "DISMISS_IDLE"
        ? { dismissedIdleAt: event.lastActivityAt }
        : context,
    ),
    // A new timer inherits nothing from the one before it.
    forgetTimer: assign({
      billable: true,
      correctedMinutes: null,
      correctionDraft: "",
      dismissedIdleAt: null,
      error: null,
      keptLongRun: false,
      noteDraft: "",
      stopChoice: null,
    }),
    // Every stop dialog starts from the same place, whatever the last one chose.
    forgetStopChoice: assign({
      billable: true,
      correctedMinutes: null,
      correctionDraft: "",
      stopChoice: null,
    }),
  },
}).createMachine({
  id: "timer",
  initial: "closed",
  context: {
    billable: true,
    correctedMinutes: null,
    correctionDraft: "",
    dismissedIdleAt: null,
    error: null,
    keptLongRun: false,
    noteDraft: "",
    stopChoice: null,
  },
  on: {
    FAILED: [
      {
        guard: "hasTimer",
        target: "#timer.detail.viewing",
        actions: "showError",
      },
      { target: "#timer.start", actions: "showError" },
    ],
    OPEN_START: ".start",
    TIMER_GONE: { target: "#timer.closed", actions: "forgetTimer" },
    SETTLED: { actions: "clearError" },
    SYNC_NOTE: { actions: "changeNote" },
    CHANGE_NOTE: { actions: "changeNote" },
    DISMISS_IDLE: { actions: "dismissIdle" },
    KEEP_LONG_RUN: { actions: "keepLongRun" },
  },
  states: {
    closed: {
      on: {
        TOGGLE_DETAIL: "detail",
        OPEN_STOP: "stopping",
      },
    },

    start: {
      on: {
        PICK: { target: "closed", actions: "clearError" },
        CLOSE: { target: "closed", actions: "clearError" },
      },
    },

    detail: {
      initial: "viewing",
      states: {
        viewing: {
          on: {
            DISCARD: "confirming",
          },
        },

        confirming: {
          on: {
            CONFIRM_DISCARD: {
              target: "#timer.closed",
              actions: "forgetTimer",
            },
            CANCEL: "viewing",
          },
        },
      },
      on: {
        OPEN_STOP: "stopping",
        TOGGLE_DETAIL: "closed",
        CLOSE: "closed",
      },
    },

    stopping: {
      entry: "forgetStopChoice",
      on: {
        SELECT_ROUNDING: { actions: "chooseRounding" },
        SET_BILLABLE: { actions: "setBillable" },
        CORRECT_DURATION: { actions: "correctDuration" },
        SAVED: { target: "closed", actions: "forgetTimer" },
        FAILED: { actions: "showError" },
        CLOSE: "closed",
      },
    },
  },
});
