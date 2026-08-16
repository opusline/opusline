import type { Locale } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";
import { monthTitle } from "./months";

/**
 * The Revenus screen's period vocabulary: a month (`2026-07`), a quarter
 * (`2026-Q3`) or a year (`2026`), the same three shapes the API's `?period=`
 * accepts. The sibling of `weeks.ts` and `months.ts`, held to the same rule:
 * strings in, strings out, no `Date` in sight.
 */

export type PeriodKind = "month" | "quarter" | "year";

const MONTH_PERIOD_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;
const QUARTER_PERIOD_PATTERN = /^(\d{4})-Q([1-4])$/;
const YEAR_PERIOD_PATTERN = /^(\d{4})$/;

/* A period outside this is a malformed URL, not a period anyone invoiced in. */
const EARLIEST_YEAR = 1970;
const LATEST_YEAR = 2999;

const MONTHS_PER_QUARTER = 3;

type ParsedPeriod = {
  kind: PeriodKind;
  year: number;
  /** 1-based month or quarter; unused for a year. */
  ordinal: number;
};

function tryParsePeriod(period: string): ParsedPeriod | null {
  const month = MONTH_PERIOD_PATTERN.exec(period);

  if (month !== null) {
    return { kind: "month", year: Number(month[1]), ordinal: Number(month[2]) };
  }

  const quarter = QUARTER_PERIOD_PATTERN.exec(period);

  if (quarter !== null) {
    return {
      kind: "quarter",
      year: Number(quarter[1]),
      ordinal: Number(quarter[2]),
    };
  }

  const year = YEAR_PERIOD_PATTERN.exec(period);

  if (year !== null) {
    return { kind: "year", year: Number(year[1]), ordinal: 1 };
  }

  return null;
}

/** The pieces behind a period key, or a throw — never a silent fallback. */
function parsePeriod(period: string): ParsedPeriod {
  const parsed = tryParsePeriod(period);

  if (parsed === null) {
    throw new Error(`Not a period: ${period}`);
  }

  return parsed;
}

function formatMonthPeriod(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function isPeriod(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const parsed = tryParsePeriod(value);

  return (
    parsed !== null &&
    parsed.year >= EARLIEST_YEAR &&
    parsed.year <= LATEST_YEAR
  );
}

export function periodKind(period: string): PeriodKind {
  return parsePeriod(period).kind;
}

/** The period of the given kind containing a `Y-m-d` day. */
export function currentPeriod(kind: PeriodKind, today: string): string {
  const year = Number(today.slice(0, 4));
  const month = Number(today.slice(5, 7));

  switch (kind) {
    case "month":
      return formatMonthPeriod(year, month);
    case "quarter":
      return `${year}-Q${Math.ceil(month / MONTHS_PER_QUARTER)}`;
    case "year":
      return String(year);
  }
}

export function shiftPeriod(period: string, delta: number): string {
  const parsed = parsePeriod(period);

  switch (parsed.kind) {
    case "month": {
      const index = parsed.year * 12 + (parsed.ordinal - 1) + delta;

      return formatMonthPeriod(Math.floor(index / 12), (index % 12) + 1);
    }
    case "quarter": {
      const index = parsed.year * 4 + (parsed.ordinal - 1) + delta;

      return `${Math.floor(index / 4)}-Q${(index % 4) + 1}`;
    }
    case "year":
      return String(parsed.year + delta);
  }
}

/**
 * Whether the period reaches the one containing today — where the next arrow
 * stops. Keys of one kind order lexicographically ("2026-Q1" < "2026-Q3"), so
 * a string compare is the whole comparison.
 */
export function isAtOrAfterCurrent(period: string, today: string): boolean {
  return period >= currentPeriod(periodKind(period), today);
}

/** Whether the period starts after the one containing today — not navigable. */
export function isFuturePeriod(period: string, today: string): boolean {
  return period > currentPeriod(periodKind(period), today);
}

/** The first and last month of a period, as `Y-m` bounds. */
function monthBounds(period: string): { first: string; last: string } {
  const parsed = parsePeriod(period);

  switch (parsed.kind) {
    case "month":
      return { first: period, last: period };
    case "quarter": {
      const firstMonth = (parsed.ordinal - 1) * MONTHS_PER_QUARTER + 1;

      return {
        first: formatMonthPeriod(parsed.year, firstMonth),
        last: formatMonthPeriod(
          parsed.year,
          firstMonth + MONTHS_PER_QUARTER - 1,
        ),
      };
    }
    case "year":
      return {
        first: formatMonthPeriod(parsed.year, 1),
        last: formatMonthPeriod(parsed.year, 12),
      };
  }
}

function contains(period: string, candidate: string): boolean {
  const outer = monthBounds(period);
  const inner = monthBounds(candidate);

  return inner.first >= outer.first && inner.last <= outer.last;
}

/**
 * The same moment read at another granularity, for the Mois | Trimestre | Année
 * switch. Widening keeps the containing period; narrowing lands on today's
 * sub-period when the selection contains it, and on the last one otherwise —
 * the month the chart's window already ends on.
 */
export function resizePeriod(
  period: string,
  toKind: PeriodKind,
  today: string,
): string {
  if (periodKind(period) === toKind) {
    return period;
  }

  const todayCandidate = currentPeriod(toKind, today);

  if (contains(period, todayCandidate)) {
    return todayCandidate;
  }

  // Widening, this is the containing period; narrowing, the last sub-period.
  return currentPeriod(toKind, `${monthBounds(period).last}-01`);
}

/** "Juillet 2026", "T3 2026" or "2026" — a page title, so it carries its capital. */
export function periodTitle(locale: Locale, period: string): string {
  const parsed = parsePeriod(period);

  switch (parsed.kind) {
    case "month":
      return monthTitle(locale, period);
    case "quarter":
      return m.revenue_quarter_title({
        quarter: parsed.ordinal,
        year: parsed.year,
      });
    case "year":
      return period;
  }
}
