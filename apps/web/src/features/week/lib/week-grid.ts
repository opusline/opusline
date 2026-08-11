import type {
  BillingMode,
  ClientWithMissionsData,
  MissionData,
  TimeEntryData,
} from "@opusline/api-client";
import { formatMissionRate, missionBills } from "@/lib/billing";
import { CLIENT_TYPE_SHORT_LABELS } from "@/lib/client-types";
import {
  formatBilledDays,
  formatBilledHours,
  formatBilledTotal,
  isHourly,
} from "@/lib/durations";
import { isMissionCompleted } from "@/lib/mission-status";
import { COLOR_CLASSES } from "@/lib/palette";
import { isoWeekDates, weekdayShortLabel } from "@/lib/weeks";

import { cellAriaLabel } from "./labels";

const WEEKEND_INDEXES = [5, 6];

export type WeekColumn =
  | {
      kind: "day";
      date: string;
      weekdayLabel: string;
      dayOfMonth: string;
      isToday: boolean;
      isWeekend: boolean;
    }
  | { kind: "collapsed-weekend"; dates: string[] };

export type WeekCellEntry = {
  id: number;
  durationMinutes: number;
  billable: boolean;
  note: string | null;
};

export type WeekCell = {
  key: string;
  date: string | null;
  missionId: number;
  isWeekend: boolean;
  isToday: boolean;
  isInvoiced: boolean;
  entries: WeekCellEntry[];
  billedLabel: string;
  note: string | null;
  ariaLabel: string;
};

export type LiveCell = {
  missionId: number;
  date: string;
  billedLabel: string;
  clockLabel: string;
  isRunning: boolean;
  onStop: () => void;
};

export type WeekRow = {
  missionId: number;
  name: string;
  subtitle: string;
  colorClass: string;
  billingMode: BillingMode;
  hasRate: boolean;
  cells: WeekCell[];
  totalLabel: string;
};

export type MissionOption = {
  missionId: number;
  name: string;
  subtitle: string;
  colorClass: string;
  billingMode: BillingMode;
  hasRate: boolean;
  isInGrid: boolean;
};

export type WeekGridModel = {
  columns: WeekColumn[];
  rows: WeekRow[];
  missionOptions: MissionOption[];
  dayTotals: string[];
  weekTotal: string;
  hasEntries: boolean;
};

type MissionWithClient = {
  mission: MissionData;
  client: ClientWithMissionsData;
};

export function cellKeyFor(missionId: number, date: string): string {
  return `${missionId}:${date}`;
}

export function shouldShowWeekend(
  weekendOpen: boolean,
  week: string,
  timeEntries: TimeEntryData[],
  liveDate: string | null = null,
): boolean {
  if (weekendOpen) {
    return true;
  }

  const weekend = new Set(
    isoWeekDates(week).filter((_, index) => WEEKEND_INDEXES.includes(index)),
  );

  if (liveDate !== null && weekend.has(liveDate)) {
    return true;
  }

  return timeEntries.some((entry) => weekend.has(entry.date));
}

function buildColumns(
  week: string,
  today: string,
  weekendShown: boolean,
): WeekColumn[] {
  const dates = isoWeekDates(week);
  const weekdays = dates.filter((_, index) => !WEEKEND_INDEXES.includes(index));
  const weekend = dates.filter((_, index) => WEEKEND_INDEXES.includes(index));

  const toColumn = (date: string, isWeekend: boolean): WeekColumn => ({
    kind: "day",
    date,
    weekdayLabel: weekdayShortLabel(date),
    dayOfMonth: String(Number(date.slice(8))),
    isToday: date === today,
    isWeekend,
  });

  return [
    ...weekdays.map((date) => toColumn(date, false)),
    ...(weekendShown
      ? weekend.map((date) => toColumn(date, true))
      : [{ kind: "collapsed-weekend" as const, dates: weekend }]),
  ];
}

function billedFigure(
  total: { dayFraction: number; billedMinutes: number },
  dayBilled: boolean,
  isEmpty: boolean,
): string {
  if (isEmpty) {
    return "";
  }

  return dayBilled
    ? formatBilledDays(total.dayFraction)
    : formatBilledHours(total.billedMinutes);
}

function missionSubtitle(mission: MissionData, client: ClientWithMissionsData) {
  return `${CLIENT_TYPE_SHORT_LABELS[client.type]} · ${formatMissionRate(mission)}`;
}

function selectMissions(
  clients: ClientWithMissionsData[],
  workedMissionIds: Set<number>,
  liveMissionId: number | null,
): MissionWithClient[] {
  const selected: MissionWithClient[] = [];

  for (const client of clients) {
    for (const mission of client.missions) {
      const isActive = mission.status === 0 && client.archivedAt === null;

      if (
        isActive ||
        workedMissionIds.has(mission.id) ||
        mission.id === liveMissionId
      ) {
        selected.push({ mission, client });
      }
    }
  }

  return selected.sort((left, right) => {
    const byBillable =
      Number(missionBills(right.mission)) - Number(missionBills(left.mission));

    if (byBillable !== 0) {
      return byBillable;
    }

    return (
      left.client.name.localeCompare(right.client.name, "fr") ||
      left.mission.name.localeCompare(right.mission.name, "fr")
    );
  });
}

