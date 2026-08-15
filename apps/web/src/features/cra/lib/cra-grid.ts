import type { CraDayData, Locale } from "@opusline/api-client";

import { capitalizeFirst } from "@/lib/dates";
import { monthGridDates } from "@/lib/months";
import { weekdayShortLabel } from "@/lib/weeks";

import { FULL_DAY_BP, HALF_DAY_BP } from "./day-fraction";
import { cellAriaLabel } from "./labels";

/**
 * The month as a calendar reads it: whole weeks, Monday first.
 *
 * The API sends every day of the month with its own weekend/holiday flags, so this
 * builder never has to know a thing about the French calendar — it only lays the days
 * out and pads the weeks either side.
 */

export type CraCell = {
  key: string;
  /** Null on a padding day from a neighbouring month: rendered, never editable. */
  date: string | null;
  dayOfMonth: string;
  dayFractionBp: number;
  trackedDayFractionBp: number;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName: string | null;
  /** Worked on a day nobody was expected to — the design's amber badge. */
  isOffDayWorked: boolean;
  valueLabel: string;
  ariaLabel: string;
};

export type CraWeek = { key: string; cells: CraCell[] };

export type CraGridModel = {
  weekdayLabels: string[];
  weeks: CraWeek[];
  /** Days nobody was expected to work but which carry time all the same. */
  offDaysWorked: number;
};

export type LocatedCell = {
  cell: CraCell;
  rowIndex: number;
  columnIndex: number;
};

/** "Lun" … "Dim", Monday first — 2024-01-01 is a Monday, only its weekday is read. */
export function weekdayLabels(locale: Locale): string[] {
  return Array.from({ length: 7 }, (_, index) =>
    capitalizeFirst(weekdayShortLabel(locale, `2024-01-0${1 + index}`)),
  );
}

/** "0,5" — French decimals, and nothing at all on a day not worked. */
export function formatDayFraction(locale: Locale, basisPoints: number): string {
  if (basisPoints <= 0) {
    return "";
  }

  return (basisPoints / FULL_DAY_BP).toLocaleString(locale, {
    maximumFractionDigits: 2,
  });
}

export function buildCraGrid(input: {
  locale: Locale;
  month: string;
  days: CraDayData[];
}): CraGridModel {
  const byDate = new Map(input.days.map((day) => [day.date, day]));
  const dates = monthGridDates(input.month);
  const weeks: CraWeek[] = [];
  let offDaysWorked = 0;

  for (let index = 0; index < dates.length; index += 7) {
    const cells = dates.slice(index, index + 7).map((date) => {
      const day = byDate.get(date);

      if (day === undefined) {
        // A padding day: it belongs to a neighbouring month, and this CRA has
        // nothing to say about it.
        return paddingCell(date);
      }

      const isOffDayWorked =
        day.dayFractionBp > 0 && (day.isWeekend || day.isHoliday);

      if (isOffDayWorked) {
        offDaysWorked += 1;
      }

      return {
        key: date,
        date,
        dayOfMonth: String(Number(date.slice(8, 10))),
        dayFractionBp: day.dayFractionBp,
        trackedDayFractionBp: day.trackedDayFractionBp,
        isWeekend: day.isWeekend,
        isHoliday: day.isHoliday,
        holidayName: day.holidayName,
        isOffDayWorked,
        valueLabel: formatDayFraction(input.locale, day.dayFractionBp),
        ariaLabel: cellAriaLabel(input.locale, day),
      };
    });

    weeks.push({ key: dates[index], cells });
  }

  return { weekdayLabels: weekdayLabels(input.locale), weeks, offDaysWorked };
}

function paddingCell(date: string): CraCell {
  return {
    key: date,
    date: null,
    dayOfMonth: "",
    dayFractionBp: 0,
    trackedDayFractionBp: 0,
    isWeekend: false,
    isHoliday: false,
    holidayName: null,
    isOffDayWorked: false,
    valueLabel: "",
    ariaLabel: "",
  };
}

export function locateCell(
  model: CraGridModel,
  key: string | null,
): LocatedCell | null {
  if (key === null) {
    return null;
  }

  for (const [rowIndex, week] of model.weeks.entries()) {
    const columnIndex = week.cells.findIndex((cell) => cell.key === key);

    if (columnIndex !== -1) {
      return { cell: week.cells[columnIndex], rowIndex, columnIndex };
    }
  }

  return null;
}

/**
 * The cell the tab stop may move to, or null when the position holds no day.
 *
 * A padding day renders no gridcell at all, so letting the tab stop land on one would
 * leave the grid with zero tab stops and strand the focus ring on a cell the component
 * no longer considers focused.
 */
export function cellKeyAt(
  model: CraGridModel,
  position: { row: number; column: number },
): string | null {
  const cell = model.weeks[position.row]?.cells[position.column];

  return cell === undefined || cell.date === null ? null : cell.key;
}

/** The first day of the month, so the grid opens on a cell that can be edited. */
export function defaultCellKey(model: CraGridModel): string | null {
  for (const week of model.weeks) {
    const cell = week.cells.find((candidate) => candidate.date !== null);

    if (cell !== undefined) {
      return cell.key;
    }
  }

  return null;
}

/**
 * What one click does: nothing → a day → half a day → nothing.
 *
 * A quarter can arrive from tracked time and is shown faithfully, but the cycle never
 * produces one — the design offers three states, and a grid you click through should
 * not hide a fourth.
 */
export function cycleDayFraction(basisPoints: number): number {
  if (basisPoints <= 0) {
    return FULL_DAY_BP;
  }

  return basisPoints > HALF_DAY_BP ? HALF_DAY_BP : 0;
}

/** The month's own days, narrowed so `date` is a string rather than a cast. */
type DatedCell = CraCell & { date: string };

function datedCells(model: CraGridModel): DatedCell[] {
  return model.weeks
    .flatMap((week) => week.cells)
    .filter((cell): cell is DatedCell => cell.date !== null);
}

/**
 * The grid as the API wants it written back: worked days only, in calendar order.
 *
 * @returns the sparse payload for `PUT /cras/{cra}/days`
 */
export function toDayPayload(
  model: CraGridModel,
): { date: string; dayFractionBp: number }[] {
  return datedCells(model)
    .filter((cell) => cell.dayFractionBp > 0)
    .map((cell) => ({ date: cell.date, dayFractionBp: cell.dayFractionBp }));
}

/**
 * Every working day of the month filled with a full day — "Remplir les jours ouvrés".
 * Weekends and holidays are left alone: the point is the days you were expected to
 * work, and a Saturday you did work is already on the grid.
 */
export function fillWeekdays(
  model: CraGridModel,
): { date: string; dayFractionBp: number }[] {
  return datedCells(model)
    .map((cell) => ({
      date: cell.date,
      dayFractionBp:
        cell.isWeekend || cell.isHoliday
          ? cell.dayFractionBp
          : Math.max(cell.dayFractionBp, FULL_DAY_BP),
    }))
    .filter((day) => day.dayFractionBp > 0);
}

/** The grid with one day changed, ready to send. */
export function withDay(
  model: CraGridModel,
  date: string,
  basisPoints: number,
): { date: string; dayFractionBp: number }[] {
  const changed = toDayPayload(model).filter((day) => day.date !== date);

  if (basisPoints > 0) {
    changed.push({ date, dayFractionBp: basisPoints });
  }

  return changed.sort((a, b) => a.date.localeCompare(b.date));
}
