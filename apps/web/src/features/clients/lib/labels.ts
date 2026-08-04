import type {
  ClientType,
  ClientWithMissionsData,
  Color,
  MissionData,
  MissionStatus,
} from "@opusline/api-client";

export const CLIENT_TYPE_LABELS: Record<ClientType, string> = {
  0: "Direct",
  1: "ESN / intermédiaire",
  2: "Interne / perso",
};

export const CLIENT_TYPE_BADGE_VARIANTS: Record<
  ClientType,
  "outline" | "secondary" | "ghost"
> = {
  0: "outline",
  1: "secondary",
  2: "ghost",
};

export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  0: "Active",
  1: "En pause",
  2: "Terminée",
};

export const MISSION_STATUS_BADGE_VARIANTS: Record<
  MissionStatus,
  "default" | "outline" | "secondary"
> = {
  0: "default",
  1: "outline",
  2: "secondary",
};

export const COLOR_CLASSES: Record<Color, string> = {
  0: "bg-amber-500",
  1: "bg-orange-600",
  2: "bg-lime-700",
  3: "bg-emerald-500",
  4: "bg-slate-400",
  5: "bg-indigo-400",
  6: "bg-purple-400",
  7: "bg-stone-400",
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

  if (client.archivedAt !== null) {
    parts.push("archivé");
  }

  return parts.join(" · ");
}
