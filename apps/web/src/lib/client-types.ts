import type { ClientType } from "@opusline/api-client";

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  0: "Direct",
  1: "Intermédiaire",
  2: "Interne",
};

export const CLIENT_TYPE_SHORT_LABELS: Record<ClientType, string> = {
  0: "Client direct",
  1: "Via ESN",
  2: "Perso",
};

export function isInternalClient(type: ClientType): boolean {
  return type === 2;
}
