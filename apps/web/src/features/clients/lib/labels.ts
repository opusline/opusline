import type {
  ClientType,
  ClientWithMissionsData,
  Color,
} from "@opusline/api-client";

import { COLORS } from "@/lib/palette";

export const CLIENT_TYPE_BADGE_VARIANTS: Record<
  ClientType,
  "brand" | "neutral"
> = {
  0: "neutral",
  1: "brand",
  2: "neutral",
};

const CLIENT_TYPE_DESCRIPTORS: Partial<Record<ClientType, string>> = {
  1: "ESN",
  2: "Projets internes",
};

export const CLIENT_TYPE_OPTION_LABELS: Record<ClientType, string> = {
  0: "Client direct",
  1: "ESN / intermédiaire",
  2: "Interne / perso",
};

export const CLIENT_TYPE_HINTS: Record<ClientType, string> = {
  0: "Vous facturez et livrez directement.",
  1: "Vous facturez l'ESN, qui facture son client final.",
  2: "Projets non facturables, suivis pour mémoire.",
};

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

  const descriptor = CLIENT_TYPE_DESCRIPTORS[client.type];

  if (descriptor !== undefined) {
    parts.push(descriptor);
  }

  const endClients = [
    ...new Set(
      client.missions
        .map((mission) => mission.endClientName)
        .filter((name): name is string => name !== null),
    ),
  ];

  if (endClients.length > 0) {
    parts.push(`client final ${endClients.join(", ")}`);
  }

  if (parts.length === 0) {
    const missionCount = client.missions.length;

    if (missionCount === 0) {
      return "Aucune mission";
    }

    return missionCount === 1 ? "1 mission" : `${missionCount} missions`;
  }

  return parts.join(" · ");
}
