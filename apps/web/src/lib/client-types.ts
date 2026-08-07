import type { ClientType } from "@opusline/api-client";

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  0: "Direct",
  1: "Intermédiaire",
  2: "Interne",
};

export function isInternalClient(type: ClientType): boolean {
  return type === 2;
}
