import type {
  ClientType,
  Color,
  CreateClientData,
  UpdateClientData,
} from "@opusline/api-client";

export type ClientFormValues = {
  name: string;
  type: ClientType;
  siret: string;
  vatNumber: string;
  billingAddress: string;
  billingContactName: string;
  billingEmail: string;
  color: Color;
  paymentTermsDays: number;
};

function valueOrNull(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

export function toClientPayload(
  values: ClientFormValues,
): CreateClientData & UpdateClientData {
  return {
    name: values.name.trim(),
    type: values.type,
    siret: valueOrNull(values.siret),
    vatNumber: valueOrNull(values.vatNumber),
    billingAddress: valueOrNull(values.billingAddress),
    billingContactName: valueOrNull(values.billingContactName),
    billingEmail: valueOrNull(values.billingEmail),
    color: values.color,
    paymentTermsDays: values.paymentTermsDays,
  };
}
