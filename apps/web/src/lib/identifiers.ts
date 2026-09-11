/**
 * French spacing for the identifiers that end up on an invoice or a CRA.
 *
 * France only, deliberately: every other business country groups these its own
 * way, and guessing a rule for a market the app has no users in is how a wrong
 * SIRET gets printed on a document someone sends to their client. A value that
 * does not match the French shape exactly is handed back untouched rather than
 * half-grouped.
 */

const pairs = (digits: string): string =>
  (digits.match(/\d{2}/g) ?? []).join(" ");

/** `12345678901234` → `123 456 789 01234`, the SIREN then the NIC. */
export function formatSiret(value: string): string {
  const digits = value.replace(/\D/g, "");

  if (!/^\d{14}$/.test(digits)) {
    return value;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
}

/** `FR64443061841` → `FR64 443061841`, the country and key then the SIREN. */
export function formatVatNumber(value: string): string {
  const compact = value.replace(/[\s.]/g, "").toUpperCase();

  if (!/^FR[A-Z0-9]{2}\d{9}$/.test(compact)) {
    return value;
  }

  return `${compact.slice(0, 4)} ${compact.slice(4)}`;
}

/**
 * `0123456789` → `01 23 45 67 89`, and `+33123456789` → `+33 1 23 45 67 89`.
 *
 * Gated on the account's country by its caller: a ten-digit number starting
 * with a zero is not French everywhere it occurs.
 */
export function formatFrenchPhone(value: string): string {
  const compact = value.replace(/[\s.-]/g, "");

  if (/^0\d{9}$/.test(compact)) {
    return pairs(compact);
  }

  if (/^\+33\d{9}$/.test(compact)) {
    return `+33 ${compact.slice(3, 4)} ${pairs(compact.slice(4))}`;
  }

  return value;
}
