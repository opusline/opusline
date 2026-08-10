import type { BillingMode } from "@opusline/api-client";

const MAX_MINUTES_PER_DAY = 1440;

const decimals = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 });

/** Why a duration was rejected. Every reason needs its own hint to show. */
export type DurationInvalidReason = "format" | "range";

export type DurationParse =
  | { kind: "minutes"; minutes: number }
  | { kind: "clear" }
  | { kind: "invalid"; reason: DurationInvalidReason };

export type DurationUnits = {
  billingMode: BillingMode;
  workdayMinutes: number;
};

export function isHourly(billingMode: BillingMode): boolean {
  return billingMode === 1;
}

function toNumber(raw: string): number | null {
  const parsed = Number(raw.replace(",", "."));

  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Accepted forms: `1` and `0,5` in the row's own unit, plus the explicit
 * `2h` · `1h30` · `2:30` · `90m` · `90min` · `1j`, which mean the same thing on
 * every row. An empty value — or a plain zero — clears the cell.
 */
export function parseDuration(
  raw: string,
  units: DurationUnits,
): DurationParse {
  const input = raw.replace(/\s/g, "").replaceAll(".", ",").toLowerCase();

  if (input === "" || input === "0") {
    return { kind: "clear" };
  }

  const minutes = toMinutes(input, units);

  if (minutes === null) {
    return { kind: "invalid", reason: "format" };
  }

  const rounded = Math.round(minutes);

  if (rounded < 1 || rounded > MAX_MINUTES_PER_DAY) {
    return { kind: "invalid", reason: "range" };
  }

  return { kind: "minutes", minutes: rounded };
}

function toMinutes(input: string, units: DurationUnits): number | null {
  const hoursAndMinutes = /^(\d+)[h:](\d{1,2})$/.exec(input);

  if (hoursAndMinutes !== null) {
    const extraMinutes = Number(hoursAndMinutes[2]);

    return extraMinutes > 59
      ? null
      : Number(hoursAndMinutes[1]) * 60 + extraMinutes;
  }

  const hours = /^(\d*(?:,\d+)?)h$/.exec(input);

  if (hours !== null) {
    const value = toNumber(hours[1]);

    return value === null ? null : value * 60;
  }

  const bareMinutes = /^(\d+)(?:m|min)$/.exec(input);

  if (bareMinutes !== null) {
    return Number(bareMinutes[1]);
  }

  const days = /^(\d*(?:,\d+)?)j$/.exec(input);

  if (days !== null) {
    const value = toNumber(days[1]);

    return value === null ? null : value * units.workdayMinutes;
  }

  if (!/^\d*(?:,\d+)?$/.test(input)) {
    return null;
  }

  const value = toNumber(input);

  if (value === null) {
    return null;
  }

  return !isHourly(units.billingMode)
    ? value * units.workdayMinutes
    : value * 60;
}

/** The billed value of a day-counted entry: `1` → "1 j", `0.5` → "0,5 j". */
export function formatBilledDays(dayFraction: number): string {
  return `${decimals.format(dayFraction)} j`;
}

/**
 * The billed value of an hourly entry. Halves read as decimals the way the
 * design writes them ("1,5 h"); anything else keeps its minutes ("3 h 42"),
 * because "3,7 h" is not a number anyone bills.
 */
export function formatBilledHours(minutes: number): string {
  return minutes % 60 === 30
    ? `${decimals.format(Math.floor(minutes / 60) + 0.5)} h`
    : hoursAndMinutes(minutes);
}

/** "2 h" on the hour, "3 h 42" otherwise. */
function hoursAndMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  return remainder === 0
    ? `${hours} h`
    : `${hours} h ${String(remainder).padStart(2, "0")}`;
}

/**
 * A total spanning both units — day-billed missions contribute days, hourly
 * ones contribute hours. Converting between them would invent a day-equivalence
 * nobody invoices, so the two are shown side by side.
 */
export function formatBilledTotal(total: {
  dayFraction: number;
  billedMinutes: number;
}): string {
  const parts: string[] = [];

  if (total.dayFraction > 0) {
    parts.push(formatBilledDays(total.dayFraction));
  }

  if (total.billedMinutes > 0) {
    parts.push(formatBilledHours(total.billedMinutes));
  }

  return parts.join(" · ");
}

/** Time actually spent, for the day and week totals. 450 → "7 h 30". */
export function formatWorkedTime(minutes: number): string {
  return minutes < 60 ? `${minutes} min` : hoursAndMinutes(minutes);
}

/**
 * Seeds the inline editor. Deliberately built from the raw duration rather than
 * the billed value: an entry of 67 min on a quarter-hour mission *displays*
 * "1,25 h", and seeding that would silently rewrite it to 75 min on a bare
 * Enter. Round day counts get the short form a TJM user expects to see.
 */
export function formatDurationInput(
  minutes: number,
  units: DurationUnits,
): string {
  if (!isHourly(units.billingMode)) {
    const quarters = (minutes * 4) / units.workdayMinutes;

    if (Number.isInteger(quarters)) {
      return decimals.format(quarters / 4);
    }
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours === 0) {
    return `${remainder}m`;
  }

  return remainder === 0 ? `${hours}h` : `${hours}h${remainder}`;
}
