import { beforeEach, expect, it } from "vitest";
import { type Actor, createActor, fromPromise } from "xstate";

import {
  DEMO_CLIENTS,
  DEMO_TIME_ENTRIES,
  DEMO_TODAY,
  DEMO_WEEK,
  DEMO_WORKDAY_MINUTES,
} from "./week-fixtures";
import { buildWeekGrid } from "./week-grid";
import { type WriteRequest, weekMachine } from "./week-machine";

const OGF_MONDAY = "1:2026-07-27";
const OGF_FRIDAY = "1:2026-07-31";
const HARTPRINT_MONDAY = "2:2026-07-27";

function modelWith(timeEntries = DEMO_TIME_ENTRIES, week = DEMO_WEEK) {
  return buildWeekGrid({
    clients: DEMO_CLIENTS,
    timeEntries,
    today: DEMO_TODAY,
    week,
    weekendShown: false,
  });
}

let writes: WriteRequest[] = [];
let writeResult: boolean | Error = true;

function start(timeEntries = DEMO_TIME_ENTRIES): Actor<typeof weekMachine> {
  const actor = createActor(
    weekMachine.provide({
      actors: {
        write: fromPromise<boolean, WriteRequest>(({ input }) => {
          writes.push(input);

          return writeResult instanceof Error
            ? Promise.reject(writeResult)
            : Promise.resolve(writeResult);
        }),
      },
    }),
    {
      input: {
        model: modelWith(timeEntries),
        workdayMinutes: DEMO_WORKDAY_MINUTES,
      },
    },
  );

  actor.start();

  return actor;
}

