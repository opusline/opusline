import type {
  ClientType,
  ClientWithMissionsData,
  Color,
  MissionData,
  MissionStatus,
} from "@opusline/api-client";

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  0: "Direct",
  1: "Intermédiaire",
  2: "Interne",
};

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

export const COLOR_LABELS: Record<Color, string> = {
  0: "Ambre",
  1: "Terracotta",
  2: "Olive",
  3: "Sauge",
  4: "Ardoise",
  5: "Encre",
  6: "Prune",
  7: "Pierre",
};

export const CLIENT_TYPES: ClientType[] = [0, 1, 2];

export const COLORS: Color[] = [0, 1, 2, 3, 4, 5, 6, 7];

export function paymentTermsLabel(days: number): string {
  if (days === 0) {
    return "réception";
  }

  return days === 1 ? "1 jour" : `${days} jours`;
}

export function randomColor(): Color {
  return COLORS[Math.floor(Math.random() * COLORS.length)] ?? 0;
}

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  0: "Active",
  1: "En pause",
  2: "Terminée",
};

export const MISSION_STATUS_BADGE_VARIANTS: Record<
  MissionStatus,
  "brand" | "neutral"
> = {
  0: "brand",
  1: "neutral",
  2: "neutral",
};

const NEW_CLIENT_BADGE_DAYS = 7;

export function isNewClient(
  client: ClientWithMissionsData,
  now: Date,
): boolean {
  const ageMs = now.getTime() - new Date(client.createdAt).getTime();

  return ageMs <= NEW_CLIENT_BADGE_DAYS * 24 * 60 * 60 * 1000;
}

export const COLOR_CLASSES: Record<Color, string> = {
  0: "bg-palette-amber",
  1: "bg-palette-terracotta",
  2: "bg-palette-olive",
  3: "bg-palette-sage",
  4: "bg-palette-slate",
  5: "bg-palette-indigo",
  6: "bg-palette-plum",
  7: "bg-palette-stone",
};

const euros = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 2,
});

function formatAmount(minorUnits: number): string {
  return euros.format(minorUnits / 100);
}

export function formatMissionRate(mission: MissionData): string {
  if (mission.rate === null) {
    return "non facturable";
  }

  const amount = formatAmount(mission.rate.amount);

  switch (mission.billingMode) {
    case 0:
      return `${amount} €/j`;
    case 1:
      return `${amount} €/h`;
    case 2:
      return `${amount} € forfait`;
  }
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
