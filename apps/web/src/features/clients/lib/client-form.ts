import type {
  ClientType,
  Color,
  CreateClientData,
  Locale,
  UpdateClientData,
} from "@opusline/api-client";

import { parseRateBp } from "@/lib/billing";
import { valueOrNull } from "@/lib/form";
import { m } from "@/paraglide/messages.js";

export const BILLING_ADDRESS_NAMES = {
  line1: "billingAddressLine1",
  line2: "billingAddressLine2",
  postalCode: "billingPostalCode",
  city: "billingCity",
  country: "billingCountry",
} as const;

export type ClientFormValues = {
  name: string;
  type: ClientType;
  siret: string;
  vatNumber: string;
  /** Empty follows the account rate; "0" is a client charged no TVA. */
  defaultVatRate: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingPostalCode: string;
  billingCity: string;
  billingCountry: string;
  billingContactName: string;
  billingEmail: string;
  color: Color;
  paymentTermsDays: number;
};

export function toClientPayload(
  values: ClientFormValues,
  locale: Locale,
): CreateClientData & UpdateClientData {
  return {
    name: values.name.trim(),
    type: values.type,
    siret: valueOrNull(values.siret),
    vatNumber: valueOrNull(values.vatNumber),
    defaultVatRateBp: parseRateBp(locale, values.defaultVatRate),
    billingAddressLine1: valueOrNull(values.billingAddressLine1),
    billingAddressLine2: valueOrNull(values.billingAddressLine2),
    billingPostalCode: valueOrNull(values.billingPostalCode),
    billingCity: valueOrNull(values.billingCity),
    billingCountry: valueOrNull(values.billingCountry),
    billingContactName: valueOrNull(values.billingContactName),
    billingEmail: valueOrNull(values.billingEmail),
    color: values.color,
    paymentTermsDays: values.paymentTermsDays,
  };
}

/**
 * Rejects a malformed rate but not an empty one: empty is the answer for most
 * clients, and it is what keeps an unreadable draft from reaching the payload,
 * where parseRateBp would turn it into the same null that means "follows the
 * account".
 */
export function clientVatRateValidator(locale: Locale) {
  return ({ value }: { value: string }): { message: string } | undefined =>
    value.trim() !== "" && parseRateBp(locale, value) === null
      ? { message: m.clients_vat_rate_invalid() }
      : undefined;
}

type PostalAddress = {
  billingAddressLine1: string | null;
  billingAddressLine2: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  billingCountry: string | null;
};

export function formatPostalAddress(address: PostalAddress): string | null {
  const cityLine = [address.billingPostalCode, address.billingCity]
    .filter((part) => part !== null && part !== "")
    .join(" ");

  const lines = [
    address.billingAddressLine1,
    address.billingAddressLine2,
    cityLine === "" ? null : cityLine,
    address.billingCountry,
  ].filter((line) => line !== null && line !== "");

  return lines.length === 0 ? null : lines.join("\n");
}
