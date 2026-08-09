import { and, assign, fromPromise, setup } from "xstate";

import {
  type DurationUnits,
  formatDurationInput,
  isHourly,
  parseDuration,
} from "@/lib/durations";

import { durationErrorHint } from "./labels";
import {
  cellKeyAt,
  defaultCellKey,
  focusableColumnCount,
  type LocatedCell,
  locateCell,
  type WeekGridModel,
} from "./week-grid";
import { nextCell } from "./week-keyboard";

/**
 * The week grid's interaction state. Everything the machine holds is plain data,
 * including the view model itself, so the whole thing can be driven with
 * `createActor` and asserted without a DOM. The component owns only what needs a
 * ref — moving DOM focus, selecting the editor's text — and does it in response
 * to this state rather than alongside it.
 */

/** What a commit asks the route to do. Serialisable: never a thunk. */
export type WriteRequest =
  | {
      kind: "create";
      cellKey: string;
      missionId: number;
      date: string;
      durationMinutes: number;
    }
  | {
      kind: "update";
      cellKey: string;
      entryId: number;
      durationMinutes: number;
    }
  | { kind: "clear"; cellKey: string; entryIds: number[] };

/** Where focus goes after a commit. `none` is a blur: it must not steal focus. */
export type CommitMove = "stay" | "right" | "none";

export type WeekMachineContext = {
  model: WeekGridModel;
  workdayMinutes: number;
  /** The grid's single tab stop. */
  focusedKey: string | null;
  /** The cell the editor or the popover belongs to. */
  targetKey: string | null;
  draft: string;
  error: string | null;
  /** Whether opening the editor selects the value or keeps the caret after it. */
  caret: "select" | "end";
  request: WriteRequest | null;
  /** Enter on an empty cell names the activity once the entry exists. */
  labelAfterWrite: boolean;
  /**
   * Bumped whenever the machine wants DOM focus moved to `focusedKey`. Setting
   * the tab stop and moving the caret are different intentions — navigating
   * moves focus, opening the editor must not pull it off the input.
   */
  focusRequest: number;
};

export type WeekMachineEvent =
  | { type: "MODEL"; model: WeekGridModel; workdayMinutes: number }
  | { type: "FOCUS"; key: string }
  | { type: "NAVIGATE"; from: string; key: string; ctrlKey: boolean }
  | { type: "ACTIVATE"; key: string }
  | { type: "EDIT"; key: string; seed?: string }
  | { type: "TOGGLE_DAY"; key: string }
  | { type: "LABEL"; key: string }
  | { type: "CLEAR"; key: string }
  | { type: "CHANGE"; draft: string }
  | { type: "COMMIT"; move: CommitMove }
  | { type: "CANCEL" }
  | { type: "BLUR" }
  | { type: "CLOSE" };

/** A blur commits exactly like Enter, minus the focus move. */
function commitMoveOf(event: WeekMachineEvent): CommitMove {
  return event.type === "COMMIT" ? event.move : "none";
}

type CommitPlan =
  | { kind: "error"; message: string }
  | { kind: "write"; request: WriteRequest; labelAfterWrite: boolean }
  | { kind: "noop" };

function unitsOf(located: LocatedCell, workdayMinutes: number): DurationUnits {
  return { billingMode: located.row.billingMode, workdayMinutes };
}

function editableTarget(
  context: WeekMachineContext,
  key: string,
): LocatedCell | null {
  const located = locateCell(context.model, key);

  return located === null || located.cell.date === null ? null : located;
}

/** The write a cell needs to hold exactly `minutes`, or null when it already does. */
function writeFor(located: LocatedCell, minutes: number): WriteRequest | null {
  const { cell } = located;

  if (cell.date === null) {
    return null;
  }

  const entry = cell.entries[0];

  if (entry === undefined) {
    return {
      cellKey: cell.key,
      date: cell.date,
      durationMinutes: minutes,
      kind: "create",
      missionId: located.row.missionId,
    };
  }

  if (entry.durationMinutes === minutes) {
    return null;
  }

  return {
    cellKey: cell.key,
    durationMinutes: minutes,
    entryId: entry.id,
    kind: "update",
  };
}

