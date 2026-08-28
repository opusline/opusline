import type {
  DeadlineInvoiceData,
  DeadlineItemData,
} from "@opusline/api-client";
import { expect, it } from "vitest";

import { eur, fiscalDeadlineItem } from "@/test/fixtures";

import { deadlineRowTone } from "./rows";

const TODAY = "2026-08-13";

it.each([
  ["2026-08-12", "late"],
  ["2026-08-13", "action"],
  ["2026-08-20", "action"],
  ["2026-08-21", "quiet"],
  ["2026-12-15", "quiet"],
])("tones a fiscal line due %s as %s", (dueOn, expected) => {
  expect(deadlineRowTone(fiscalDeadlineItem({ dueOn }), TODAY)).toBe(expected);
});

it("tones a settled line as done however late it was", () => {
  expect(
    deadlineRowTone(
      fiscalDeadlineItem({ dueOn: "2026-01-31", completedOn: "2026-08-01" }),
      TODAY,
    ),
  ).toBe("done");
});

it("keeps a reminder loud even before it is late", () => {
  // A relance is something to do now; a declaration is something due on a date.
  const invoice: DeadlineInvoiceData = {
    id: 28,
    number: "F-2026-028",
    clientName: "Lunaprint",
    missionName: "Refonte identité",
    periodStart: "2026-03-01",
    amount: eur(171_600),
    dueOn: "2026-12-31",
    remindersSent: 0,
    lastRemindedOn: null,
  };
  const reminder: DeadlineItemData = {
    type: 1,
    dueOn: invoice.dueOn,
    invoice,
    fiscal: null,
  };

  expect(deadlineRowTone(reminder, TODAY)).toBe("action");
});