/** Let the invoked write settle. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  writes = [];
  writeResult = true;
});

it("starts on today's column of the first row, browsing", () => {
  const snapshot = start().getSnapshot();

  // Rows sort billable-first then by client name, so HartPrint leads.
  expect(snapshot.value).toBe("browsing");
  expect(snapshot.context.focusedKey).toBe("2:2026-07-30");
});

it("never lands the tab stop on the collapsed weekend", () => {
  const actor = start();

  actor.send({ type: "FOCUS", key: OGF_FRIDAY });
  actor.send({
    ctrlKey: false,
    from: OGF_FRIDAY,
    key: "ArrowRight",
    type: "NAVIGATE",
  });

  expect(actor.getSnapshot().context.focusedKey).toBe(OGF_FRIDAY);
});

it("moves the tab stop back into the model when its cell is gone", () => {
  const actor = start();

  actor.send({ key: OGF_MONDAY, type: "FOCUS" });
  // Changing week retires every key: the dates are all different.
  actor.send({
    model: modelWith([], "2026-W32"),
    type: "MODEL",
    workdayMinutes: DEMO_WORKDAY_MINUTES,
  });

  const { context } = actor.getSnapshot();

  expect(context.focusedKey).not.toBeNull();
  expect(context.focusedKey).not.toBe(OGF_MONDAY);
});

it("seeds the editor from a typed digit and keeps the caret after it", () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, seed: "1", type: "EDIT" });

  const snapshot = actor.getSnapshot();

  expect(snapshot.value).toBe("editing");
  expect(snapshot.context.draft).toBe("1");
  expect(snapshot.context.caret).toBe("end");
});

it("selects an existing value so typing replaces it", () => {
  const actor = start();

  actor.send({ key: OGF_MONDAY, type: "EDIT" });

  const snapshot = actor.getSnapshot();

  expect(snapshot.context.draft).toBe("1");
  expect(snapshot.context.caret).toBe("select");
});

it("ignores a click that comes from inside its own editor", () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, seed: "1", type: "EDIT" });
  actor.send({ draft: "0,5", type: "CHANGE" });
  actor.send({ key: OGF_MONDAY, type: "ACTIVATE" });

  expect(actor.getSnapshot().context.draft).toBe("0,5");
});

it("opens the popover instead of the editor when a cell holds several entries", () => {
  const twice = [
    { ...DEMO_TIME_ENTRIES[0], id: 91, valuedDayFraction: 0.5 },
    { ...DEMO_TIME_ENTRIES[0], id: 92, valuedDayFraction: 0.5 },
  ];
  const actor = start(twice);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });

  expect(actor.getSnapshot().value).toBe("labelling");
});

it("keeps an unparseable draft on screen and writes nothing", () => {
  const actor = start();

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "beaucoup", type: "CHANGE" });
  actor.send({ move: "stay", type: "COMMIT" });

  const snapshot = actor.getSnapshot();

  expect(snapshot.value).toBe("editing");
  expect(snapshot.context.draft).toBe("beaucoup");
  expect(snapshot.context.error).toMatch(/Format/);
  expect(writes).toHaveLength(0);
});

it("tells a too-long duration apart from a malformed one", () => {
  const actor = start();

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "4", type: "CHANGE" });
  actor.send({ move: "stay", type: "COMMIT" });

  expect(actor.getSnapshot().context.error).toMatch(/24 heures/);
});

it("writes nothing when the duration is unchanged", () => {
  const actor = start();

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ move: "stay", type: "COMMIT" });

  expect(actor.getSnapshot().value).toBe("browsing");
  expect(writes).toHaveLength(0);
});

it("creates in the row's own unit", () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "0,5", type: "CHANGE" });
  actor.send({ move: "stay", type: "COMMIT" });

  expect(writes).toEqual([
    {
      cellKey: OGF_MONDAY,
      date: "2026-07-27",
      durationMinutes: 210,
      kind: "create",
      missionId: 1,
    },
  ]);
});

it("reads a bare number as hours on an hourly row", () => {
  const actor = start([]);

  actor.send({ key: HARTPRINT_MONDAY, type: "EDIT" });
  actor.send({ draft: "2", type: "CHANGE" });
  actor.send({ move: "stay", type: "COMMIT" });

  expect(writes[0]).toMatchObject({ durationMinutes: 120, kind: "create" });
});

it("writes once when the blur lands after the commit", async () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "1", type: "CHANGE" });
  actor.send({ move: "stay", type: "COMMIT" });
  // Closing the editor moves focus, which blurs the input. The machine has
  // already left `editing`, so there is nothing left to commit.
  actor.send({ type: "BLUR" });
  await settle();

  expect(writes).toHaveLength(1);
});

it("commits the draft when the editor is blurred", () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "0,5", type: "CHANGE" });
  actor.send({ type: "BLUR" });

  expect(writes[0]).toMatchObject({ durationMinutes: 210, kind: "create" });
});

it("keeps an unparseable draft on screen when the editor is blurred", () => {
  const actor = start();

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "beaucoup", type: "CHANGE" });
  actor.send({ type: "BLUR" });

  expect(actor.getSnapshot().value).toBe("editing");
  expect(writes).toHaveLength(0);
});

it("does not name the activity after a blur — only Enter asks", async () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "1", type: "CHANGE" });
  actor.send({ type: "BLUR" });
  await settle();

  expect(actor.getSnapshot().value).toBe("browsing");
});

it("asks for the activity once the created entry reaches the model", async () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "1", type: "CHANGE" });
  actor.send({ move: "stay", type: "COMMIT" });
  await settle();

  expect(actor.getSnapshot().value).toBe("awaitingEntry");

  actor.send({
    model: modelWith(),
    type: "MODEL",
    workdayMinutes: DEMO_WORKDAY_MINUTES,
  });

  expect(actor.getSnapshot().value).toBe("labelling");
});

it("never asks for the activity when the write is refused", async () => {
  writeResult = new Error("422");
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "1", type: "CHANGE" });
  actor.send({ move: "stay", type: "COMMIT" });
  await settle();

  expect(actor.getSnapshot().value).toBe("browsing");

  // The entry arriving later from any other path must not pop it open.
  actor.send({
    model: modelWith(),
    type: "MODEL",
    workdayMinutes: DEMO_WORKDAY_MINUTES,
  });

  expect(actor.getSnapshot().value).toBe("browsing");
});

it("does not interrupt the fill-the-week path when Tab commits", async () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "1", type: "CHANGE" });
  actor.send({ move: "right", type: "COMMIT" });
  await settle();

  expect(actor.getSnapshot().value).toBe("browsing");
});

it("moves the tab stop one column right when Tab commits", () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "1", type: "CHANGE" });
  actor.send({ move: "right", type: "COMMIT" });

  expect(actor.getSnapshot().context.focusedKey).toBe("1:2026-07-28");
});

it("marks a whole day in one keystroke, and unmarks it on the next", () => {
  const empty = start([]);

  empty.send({ key: OGF_MONDAY, type: "TOGGLE_DAY" });

  expect(writes[0]).toMatchObject({
    durationMinutes: DEMO_WORKDAY_MINUTES,
    kind: "create",
  });

  const full = start();
  full.send({ key: OGF_MONDAY, type: "TOGGLE_DAY" });

  expect(writes[1]).toMatchObject({ entryIds: [1], kind: "clear" });
});

it("opens the editor rather than toggling on an hourly row", () => {
  const actor = start([]);

  actor.send({ key: HARTPRINT_MONDAY, type: "TOGGLE_DAY" });

  expect(actor.getSnapshot().value).toBe("editing");
  expect(writes).toHaveLength(0);
});

it("clears every entry in the cell", () => {
  const actor = start();

  actor.send({ key: OGF_MONDAY, type: "CLEAR" });

  expect(writes[0]).toMatchObject({ entryIds: [1], kind: "clear" });
});

it("returns focus to the cell when the editor is cancelled", () => {
  const actor = start();
  const before = actor.getSnapshot().context.focusRequest;

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ type: "CANCEL" });

  const { context, value } = actor.getSnapshot();

  expect(value).toBe("browsing");
  expect(context.focusedKey).toBe(OGF_MONDAY);
  expect(context.focusRequest).toBeGreaterThan(before);
});

it("returns focus to the cell when the popover closes", () => {
  const actor = start();

  actor.send({ key: OGF_MONDAY, type: "LABEL" });
  actor.send({ type: "CLOSE" });

  expect(actor.getSnapshot().value).toBe("browsing");
  expect(actor.getSnapshot().context.focusedKey).toBe(OGF_MONDAY);
});

it("refuses to open the popover on an empty cell", () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "LABEL" });

  expect(actor.getSnapshot().value).toBe("browsing");
});

it("forgets the draft when it returns to browsing", () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, seed: "9", type: "EDIT" });
  actor.send({ type: "CANCEL" });

  const { context } = actor.getSnapshot();

  expect(context.draft).toBe("");
  expect(context.targetKey).toBeNull();
  expect(context.request).toBeNull();
});

it("has no write of its own — the route provides one", async () => {
  // Unprovided, the write actor rejects, which exercises the same onError path
  // a refused request takes.
  const bare = createActor(weekMachine, {
    input: { model: modelWith([]), workdayMinutes: DEMO_WORKDAY_MINUTES },
  });

  bare.start();
  bare.send({ key: OGF_MONDAY, type: "TOGGLE_DAY" });

  expect(bare.getSnapshot().value).toBe("saving");

  await settle();

  expect(bare.getSnapshot().value).toBe("browsing");
});

it("stays usable while a write is in flight", async () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "TOGGLE_DAY" });

  expect(actor.getSnapshot().value).toBe("saving");

  // The fill-the-week path must not stall behind the server.
  actor.send({ key: HARTPRINT_MONDAY, seed: "2", type: "EDIT" });

  const snapshot = actor.getSnapshot();

  expect(snapshot.value).toBe("editing");
  expect(snapshot.context.draft).toBe("2");

  await settle();
});

it("drops the activity follow-up when the user moves on mid-write", async () => {
  const actor = start([]);

  actor.send({ key: OGF_MONDAY, type: "EDIT" });
  actor.send({ draft: "1", type: "CHANGE" });
  actor.send({ move: "stay", type: "COMMIT" });
  // Moving to another cell before the create lands cancels the popover.
  actor.send({ key: HARTPRINT_MONDAY, type: "EDIT" });
  await settle();

  actor.send({
    model: modelWith(),
    type: "MODEL",
    workdayMinutes: DEMO_WORKDAY_MINUTES,
  });

  expect(actor.getSnapshot().value).toBe("editing");
});
