import type {
  ClientWithMissionsData,
  MissionData,
  TimeEntryData,
} from "@opusline/api-client";
import { describe, expect, it } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import { buildWeekGrid, shouldShowWeekend } from "./week-grid";

const WEEK = "2026-W31";
const MONDAY = "2026-07-27";
const SATURDAY = "2026-08-01";

function mission(overrides: Partial<MissionData> = {}): MissionData {
  return {
    id: 1,
    slug: "callisto-front",
    clientId: 1,
    name: "Callisto front",
    endClientName: null,
    billingMode: 0,
    rate: { amount: 55_000, currency: "EUR" },
    rounding: 0,
    status: 0,
    craRequired: false,
    color: null,
    notes: null,
    startDate: null,
    endDate: null,
    ...overrides,
  };
}

function client(
  overrides: Partial<ClientWithMissionsData> = {},
): ClientWithMissionsData {
  return {
    id: 1,
    slug: "nordlys",
    name: "Nordlys",
    type: 0,
    notes: null,
    siret: null,
    vatNumber: null,
    vatTreatment: 0,
    billingAddressLine1: null,
    billingAddressLine2: null,
    billingPostalCode: null,
    billingCity: null,
    billingCountry: null,
    billingContactName: null,
    billingEmail: null,
    color: 4,
    paymentTermsDays: 45,
    archivedAt: null,
    createdAt: "2026-01-01T00:00:00+00:00",
    missions: [mission()],
    ...overrides,
  };
}

function entry(overrides: Partial<TimeEntryData> = {}): TimeEntryData {
  return {
    id: 1,
    missionId: 1,
    billable: true,
    date: MONDAY,
    durationMinutes: 420,
    valuedMinutes: null,
    rounding: null,
    valuedDayFraction: 1,
    note: null,
    ...overrides,
  };
}

function build(input: {
  clients: ClientWithMissionsData[];
  timeEntries?: TimeEntryData[];
  weekendShown?: boolean;
  liveMissionId?: number | null;
}) {
  return buildWeekGrid({
    format: DEFAULT_MONEY_FORMAT,
    clients: input.clients,
    liveMissionId: input.liveMissionId ?? null,
    timeEntries: input.timeEntries ?? [],
    week: WEEK,
    today: MONDAY,
    weekendShown: input.weekendShown ?? false,
  });
}

describe("columns", () => {
  it("folds the weekend into a single sliver when it is hidden", () => {
    const { columns } = build({ clients: [client()] });

    expect(columns).toHaveLength(6);
    expect(columns[5]).toEqual({
      kind: "collapsed-weekend",
      dates: [SATURDAY, "2026-08-02"],
    });
  });

  it("gives Saturday and Sunday their own columns when shown", () => {
    const { columns } = build({ clients: [client()], weekendShown: true });

    expect(columns).toHaveLength(7);
    expect(columns[6]).toMatchObject({ date: "2026-08-02", isWeekend: true });
  });

  it("marks today", () => {
    const { columns } = build({ clients: [client()] });

    expect(columns[0]).toMatchObject({
      date: MONDAY,
      dayOfMonth: "27",
      isToday: true,
      weekdayLabel: "lun",
    });
    expect(columns[1]).toMatchObject({ isToday: false });
  });
});

