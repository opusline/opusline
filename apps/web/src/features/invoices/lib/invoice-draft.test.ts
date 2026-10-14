import { describe, expect, it } from "vitest";

import {
  canImportTime,
  draftPayload,
  dueDate,
  freeLine,
  newInvoiceDraft,
  withoutLine,
  withTimeImported,
  withTimeReleased,
} from "./invoice-draft";
import { editorUnbilledTime } from "./invoice-editor-fixture";
import { invoicingSettingsFixture } from "./invoicing-settings-fixture";

const FORMAT = { locale: "fr-FR", currency: "EUR" } as const;

function draft() {
  return {
    ...newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture),
    clientId: 1,
  };
}

describe("draftPayload", () => {
  it("waits for a client", () => {
    expect(
      draftPayload(
        FORMAT,
        newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture),
      ),
    ).toBeNull();
  });

  it("reads quantities to the thousandth and prices to the cent", () => {
    const line = {
      ...freeLine(2000),
      label: " Recette ",
      quantity: "1,5",
      unitPrice: "-480,5",
    };
    const body = draftPayload(FORMAT, { ...draft(), lines: [line] });

    expect(body?.lines).toEqual([
      {
        label: "Recette",
        detail: null,
        quantityMilli: 1500,
        unit: 0,
        unitPrice: { amount: -48_050, currency: "EUR" },
        vatRateBp: 2000,
      },
    ]);
  });

  it("leaves unfinished lines out of the preview", () => {
    const body = draftPayload(FORMAT, {
      ...draft(),
      lines: [{ ...freeLine(0), label: "À chiffrer" }],
    });

    expect(body?.lines).toEqual([]);
  });

  it("states no penalty rate when the field is empty", () => {
    expect(
      draftPayload(FORMAT, { ...draft(), latePenaltyRate: "" })
        ?.latePenaltyRateBp,
    ).toBeNull();
    expect(
      draftPayload(FORMAT, { ...draft(), latePenaltyRate: "12,4" })
        ?.latePenaltyRateBp,
    ).toBe(1240);
  });
});

describe("dueDate", () => {
  it("counts net days from the issue date", () => {
    expect(dueDate("2026-10-14", "30")).toBe("2026-11-13");
  });

  it("runs « fin de mois » from the issue month's last day", () => {
    expect(dueDate("2026-10-14", "0fm")).toBe("2026-10-31");
    expect(dueDate("2026-10-14", "45fm")).toBe("2026-12-15");
  });
});

describe("tracked time", () => {
  it("imports the mission's time as one line, once", () => {
    const imported = withTimeImported(FORMAT, draft(), editorUnbilledTime, {
      vatRateBp: 0,
      detail: "",
    });

    expect(imported.lines).toHaveLength(1);
    expect(imported.lines[0]).toMatchObject({
      label: "Refonte catalogue",
      quantity: "12,5",
      unitPrice: "550",
    });
    expect(imported.timeEntryIds).toEqual([101, 102, 103]);
    expect(imported.periodStart).toBe("2026-09-01");
    expect(canImportTime(imported)).toBe(false);
  });

  it("releases the time with the line it was imported on", () => {
    const imported = withTimeImported(FORMAT, draft(), editorUnbilledTime, {
      vatRateBp: 0,
      detail: "",
    });
    const key = imported.lines[0]?.key ?? "";

    expect(withoutLine(imported, key).timeEntryIds).toEqual([]);
  });

  it("keeps the time when another line goes", () => {
    const other = freeLine(0);
    const imported = withTimeImported(
      FORMAT,
      { ...draft(), lines: [other] },
      editorUnbilledTime,
      { vatRateBp: 0, detail: "" },
    );

    expect(withoutLine(imported, other.key).timeEntryIds).toHaveLength(3);
    expect(withTimeReleased(imported).timeEntryIds).toEqual([]);
  });
});