function clearFor(located: LocatedCell): WriteRequest | null {
  return located.cell.entries.length === 0
    ? null
    : {
        cellKey: located.cell.key,
        entryIds: located.cell.entries.map((entry) => entry.id),
        kind: "clear",
      };
}

/**
 * Computed rather than stored, so the three COMMIT guards below and the action
 * that follows them always agree. Parsing is a regex — cheap enough to repeat.
 */
function planCommit(context: WeekMachineContext, move: CommitMove): CommitPlan {
  const located = editableTarget(context, context.targetKey ?? "");

  if (located === null) {
    return { kind: "noop" };
  }

  const parsed = parseDuration(
    context.draft,
    unitsOf(located, context.workdayMinutes),
  );

  if (parsed.kind === "invalid") {
    return { kind: "error", message: durationErrorHint(parsed.reason) };
  }

  const request =
    parsed.kind === "clear"
      ? clearFor(located)
      : writeFor(located, parsed.minutes);

  if (request === null) {
    return { kind: "noop" };
  }

  return {
    // Tab is the fill-the-week path and must not be interrupted by a popover.
    labelAfterWrite: request.kind === "create" && move === "stay",
    kind: "write",
    request,
  };
}

function commitFocusKey(
  context: WeekMachineContext,
  move: CommitMove,
): string | null {
  const located = locateCell(context.model, context.targetKey);

  if (move === "none" || located === null) {
    return null;
  }

  return (
    cellKeyAt(context.model, {
      column:
        move === "right"
          ? Math.min(
              located.columnIndex + 1,
              focusableColumnCount(context.model) - 1,
            )
          : located.columnIndex,
      row: located.rowIndex,
    }) ?? context.targetKey
  );
}

function draftFor(located: LocatedCell, workdayMinutes: number): string {
  const entry = located.cell.entries[0];

  return entry === undefined
    ? ""
    : formatDurationInput(
        entry.durationMinutes,
        unitsOf(located, workdayMinutes),
      );
}

const COMMIT_ATTEMPT = [
  { guard: "commitIsInvalid", actions: "showParseError" },
  {
    guard: "commitNeedsWrite",
    target: "saving",
    actions: ["settleCommit", "prepareWrite"],
  },
  { target: "browsing", actions: "settleCommit" },
] as const;

/**
 * The events a cell answers whether or not a write is in flight. Targets resolve
 * against the parent, and every state spreading this is a child of the root, so
 * one definition serves them all.
 */
const OPEN_CELL = [
  {
    guard: "cellHasSeveralEntries",
    target: "labelling",
    actions: "openLabel",
  },
  { guard: "cellIsEditable", target: "editing", actions: "openEditor" },
] as const;

const CELL_EVENTS = {
  FOCUS: { actions: "focusEvent" },
  NAVIGATE: { actions: "navigate" },
  ACTIVATE: OPEN_CELL,
  EDIT: OPEN_CELL,
  LABEL: {
    guard: "cellHasEntries",
    target: "labelling",
    actions: "openLabel",
  },
  TOGGLE_DAY: [
    OPEN_CELL[0],
    { guard: "isHourlyRow", target: "editing", actions: "openEditor" },
    {
      guard: and(["cellIsEditable", "cellIsNotSaving"]),
      target: "saving",
      reenter: true,
      actions: "requestWrite",
    },
  ],
  CLEAR: {
    guard: and(["cellHasEntries", "cellIsNotSaving"]),
    target: "saving",
    reenter: true,
    actions: "requestWrite",
  },
} as const;

