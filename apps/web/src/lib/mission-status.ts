import type { ClientType, MissionStatus } from "@opusline/api-client";

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

export function missionStatusBadge(
  status: MissionStatus,
  clientType: ClientType,
): { variant: "brand" | "neutral" | "quiet"; label: string } {
  if (clientType === 2) {
    return { variant: "quiet", label: "Perso" };
  }

  return {
    variant: MISSION_STATUS_BADGE_VARIANTS[status],
    label: MISSION_STATUS_LABELS[status],
  };
}