describe("rows", () => {
  it("keeps a paused mission that already has entries this week", () => {
    const { rows } = build({
      clients: [client({ missions: [mission({ status: 1 })] })],
      timeEntries: [entry()],
    });

    expect(rows).toHaveLength(1);
  });

  it("drops a paused mission with no entries this week", () => {
    const { rows } = build({
      clients: [client({ missions: [mission({ status: 1 })] })],
    });

    expect(rows).toHaveLength(0);
  });

  it("keeps an archived client's mission when it has entries this week", () => {
    const { rows } = build({
      clients: [client({ archivedAt: "2026-06-01T00:00:00+00:00" })],
      timeEntries: [entry()],
    });

    expect(rows).toHaveLength(1);
  });

  it("falls back to the client colour when the mission has none", () => {
    const { rows } = build({ clients: [client()] });

    expect(rows[0].colorClass).toBe("bg-palette-slate");
  });

  it("prefers the mission colour over the client's", () => {
    const { rows } = build({
      clients: [client({ missions: [mission({ color: 3 })] })],
    });

    expect(rows[0].colorClass).toBe("bg-palette-sage");
  });

  it("describes the mission by client type and rate", () => {
    const { rows } = build({ clients: [client()] });

    expect(rows[0].subtitle).toBe("Client direct · 550 €/j");
  });

  it("marks a mission with no rate as non-billable", () => {
    const { rows } = build({
      clients: [client({ missions: [mission({ rate: null })] })],
    });

    expect(rows[0].hasRate).toBe(false);
    expect(rows[0].subtitle).toBe("Client direct · non facturable");
  });

  it("sorts billable missions before non-billable ones", () => {
    const { rows } = build({
      clients: [
        client({
          missions: [
            mission({ id: 2, name: "Opusline", rate: null, slug: "opusline" }),
            mission(),
          ],
        }),
      ],
    });

    expect(rows.map((row) => row.name)).toEqual(["Callisto front", "Opusline"]);
  });

  it("gives every row one cell per column", () => {
    const { columns, rows } = build({ clients: [client()] });

    expect(rows[0].cells).toHaveLength(columns.length);
  });
});

describe("cells", () => {
  it("sums the entries sharing a mission and a day", () => {
    const { rows } = build({
      clients: [client()],
      timeEntries: [
        entry({ id: 1, valuedDayFraction: 0.5 }),
        entry({ id: 2, valuedDayFraction: 0.5 }),
      ],
    });

    expect(rows[0].cells[0].entries).toHaveLength(2);
    expect(rows[0].cells[0].billedLabel).toBe("1 j");
  });

  it("marks a cell non-billable when its entry was taken off the invoice", () => {
    const { rows } = build({
      clients: [client()],
      timeEntries: [entry({ billable: false })],
    });

    expect(rows[0].cells[0].isInvoiced).toBe(false);
    // The mission still bills; this entry simply does not.
    expect(rows[0].hasRate).toBe(true);
  });

  it("only surfaces a note when the cell holds a single entry", () => {
    const { rows } = build({
      clients: [client()],
      timeEntries: [
        entry({ id: 1, note: "Revue PR", valuedDayFraction: 0.5 }),
        entry({ id: 2, note: "Cadrage", valuedDayFraction: 0.5 }),
      ],
    });

    expect(rows[0].cells[0].note).toBeNull();
  });

  it("labels an hourly cell in hours", () => {
    const { rows } = build({
      clients: [client({ missions: [mission({ billingMode: 1 })] })],
      timeEntries: [
        entry({
          valuedDayFraction: null,
          valuedMinutes: 90,
          durationMinutes: 90,
        }),
      ],
    });

    expect(rows[0].cells[0].billedLabel).toBe("1,5 h");
  });

  it("leaves an empty cell unlabelled", () => {
    const { rows } = build({ clients: [client()] });

    expect(rows[0].cells[0].billedLabel).toBe("");
  });
});

