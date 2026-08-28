import type {
  BillingMode,
  Currency,
  Locale,
  MissionData,
  MoneyData,
} from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

export type MoneyFormat = {
  locale: Locale;
  currency: Currency;
};

/** What a fresh account formats with, and what the API seeds new accounts on. */
export const DEFAULT_MONEY_FORMAT: MoneyFormat = {
  locale: "fr-FR",
  currency: "EUR",
};

/** A rate of 100 %: every rate crossing the API is an int share of this. */
const BASIS_POINTS = 10_000;

const formatters = new Map<string, Intl.NumberFormat>();

export function cachedFormatter(
  locale: Locale,
  options: Intl.NumberFormatOptions,
): Intl.NumberFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let formatter = formatters.get(key);

  if (formatter === undefined) {
    formatter = new Intl.NumberFormat(locale, options);
    formatters.set(key, formatter);
  }

  return formatter;
}

function currencyFormatter(
  format: MoneyFormat,
  options: Intl.NumberFormatOptions = {},
): Intl.NumberFormat {
  return cachedFormatter(format.locale, {
    style: "currency",
    currency: format.currency,
    ...options,
  });
}

export function formatAmountWithCents(
  format: MoneyFormat,
  amountCents: number,
): string {
  return currencyFormatter(format, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

/** The bare figure, no symbol — what an editable amount input is seeded with. */
export function formatAmount(format: MoneyFormat, amountCents: number): string {
  return cachedFormatter(format.locale, { maximumFractionDigits: 2 }).format(
    amountCents / 100,
  );
}

/**
 * The bare whole-unit figure a fisc form's box shows back — grouped for
 * reading, no symbol, no cents.
 */
export function formatWholeFigure(
  format: MoneyFormat,
  amountCents: number,
): string {
  return cachedFormatter(format.locale, { maximumFractionDigits: 0 }).format(
    amountCents / 100,
  );
}

/**
 * Whole units, the way invoice lists show them: "1 224 €". Rounded on purpose —
 * the list is scanned, not reconciled, and the exact figure to the cent is on the
 * invoice's own panel.
 */
export function formatWholeAmount(
  format: MoneyFormat,
  amountCents: number,
): string {
  return currencyFormatter(format, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

const symbols = new Map<string, string>();

/**
 * The bare symbol for input adornments and unit labels — "€", "$", or whatever
 * the locale calls the account currency ("$US" in French for USD). Cached like
 * the separators: call sites sit on per-keystroke render paths.
 */
export function currencySymbol(format: MoneyFormat): string {
  const key = `${format.locale}|${format.currency}`;
  let symbol = symbols.get(key);

  if (symbol === undefined) {
    symbol =
      currencyFormatter(format)
        .formatToParts(0)
        .find((part) => part.type === "currency")?.value ?? format.currency;
    symbols.set(key, symbol);
  }

  return symbol;
}

/**
 * A basis-point rate as the figure beside a "%": 2000 -> "20", 550 -> "5,5".
 *
 * The fraction digits are the caller's call: an invoice reads "TVA 20 %", the settings
 * form pins one decimal so the figure does not jump as it is typed, and a consumed
 * share is read to the whole percent.
 */
export function formatPercentFromBp(
  locale: Locale,
  basisPoints: number,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
): string {
  return cachedFormatter(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(basisPoints / 100);
}

/** A typed percentage back to basis points: "5,5" -> 550. Null when it is not a rate. */
export function parseRateBp(locale: Locale, draft: string): number | null {
  const rate = parseDecimal(locale, draft);

  if (rate === null || rate > 100) {
    return null;
  }

  return Math.round(rate * 100);
}

export function formatRate(
  format: MoneyFormat,
  amountCents: number,
  billingMode: BillingMode,
): string {
  const amount = currencyFormatter(format, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);

  switch (billingMode) {
    case 0:
      return m.billing_rate_daily({ amount });
    case 1:
      return m.billing_rate_hourly({ amount });
    case 2:
      return m.billing_rate_fixed({ amount });
  }
}

type NumberSeparators = {
  group: string;
  decimal: string;
};

const separators = new Map<Locale, NumberSeparators>();

function numberSeparators(locale: Locale): NumberSeparators {
  let found = separators.get(locale);

  if (found === undefined) {
    const parts = cachedFormatter(locale, {}).formatToParts(11111.1);

    found = {
      group: parts.find((part) => part.type === "group")?.value ?? " ",
      decimal: parts.find((part) => part.type === "decimal")?.value ?? ",",
    };
    separators.set(locale, found);
  }

  return found;
}

export function formatRateDraft(locale: Locale, raw: string): string {
  const { group, decimal } = numberSeparators(locale);
  const typed = raw.replace(/[^0-9.,]/g, "");

  let cleaned: string;

  if (decimal === ",") {
    // A numpad dot means the decimal comma.
    cleaned = typed.replace(/\./g, ",");
  } else {
    // Commas are grouping here, and two invalid layouts must part ways: a
    // group grown past three digits is this field's own comma with more digits
    // typed around it ("4,800" + "0"), so it regroups from the raw digits —
    // while a short fragment like "1,5" may be a decimal comma typed by habit,
    // and normalizing it to "15" would hand the parser fifteen when the typist
    // meant one and a half, so it stays in the draft for the parse to reject.
    const [typedInteger = ""] = typed.split(".");

    if (
      !hasValidGrouping(typedInteger, ",") &&
      !hasOvergrownGroup(typedInteger)
    ) {
      return typed;
    }

    cleaned = typed.replace(/,/g, "");
  }

  const [integerPart = "", ...decimalParts] = cleaned.split(decimal);
  const digits = integerPart.replace(/\D/g, "").slice(0, 9);
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, group);

  if (!cleaned.includes(decimal)) {
    return grouped;
  }

  return `${grouped}${decimal}${decimalParts.join("").slice(0, 2)}`;
}

const DECIMAL = /^\d+(?:\.\d+)?$/;

/**
 * Refuses anything that is not a single plain decimal in the locale's notation.
 * `Number.parseFloat` stops at the first stray separator and hands back a
 * silently truncated number instead — « 1,234,5 » has to be an error, not 1,23.
 */
export function parseDecimal(locale: Locale, draft: string): number | null {
  const { group, decimal } = numberSeparators(locale);
  // \s covers the no-break spaces Intl groups with (U+00A0, U+202F).
  let normalized = draft.replace(/\s/g, "");

  // A digit-like group separator ("1,234.56") could silently change the amount
  // when misplaced — "1,5" must be an error, not 15 — so grouping is validated
  // before it is stripped. Space-like groups are already gone.
  if (group === "," || group === ".") {
    const [integerPart = "", ...decimalPart] = normalized.split(decimal);

    if (!hasValidGrouping(integerPart, group)) {
      return null;
    }

    normalized = [integerPart.replaceAll(group, ""), ...decimalPart].join(
      decimal,
    );
  }

  normalized = normalized.replace(decimal, ".");

  return DECIMAL.test(normalized) ? Number.parseFloat(normalized) : null;
}

function hasOvergrownGroup(integerPart: string): boolean {
  return integerPart
    .split(",")
    .some((segment, index) => index > 0 && segment.length > 3);
}

function hasValidGrouping(integerPart: string, group: string): boolean {
  const segments = integerPart.split(group);

  if (segments.length === 1) {
    return true;
  }

  return segments.every((segment, index) =>
    index === 0
      ? segment.length >= 1 && segment.length <= 3
      : segment.length === 3,
  );
}

/** Zero is refused: a mission billed at nothing is a mistake, not a price. */
export function parseRateToCents(locale: Locale, draft: string): number | null {
  const amount = parseDecimal(locale, draft);

  return amount === null || amount <= 0 ? null : Math.round(amount * 100);
}

/** An ASCII hyphen or the typographic minus a formatter may have echoed back. */
function splitLeadingMinus(draft: string): {
  isNegative: boolean;
  magnitude: string;
} {
  const isNegative = draft.startsWith("-") || draft.startsWith("\u2212");

  return { isNegative, magnitude: isNegative ? draft.slice(1) : draft };
}

/** The rate draft formatter, minus-aware: "-1234,5" stays typeable. */
export function formatSignedDraft(locale: Locale, draft: string): string {
  const { isNegative, magnitude } = splitLeadingMinus(draft.trimStart());
  const formatted = formatRateDraft(locale, magnitude);

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * A signed amount in cents: bank balances accept a leading minus (an overdraft
 * is a legal state) and zero (an empty account is one too).
 */
export function parseSignedAmountToCents(
  locale: Locale,
  draft: string,
): number | null {
  const { isNegative, magnitude } = splitLeadingMinus(draft.trim());
  const amount = parseDecimal(locale, magnitude);

  if (amount === null) {
    return null;
  }

  return Math.round(amount * 100) * (isNegative ? -1 : 1);
}

/** A rate is what makes a mission billable, and having one is what proves it. */
export function missionBills(
  mission: MissionData,
): mission is MissionData & { rate: MoneyData } {
  return mission.rate !== null;
}

export function formatMissionRate(
  format: MoneyFormat,
  mission: MissionData,
): string {
  if (mission.rate === null) {
    return m.missions_rate_not_billable();
  }

  return formatRate(format, mission.rate.amount, mission.billingMode);
}

/**
 * The typical billable month the mission projection assumes. A convention:
 * nothing on a mission form says how many days will actually be worked.
 */
export const MONTHLY_BILLABLE_DAYS = 20;

const MINUTES_PER_HOUR = 60;

export type MissionMonthProjection = {
  /** What a typical month bills, HT. Null until a rate is typed. */
  monthlyCents: number | null;
  /** What the account should set aside for URSSAF out of it. */
  provisionCents: number | null;
  /** What is left — the figure the panel calls « net estimé ». */
  netCents: number | null;
};

/**
 * What a month on this mission would look like at the rate being typed.
 *
 * The browser computes this one because there is no server figure to ask for —
 * the rate does not exist yet. What it must not invent arrives as arguments:
 * contributionRateBp is the account's own, so an ACRE freelance sees theirs.
 */
export function projectMissionMonth(
  rateCents: number | null,
  billingMode: BillingMode,
  contributionRateBp: number,
  workdayMinutes: number,
): MissionMonthProjection {
  if (rateCents === null) {
    return { monthlyCents: null, provisionCents: null, netCents: null };
  }

  const monthlyCents = missionMonthlyCents(
    rateCents,
    billingMode,
    workdayMinutes,
  );
  const provisionCents = Math.round(
    (monthlyCents * contributionRateBp) / BASIS_POINTS,
  );

  return {
    monthlyCents,
    provisionCents,
    netCents: monthlyCents - provisionCents,
  };
}

function missionMonthlyCents(
  rateCents: number,
  billingMode: BillingMode,
  workdayMinutes: number,
): number {
  switch (billingMode) {
    // A forfait bills its price, whatever the days.
    case 2:
      return rateCents;
    case 0:
      return rateCents * MONTHLY_BILLABLE_DAYS;
    case 1:
      return Math.round(
        (rateCents * MONTHLY_BILLABLE_DAYS * workdayMinutes) / MINUTES_PER_HOUR,
      );
  }
}

/** The hours the projection's monthly figure assumes, for the hint beside it. */
export function monthlyBillableHours(workdayMinutes: number): number {
  return (MONTHLY_BILLABLE_DAYS * workdayMinutes) / MINUTES_PER_HOUR;
}

/**
 * `partCents` as a share of `wholeCents`, in basis points. Truncates like the
 * API's Rate::shareBp(), so a share computed here reads like one off a DTO.
 */
export function shareBp(partCents: number, wholeCents: number): number {
  return wholeCents === 0
    ? 0
    : Math.trunc((partCents * BASIS_POINTS) / wholeCents);
}

/**
 * A whole percentage of an amount, for the « remplir » shortcuts. A seed for a
 * field, not a figure: the API recomputes everything from what is submitted.
 */
export function percentOfCents(amountCents: number, percent: number): number {
  return Math.round((amountCents * percent) / 100);
}

/**
 * What `days` at `dailyRateCents` costs, for the what-if a forfait dialog shows
 * against the day being typed. Rounded half up like the API's day pricing, but
 * without its exact fraction: the entry does not exist yet.
 */
export function daysAtRate(dailyRateCents: number, days: number): number {
  return Math.round(dailyRateCents * days);
}

export function paymentTermsLabel(days: number): string {
  if (days === 0) {
    return m.clients_payment_terms_receipt();
  }

  return m.clients_payment_terms_days({ days });
}
