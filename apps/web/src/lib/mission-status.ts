import type { MissionStatus } from "@opusline/api-client";

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
