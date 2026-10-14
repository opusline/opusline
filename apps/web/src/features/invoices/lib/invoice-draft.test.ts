import { describe, expect, it } from "vitest";

import { formatQuantityDraft } from "@/lib/billing";
import { clientWithMissions } from "@/test/fixtures";
import { documentDetail } from "./invoice-document-fixture";
import {
  canImportTime,
  draftPayload,
  dueDate,
  duplicateDraft,
  freeLine,
  newInvoiceDraft,
  withClient,
  withMission,
  withoutLine,
  withTimeImported,
  withTimeReleased,
} from "./invoice-draft";
import { editorClients, editorUnbilledTime } from "./invoice-editor-fixture";
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

describe("quantities", () => {
  it("keeps three decimals while typing", () => {
    expect(formatQuantityDraft("fr-FR", "0,125")).toBe("0,125");
    expect(formatQuantityDraft("fr-FR", "0,3334")).toBe("0,333");
    expect(formatQuantityDraft("en-US", "0.001")).toBe("0.001");
  });
});

describe("withClient", () => {
  const sixtyDays = clientWithMissions({
    id: 7,
    slug: "lunaprint",
    name: "Lunaprint",
    paymentTermsDays: 60,
  });
  const defaultTerm = clientWithMissions({
    id: 8,
    slug: "orvella",
    name: "Orvella",
    paymentTermsDays: invoicingSettingsFixture.defaultPaymentTermsDays,
  });

  it("takes the client's own term, then the account default again", () => {
    const first = withClient(draft(), sixtyDays, invoicingSettingsFixture);
    expect(first.paymentTerm).toBe("60");

    const second = withClient(first, defaultTerm, invoicingSettingsFixture);
    expect(second.paymentTerm).toBe(
      newInvoiceDraft(FORMAT.locale, invoicingSettingsFixture).paymentTerm,
    );
  });

  it("releases imported time when the client no longer owns the mission", () => {
    const imported = withTimeImported(
      FORMAT,
      { ...draft(), missionId: editorUnbilledTime.missionId },
      editorUnbilledTime,
      { vatRateBp: 0, detail: "" },
    );

    const moved = withClient(imported, sixtyDays, invoicingSettingsFixture);

    expect(moved.missionId).toBeNull();
    expect(moved.timeEntryIds).toEqual([]);
    expect(moved.lines).toHaveLength(0);
  });
});

describe("withMission", () => {
  it("gives the time back with its line when the mission changes", () => {
    const imported = withTimeImported(
      FORMAT,
      { ...draft(), missionId: editorUnbilledTime.missionId },
      editorUnbilledTime,
      { vatRateBp: 0, detail: "" },
    );

    const changed = withMission(imported, 99);

    expect(changed.missionId).toBe(99);
    expect(changed.timeEntryIds).toEqual([]);
    expect(changed.lines).toHaveLength(0);
    expect(canImportTime(changed)).toBe(true);
  });

  it("keeps a reopened draft's time when the mission stays", () => {
    const reopened = {
      ...draft(),
      missionId: editorClients[0]?.missions[0]?.id ?? null,
      timeEntryIds: [101],
    };

    expect(withMission(reopened, reopened.missionId)).toBe(reopened);
  });
});

describe("duplicateDraft", () => {
  it("copies the lines but neither the period nor the tracked time", () => {
    const source = documentDetail({
      periodStart: "2026-09-01",
      periodEnd: "2026-09-30",
    });
    const copy = duplicateDraft(FORMAT, {
      ...source,
      content: source.content && { ...source.content, timeEntryIds: [5, 6] },
    });

    expect(copy?.lines.map((line) => line.label)).toEqual([
      "Atelier de cadrage",
    ]);
    expect(copy?.periodStart).toBe("");
    expect(copy?.timeEntryIds).toEqual([]);
  });
});
