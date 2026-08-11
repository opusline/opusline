import { beforeEach, expect, it } from "vitest";
import { type Actor, createActor } from "xstate";

import { timerMachine } from "./timer-machine";

let timer: Actor<typeof timerMachine>;

beforeEach(() => {
  timer = createActor(timerMachine).start();
});

it("opens the mission picker and closes it again", () => {
  timer.send({ type: "OPEN_START" });
  expect(timer.getSnapshot().matches("start")).toBe(true);

  timer.send({ type: "CLOSE" });
  expect(timer.getSnapshot().matches("closed")).toBe(true);
});

it("closes the picker as soon as a mission is chosen", () => {
  timer.send({ type: "OPEN_START" });
  timer.send({ type: "PICK", missionId: 1 });

  expect(timer.getSnapshot().matches("closed")).toBe(true);
});

it("requires a confirmation before discarding", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  timer.send({ type: "DISCARD" });

  expect(timer.getSnapshot().matches({ detail: "confirming" })).toBe(true);

  timer.send({ type: "CANCEL" });
  expect(timer.getSnapshot().matches({ detail: "viewing" })).toBe(true);
});

it("closes everything once the discard is confirmed", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  timer.send({ type: "DISCARD" });
  timer.send({ type: "CONFIRM_DISCARD" });

  expect(timer.getSnapshot().matches("closed")).toBe(true);
});

it("sends a failed start back to the picker", () => {
  timer.send({ type: "OPEN_START" });
  timer.send({ type: "PICK", missionId: 1 });
  timer.send({
    type: "FAILED",
    hasTimer: false,
    message: "Mission introuvable.",
  });

  const snapshot = timer.getSnapshot();

  expect(snapshot.matches("start")).toBe(true);
  expect(snapshot.context.error).toBe("Mission introuvable.");
});

it("surfaces a failure on a running timer in the detail popover", () => {
  timer.send({ type: "FAILED", hasTimer: true, message: "Échec de la pause." });

  const snapshot = timer.getSnapshot();

  expect(snapshot.matches({ detail: "viewing" })).toBe(true);
  expect(snapshot.context.error).toBe("Échec de la pause.");
});

it("clears the error once something succeeds", () => {
  timer.send({ type: "FAILED", hasTimer: true, message: "Échec." });
  timer.send({ type: "SETTLED" });

  expect(timer.getSnapshot().context.error).toBeNull();
});

it("closes a stale stop dialog when the timer is gone", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  timer.send({ type: "OPEN_STOP" });
  expect(timer.getSnapshot().matches("stopping")).toBe(true);

  timer.send({ type: "TIMER_GONE" });
  expect(timer.getSnapshot().matches("closed")).toBe(true);
});

it("keeps the rounding choice while the dialog is open", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "SELECT_ROUNDING", key: "1-day" });

  expect(timer.getSnapshot().context.stopChoice).toBe("1-day");
});

it("forgets the rounding choice when the dialog is reopened", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "SELECT_ROUNDING", key: "1-day" });
  timer.send({ type: "CLOSE" });
  timer.send({ type: "OPEN_STOP" });

  expect(timer.getSnapshot().context.stopChoice).toBeNull();
});

it("carries the note typed in the popover into the stop dialog", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  timer.send({ type: "CHANGE_NOTE", note: "Revue PR" });
  timer.send({ type: "OPEN_STOP" });

  expect(timer.getSnapshot().context.noteDraft).toBe("Revue PR");
});

it("starts the next timer with nothing left over from the last one", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  timer.send({ type: "CHANGE_NOTE", note: "Revue PR" });
  timer.send({ type: "DISMISS_IDLE", lastActivityAt: 1_000 });
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "SAVED" });

  expect(timer.getSnapshot().context).toEqual({
    billable: true,
    correctedMinutes: null,
    correctionDraft: "",
    dismissedIdleAt: null,
    error: null,
    keptLongRun: false,
    noteDraft: "",
    stopChoice: null,
  });
});

it("closes the detail popover when the chevron is pressed again", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  expect(timer.getSnapshot().matches("detail")).toBe(true);

  timer.send({ type: "TOGGLE_DETAIL" });
  expect(timer.getSnapshot().matches("closed")).toBe(true);
});

it("opens the stop dialog straight from the chip", () => {
  timer.send({ type: "OPEN_STOP" });

  expect(timer.getSnapshot().matches("stopping")).toBe(true);
});

it("puts everything away when the stop dialog is cancelled", () => {
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "CLOSE" });

  expect(timer.getSnapshot().matches("closed")).toBe(true);
});

it("closes rather than reopening the detail popover behind the dialog", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "CLOSE" });

  expect(timer.getSnapshot().matches("closed")).toBe(true);
});

it("still toggles the chevron after the stop dialog has been cancelled", () => {
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "CLOSE" });

  timer.send({ type: "TOGGLE_DETAIL" });
  expect(timer.getSnapshot().matches("detail")).toBe(true);

  timer.send({ type: "TOGGLE_DETAIL" });
  expect(timer.getSnapshot().matches("closed")).toBe(true);
});

it("reaches the mission picker even from the stop dialog", () => {
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "OPEN_START" });

  expect(timer.getSnapshot().matches("start")).toBe(true);
});

it("reaches the mission picker even from the detail popover", () => {
  timer.send({ type: "TOGGLE_DETAIL" });
  timer.send({ type: "OPEN_START" });

  expect(timer.getSnapshot().matches("start")).toBe(true);
});

it("keeps the stop dialog open when the save is refused", () => {
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "SELECT_ROUNDING", key: "exact" });
  timer.send({ type: "FAILED", hasTimer: true, message: "Note trop longue." });

  const snapshot = timer.getSnapshot();

  expect(snapshot.matches("stopping")).toBe(true);
  expect(snapshot.context.stopChoice).toBe("exact");
  expect(snapshot.context.error).toBe("Note trop longue.");
});

it("starts each stop dialog billable, whatever the last one chose", () => {
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "SET_BILLABLE", billable: false });
  timer.send({ type: "SAVED" });

  timer.send({ type: "OPEN_STOP" });

  expect(timer.getSnapshot().context.billable).toBe(true);
});

it("stops asking about a long run once the user says it is deliberate", () => {
  timer.send({ type: "KEEP_LONG_RUN" });

  expect(timer.getSnapshot().context.keptLongRun).toBe(true);
});

it("keeps the corrected duration and the text behind it", () => {
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "CORRECT_DURATION", draft: "3:30", minutes: 210 });

  const { context } = timer.getSnapshot();

  expect(context.correctedMinutes).toBe(210);
  expect(context.correctionDraft).toBe("3:30");
});

/** A half-typed "3:" must survive rather than snapping back. */
it("keeps unparseable text without a duration behind it", () => {
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "CORRECT_DURATION", draft: "3:", minutes: null });

  const { context } = timer.getSnapshot();

  expect(context.correctedMinutes).toBeNull();
  expect(context.correctionDraft).toBe("3:");
});

it("forgets the correction when the dialog is reopened", () => {
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "CORRECT_DURATION", draft: "3:30", minutes: 210 });
  timer.send({ type: "CLOSE" });
  timer.send({ type: "OPEN_STOP" });

  expect(timer.getSnapshot().context.correctedMinutes).toBeNull();
});

it("asks again about a long run once a new timer is started", () => {
  timer.send({ type: "KEEP_LONG_RUN" });
  timer.send({ type: "OPEN_STOP" });
  timer.send({ type: "SAVED" });

  expect(timer.getSnapshot().context.keptLongRun).toBe(false);
});