export function buildWeekGrid(input: {
  clients: ClientWithMissionsData[];
  timeEntries: TimeEntryData[];
  week: string;
  today: string;
  weekendShown: boolean;
  liveMissionId?: number | null;
}): WeekGridModel {
  const columns = buildColumns(input.week, input.today, input.weekendShown);

  const entriesByCell = new Map<string, TimeEntryData[]>();
  const workedMissionIds = new Set<number>();

  for (const entry of input.timeEntries) {
    const key = cellKeyFor(entry.missionId, entry.date);
    const bucket = entriesByCell.get(key);

    if (bucket === undefined) {
      entriesByCell.set(key, [entry]);
    } else {
      bucket.push(entry);
    }

    workedMissionIds.add(entry.missionId);
  }

  const dayTotals = columns.map(() => ({ dayFraction: 0, billedMinutes: 0 }));
  const weekTotal = { dayFraction: 0, billedMinutes: 0 };

  const rows = selectMissions(
    input.clients,
    workedMissionIds,
    input.liveMissionId ?? null,
  ).map(({ mission, client }) => {
    const dayBilled = !isHourly(mission.billingMode);
    const hasRate = missionBills(mission);
    const rowTotal = { dayFraction: 0, billedMinutes: 0 };

    const cells = columns.map((column, columnIndex): WeekCell => {
      const entries =
        column.kind === "day"
          ? (entriesByCell.get(cellKeyFor(mission.id, column.date)) ?? [])
          : [];

      const dayFraction = entries.reduce(
        (total, entry) => total + (entry.valuedDayFraction ?? 0),
        0,
      );
      const billedMinutes = entries.reduce(
        (total, entry) => total + (entry.valuedMinutes ?? 0),
        0,
      );

      rowTotal.dayFraction += dayFraction;
      rowTotal.billedMinutes += billedMinutes;

      if (hasRate) {
        for (const entry of entries) {
          if (!entry.billable) {
            continue;
          }

          dayTotals[columnIndex].dayFraction += entry.valuedDayFraction ?? 0;
          dayTotals[columnIndex].billedMinutes += entry.valuedMinutes ?? 0;
          weekTotal.dayFraction += entry.valuedDayFraction ?? 0;
          weekTotal.billedMinutes += entry.valuedMinutes ?? 0;
        }
      }

      const billedLabel = billedFigure(
        { billedMinutes, dayFraction },
        dayBilled,
        entries.length === 0,
      );
      const note = entries.length === 1 ? entries[0].note : null;

      return {
        key:
          column.kind === "day"
            ? cellKeyFor(mission.id, column.date)
            : `${mission.id}:weekend`,
        date: column.kind === "day" ? column.date : null,
        missionId: mission.id,
        isWeekend: column.kind === "day" ? column.isWeekend : true,
        isToday: column.kind === "day" && column.isToday,
        isInvoiced:
          hasRate && entries.every((entry) => entry.billable !== false),
        entries: entries.map((entry) => ({
          id: entry.id,
          billable: entry.billable,
          durationMinutes: entry.durationMinutes,
          note: entry.note,
        })),
        billedLabel,
        note,
        ariaLabel: cellAriaLabel({
          billedLabel,
          date: column.kind === "day" ? column.date : null,
          isEmpty: entries.length === 0,
          missionName: mission.name,
          note,
        }),
      };
    });

    return {
      missionId: mission.id,
      name: mission.name,
      subtitle: missionSubtitle(mission, client),
      colorClass: COLOR_CLASSES[mission.color ?? client.color],
      billingMode: mission.billingMode,
      hasRate,
      cells,
      totalLabel: billedFigure(
        rowTotal,
        dayBilled,
        rowTotal.dayFraction === 0 && rowTotal.billedMinutes === 0,
      ),
    };
  });

  const gridMissionIds = new Set(rows.map((row) => row.missionId));

  return {
    columns,
    rows,
    missionOptions: buildMissionOptions(input.clients, gridMissionIds),
    dayTotals: dayTotals.map(formatBilledTotal),
    weekTotal: formatBilledTotal(weekTotal),
    hasEntries: input.timeEntries.length > 0,
  };
}

function buildMissionOptions(
  clients: ClientWithMissionsData[],
  gridMissionIds: Set<number>,
): MissionOption[] {
  return clients
    .filter((client) => client.archivedAt === null)
    .flatMap((client) =>
      client.missions
        .filter((mission) => !isMissionCompleted(mission.status))
        .map((mission) => ({
          billingMode: mission.billingMode,
          colorClass: COLOR_CLASSES[mission.color ?? client.color],
          hasRate: missionBills(mission),
          isInGrid: gridMissionIds.has(mission.id),
          missionId: mission.id,
          name: mission.name,
          subtitle: missionSubtitle(mission, client),
        })),
    )
    .sort(
      (left, right) =>
        Number(right.isInGrid) - Number(left.isInGrid) ||
        left.name.localeCompare(right.name, "fr"),
    );
}

export type LocatedCell = {
  cell: WeekCell;
  row: WeekRow;
  rowIndex: number;
  columnIndex: number;
};

export function locateCell(
  model: WeekGridModel,
  key: string | null,
): LocatedCell | null {
  if (key === null) {
    return null;
  }

  for (const [rowIndex, row] of model.rows.entries()) {
    const columnIndex = row.cells.findIndex(
      (candidate) => candidate.key === key,
    );

    if (columnIndex !== -1) {
      return { cell: row.cells[columnIndex], columnIndex, row, rowIndex };
    }
  }

  return null;
}

export function cellKeyAt(
  model: WeekGridModel,
  position: { row: number; column: number },
): string | null {
  return model.rows[position.row]?.cells[position.column]?.key ?? null;
}

export function focusableColumnCount(model: WeekGridModel): number {
  return model.columns.filter((column) => column.kind === "day").length;
}

export function defaultCellKey(model: WeekGridModel): string | null {
  return cellKeyAt(model, {
    column: Math.max(
      0,
      model.columns.findIndex(
        (column) => column.kind === "day" && column.isToday,
      ),
    ),
    row: 0,
  });
}