export const weekMachine = setup({
  types: {
    context: {} as WeekMachineContext,
    events: {} as WeekMachineEvent,
    input: {} as { model: WeekGridModel; workdayMinutes: number },
  },
  actors: {
    // Replaced with the route's handlers via `.provide()`; the machine only
    // ever describes the write, it never performs one.
    write: fromPromise<boolean, WriteRequest>(() =>
      Promise.reject(new Error("weekMachine: no write actor provided")),
    ),
  },
  guards: {
    cellHasSeveralEntries: ({ context, event }) =>
      "key" in event &&
      (locateCell(context.model, event.key)?.cell.entries.length ?? 0) > 1,
    cellHasEntries: ({ context, event }) =>
      "key" in event &&
      (locateCell(context.model, event.key)?.cell.entries.length ?? 0) > 0,
    cellIsEditable: ({ context, event }) =>
      "key" in event && editableTarget(context, event.key) !== null,
    isHourlyRow: ({ context, event }) =>
      "key" in event &&
      isHourly(locateCell(context.model, event.key)?.row.billingMode ?? 0),
    /*
     * The model only learns about a write once it lands, so a second toggle on
     * the same cell would be computed against the stale cell and create a
     * duplicate. `request` is null everywhere but `saving`, so this only ever
     * bites while that cell's own write is in flight.
     */
    cellIsNotSaving: ({ context, event }) =>
      !("key" in event) || context.request?.cellKey !== event.key,
    // The click that reaches the cell from inside its own open editor.
    isCurrentTarget: ({ context, event }) =>
      "key" in event && event.key === context.targetKey,
    commitIsInvalid: ({ context, event }) =>
      planCommit(context, commitMoveOf(event)).kind === "error",
    commitNeedsWrite: ({ context, event }) =>
      planCommit(context, commitMoveOf(event)).kind === "write",
    targetIsFilled: ({ context }) =>
      (locateCell(context.model, context.targetKey)?.cell.entries.length ?? 0) >
      0,
    targetIsGone: ({ context }) =>
      locateCell(context.model, context.targetKey) === null,
    // `labelAfterWrite` is only ever set for a create, so it says both.
    createdAndWantsLabel: ({ context, event }) =>
      context.labelAfterWrite && "output" in event && event.output === true,
  },
  actions: {
    absorbModel: assign(({ context, event }) => {
      if (event.type !== "MODEL") {
        return {};
      }

      const stillThere = locateCell(event.model, context.focusedKey) !== null;

      return {
        model: event.model,
        workdayMinutes: event.workdayMinutes,
        // A week with fewer rows would otherwise leave the tab stop pointing
        // at nothing, and the grid unreachable by keyboard.
        focusedKey: stillThere
          ? context.focusedKey
          : defaultCellKey(event.model),
      };
    }),
    focusEvent: assign(({ event }) =>
      "key" in event ? { focusedKey: event.key } : {},
    ),
    navigate: assign(({ context, event }) => {
      if (event.type !== "NAVIGATE") {
        return {};
      }

      // Navigation starts from the cell that received the key, which is not
      // necessarily the tab stop — focus can be moved by the browser too.
      const located = locateCell(context.model, event.from);

      if (located === null) {
        return {};
      }

      const moved = nextCell(
        { column: located.columnIndex, row: located.rowIndex },
        event.key,
        {
          columnCount: focusableColumnCount(context.model),
          ctrlKey: event.ctrlKey,
          rowCount: context.model.rows.length,
        },
      );

      if (moved === null) {
        return {};
      }

      return {
        focusedKey: cellKeyAt(context.model, moved) ?? context.focusedKey,
        focusRequest: context.focusRequest + 1,
      };
    }),
    openEditor: assign(({ context, event }) => {
      if (!("key" in event)) {
        return {};
      }

      const located = editableTarget(context, event.key);

      if (located === null) {
        return {};
      }

      const seed = event.type === "EDIT" ? event.seed : undefined;

      return {
        caret: seed === undefined ? ("select" as const) : ("end" as const),
        draft: seed ?? draftFor(located, context.workdayMinutes),
        error: null,
        focusedKey: event.key,
        labelAfterWrite: false,
        targetKey: event.key,
      };
    }),
    openLabel: assign(({ event }) =>
      "key" in event ? { targetKey: event.key } : {},
    ),
    changeDraft: assign(({ event }) =>
      event.type === "CHANGE" ? { draft: event.draft, error: null } : {},
    ),
    showParseError: assign(({ context, event }) => {
      const plan = planCommit(context, commitMoveOf(event));

      return plan.kind === "error" ? { error: plan.message } : {};
    }),
    prepareWrite: assign(({ context, event }) => {
      const plan = planCommit(context, commitMoveOf(event));

      return plan.kind === "write"
        ? { labelAfterWrite: plan.labelAfterWrite, request: plan.request }
        : {};
    }),
    settleCommit: assign(({ context, event }) => {
      const focusedKey = commitFocusKey(context, commitMoveOf(event));

      return {
        focusRequest:
          focusedKey === null ? context.focusRequest : context.focusRequest + 1,
        focusedKey: focusedKey ?? context.focusedKey,
      };
    }),
    requestWrite: assign(({ context, event }) => {
      if (!("key" in event)) {
        return {};
      }

      const located = locateCell(context.model, event.key);

      if (located === null) {
        return {};
      }

      const [entry] = located.cell.entries;
      const isFullDay =
        located.cell.entries.length === 1 &&
        entry?.durationMinutes === context.workdayMinutes;

      const request =
        event.type === "CLEAR" || isFullDay
          ? clearFor(located)
          : writeFor(located, context.workdayMinutes);

      return {
        focusedKey: event.key,
        labelAfterWrite: false,
        request,
        targetKey: event.key,
      };
    }),
    returnToCell: assign(({ context }) => ({
      focusRequest: context.focusRequest + 1,
      focusedKey: context.targetKey ?? context.focusedKey,
    })),
    forget: assign({
      draft: "",
      error: null,
      labelAfterWrite: false,
      request: null,
      targetKey: null,
    }),
  },
}).createMachine({
  id: "weekInteraction",
  initial: "browsing",
  context: ({ input }) => ({
    caret: "select" as const,
    draft: "",
    error: null,
    focusRequest: 0,
    focusedKey: defaultCellKey(input.model),
    labelAfterWrite: false,
    model: input.model,
    request: null,
    targetKey: null,
    workdayMinutes: input.workdayMinutes,
  }),
  // The model refreshes under every state; nothing else is global.
  on: {
    MODEL: { actions: "absorbModel" },
  },
  states: {
    browsing: {
      entry: "forget",
      on: CELL_EVENTS,
    },

    editing: {
      on: {
        CHANGE: { actions: "changeDraft" },
        // A click inside the open editor bubbles to the cell; re-seeding the
        // draft here is what used to wipe what the user had typed.
        ACTIVATE: [
          { guard: "isCurrentTarget" },
          { guard: "cellIsEditable", actions: "openEditor" },
        ],
        COMMIT: COMMIT_ATTEMPT,
        // A blur commits exactly like Enter; `settleCommit` reads the move as
        // "none" and leaves focus wherever it just went.
        BLUR: COMMIT_ATTEMPT,
        CANCEL: { target: "browsing", actions: "returnToCell" },
      },
    },

    saving: {
      /*
       * A write in flight must not freeze the grid — the user carries straight
       * on into the next cell while it lands. Leaving `saving` discards the
       * invoked actor's result, which is exactly right: moving on is what
       * cancels the activity follow-up.
       */
      on: CELL_EVENTS,
      invoke: {
        src: "write",
        input: ({ context }) => {
          if (context.request === null) {
            throw new Error("weekMachine: entered saving with no request");
          }

          return context.request;
        },
        onDone: [
          { guard: "createdAndWantsLabel", target: "awaitingEntry" },
          { target: "browsing" },
        ],
        // A refused write must not leave the popover armed to fire later.
        onError: { target: "browsing" },
      },
    },

    /** The entry exists server-side; wait for it to reach the rebuilt model. */
    awaitingEntry: {
      always: [
        { guard: "targetIsFilled", target: "labelling" },
        { guard: "targetIsGone", target: "browsing" },
      ],
      on: {
        MODEL: { actions: "absorbModel" },
        EDIT: { target: "editing", actions: "openEditor" },
        NAVIGATE: { target: "browsing", actions: "navigate" },
        CANCEL: { target: "browsing" },
      },
    },

    labelling: {
      on: {
        CLOSE: { target: "browsing", actions: "returnToCell" },
      },
    },
  },
});
