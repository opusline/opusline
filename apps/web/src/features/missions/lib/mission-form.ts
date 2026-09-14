import type {
  BillingMode,
  Color,
  CreateMissionData,
  EntryRounding,
  MoneyData,
} from "@opusline/api-client";

import { type MoneyFormat, parseAmountToCents } from "@/lib/billing";

/** The four text fields both mission forms drive through TanStack Form. */
export type MissionFormValues = {
  name: string;
  endClientName: string;
  startDate: string;
  endDate: string;
};

/** A mission for an internal client bills nothing, so it carries no rate at all. */
export function missionRateCents(
  format: MoneyFormat,
  isInternal: boolean,
  draft: string,
): number | null {
  return isInternal ? null : parseAmountToCents(format.locale, draft);
}

/**
 * `format.currency` and not a stored snapshot: a payload denominated in a stale
 * render-context currency is refused by the API (422). See settings-form.ts for
 * the one case that needs the snapshot instead.
 */
export function missionMoney(
  format: MoneyFormat,
  amountCents: number | null,
): MoneyData | null {
  return amountCents === null
    ? null
    : { amount: amountCents, currency: format.currency };
}

type MissionPayloadInput = {
  values: MissionFormValues;
  format: MoneyFormat;
  billingMode: BillingMode;
  rateCents: number | null;
  /** A forfait's day price, for reading a budget; null on every other mode. */
  referenceRateCents: number | null;
  rounding: EntryRounding;
  color: Color | null;
  /** Only an ESN mission names an end client or is asked for a CRA. */
  isEsn: boolean;
  craRequired: boolean;
};

/**
 * What both forms send. `UpdateMissionData` is this plus `status` and `notes`,
 * so the edit form spreads it — the rules that decide each field are written
 * once rather than rebuilt on each screen.
 */
export function toMissionPayload({
  values,
  format,
  billingMode,
  rateCents,
  referenceRateCents,
  rounding,
  color,
  isEsn,
  craRequired,
}: MissionPayloadInput): CreateMissionData {
  return {
    name: values.name.trim(),
    billingMode,
    rate: missionMoney(format, rateCents),
    referenceDailyRate: missionMoney(format, referenceRateCents),
    rounding,
    craRequired: isEsn ? craRequired : null,
    endClientName:
      isEsn && values.endClientName.trim() !== ""
        ? values.endClientName.trim()
        : null,
    color,
    startDate: values.startDate === "" ? null : values.startDate,
    endDate: values.endDate === "" ? null : values.endDate,
  };
}
