import type { ClientType } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

const CLIENT_TYPE_MESSAGES: Record<ClientType, () => string> = {
  0: m.client_type_direct,
  1: m.client_type_intermediary,
  2: m.client_type_internal,
};

export function clientTypeLabel(type: ClientType): string {
  return CLIENT_TYPE_MESSAGES[type]();
}

const CLIENT_TYPE_SHORT_MESSAGES: Record<ClientType, () => string> = {
  0: m.client_type_short_direct,
  1: m.client_type_short_esn,
  2: m.client_type_short_personal,
};

export function clientTypeShortLabel(type: ClientType): string {
  return CLIENT_TYPE_SHORT_MESSAGES[type]();
}

export function isInternalClient(type: ClientType): boolean {
  return type === 2;
}
