import type {
  ClientType,
  ClientWithMissionsData,
  Color,
} from "@opusline/api-client";

import { COLORS } from "@/lib/palette";
import { m } from "@/paraglide/messages.js";

export const CLIENT_TYPE_BADGE_VARIANTS: Record<
  ClientType,
  "brand" | "neutral"
> = {
  0: "neutral",
  1: "brand",
  2: "neutral",
};

const CLIENT_TYPE_OPTION_MESSAGES: Record<ClientType, () => string> = {
  0: m.client_type_short_direct,
  1: m.clients_type_option_esn,
  2: m.clients_type_option_internal,
};

export function clientTypeOptionLabel(type: ClientType): string {
  return CLIENT_TYPE_OPTION_MESSAGES[type]();
}

const CLIENT_TYPE_HINT_MESSAGES: Record<ClientType, () => string> = {
  0: m.clients_type_hint_direct,
  1: m.clients_type_hint_esn,
  2: m.clients_type_hint_internal,
};

export function clientTypeHint(type: ClientType): string {
  return CLIENT_TYPE_HINT_MESSAGES[type]();
}

export const CLIENT_TYPES: ClientType[] = [0, 1, 2];

export function randomColor(): Color {
  return COLORS[Math.floor(Math.random() * COLORS.length)] ?? 0;
}

const NEW_CLIENT_BADGE_DAYS = 7;

export function isNewClient(
  client: ClientWithMissionsData,
  now: Date,
): boolean {
  const ageMs = now.getTime() - new Date(client.createdAt).getTime();

  return ageMs <= NEW_CLIENT_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

export function clientSubtitle(client: ClientWithMissionsData): string {
  const parts: string[] = [];

  if (client.type === 1) {
    parts.push("ESN");
  } else if (client.type === 2) {
    parts.push(m.clients_descriptor_internal());
  }

  const endClients = [
    ...new Set(
      client.missions
        .map((mission) => mission.endClientName)
        .filter((name): name is string => name !== null),
    ),
  ];

  if (endClients.length > 0) {
    parts.push(m.missions_detail_end_client({ name: endClients.join(", ") }));
  }

  if (parts.length === 0) {
    const missionCount = client.missions.length;

    if (missionCount === 0) {
      return m.clients_no_missions();
    }

    return m.clients_mission_count({ count: missionCount });
  }

  return parts.join(" · ");
}