describe("totals", () => {
  it("totals a row in the mission's own unit", () => {
    const { rows } = build({
      clients: [client()],
      timeEntries: [
        entry({ id: 1, valuedDayFraction: 1 }),
        entry({ id: 2, date: "2026-07-28", valuedDayFraction: 0.5 }),
      ],
    });

    expect(rows[0].totalLabel).toBe("1,5 j");
  });

  it("puts both units side by side when a day mixes them", () => {
    const { dayTotals, weekTotal } = build({
      clients: [
        client({
          missions: [
            mission(),
            mission({
              id: 2,
              billingMode: 1,
              name: "Vesterhus",
              slug: "vesterhus",
            }),
          ],
        }),
      ],
      timeEntries: [
        entry({ id: 1, valuedDayFraction: 1 }),
        entry({
          id: 2,
          missionId: 2,
          durationMinutes: 120,
          valuedDayFraction: null,
          valuedMinutes: 120,
        }),
      ],
    });

    expect(dayTotals[0]).toBe("1 j · 2 h");
    expect(weekTotal).toBe("1 j · 2 h");
  });

  it("leaves non-billable time out of the day and week figures", () => {
    const { rows, dayTotals, weekTotal } = build({
      clients: [
        client({
          missions: [
            mission(),
            mission({
              id: 2,
              billingMode: 1,
              name: "Perso",
              rate: null,
              slug: "perso",
            }),
          ],
        }),
      ],
      timeEntries: [
        entry({ id: 1, valuedDayFraction: 1 }),
        entry({
          id: 2,
          missionId: 2,
          durationMinutes: 120,
          valuedDayFraction: null,
          valuedMinutes: 120,
        }),
      ],
    });

    // The row still reports its own time; only the billed aggregates skip it.
    expect(rows[1].totalLabel).toBe("2 h");
    expect(dayTotals[0]).toBe("1 j");
    expect(weekTotal).toBe("1 j");
  });

  it("leaves time taken off the invoice out of the day and week figures", () => {
    const { rows, dayTotals, weekTotal } = build({
      clients: [client()],
      timeEntries: [
        entry({ id: 1, valuedDayFraction: 1 }),
        entry({
          id: 2,
          date: "2026-07-28",
          billable: false,
          valuedDayFraction: 0.5,
        }),
      ],
    });

    // The row still reports every hour it tracked; only the billed aggregates
    // skip the entry that will not reach an invoice.
    expect(rows[0].totalLabel).toBe("1,5 j");
    expect(dayTotals[1]).toBe("");
    expect(weekTotal).toBe("1 j");
  });

  it("leaves an empty day blank", () => {
    const { dayTotals } = build({ clients: [client()] });

    expect(dayTotals[0]).toBe("");
  });
});

describe("shouldShowWeekend", () => {
  it("stays open once the user opened it", () => {
    expect(shouldShowWeekend(true, WEEK, [])).toBe(true);
  });

  it("opens itself rather than hide a weekend entry", () => {
    expect(shouldShowWeekend(false, WEEK, [entry({ date: SATURDAY })])).toBe(
      true,
    );
  });

  it("stays collapsed when the weekend is empty", () => {
    expect(shouldShowWeekend(false, WEEK, [entry()])).toBe(false);
  });

  /** A Saturday timer must not be hidden behind the collapsed weekend column. */
  it("opens itself for a timer running on a weekend day", () => {
    expect(shouldShowWeekend(false, WEEK, [], SATURDAY)).toBe(true);
  });

  it("stays collapsed for a timer running on a weekday", () => {
    expect(shouldShowWeekend(false, WEEK, [], MONDAY)).toBe(false);
  });
});

describe("a timer running on a week with no entries", () => {
  const paused = () => client({ missions: [mission({ id: 7, status: 1 })] });

  /*
   * A paused mission builds no row of its own, so without the timer's mission
   * id the provisional pill would have nowhere to render.
   */
  it("builds a row for the tracked mission even when it is paused", () => {
    const { rows } = build({ clients: [paused()], liveMissionId: 7 });

    expect(rows.map((row) => row.missionId)).toContain(7);
  });

  it("builds no such row when no timer is running", () => {
    const { rows } = build({ clients: [paused()] });

    expect(rows.map((row) => row.missionId)).not.toContain(7);
  });

  it("gives that row a Saturday cell once the weekend is shown", () => {
    const { rows } = build({
      clients: [paused()],
      liveMissionId: 7,
      weekendShown: true,
    });

    const cells = rows.find((row) => row.missionId === 7)?.cells ?? [];

    expect(cells.map((cell) => cell.date)).toContain(SATURDAY);
  });
});
