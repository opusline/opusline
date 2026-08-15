import type {
  ClientType,
  ClientWithMissionsData,
  MissionData,
  MissionStatus,
} from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";
import { isInternalClient } from "./client-types";

const MISSION_STATUS_MESSAGES: Record<MissionStatus, () => string> = {
  0: m.mission_status_active,
  1: m.mission_status_paused,
  2: m.mission_status_completed,
};

export function missionStatusLabel(status: MissionStatus): string {
  return MISSION_STATUS_MESSAGES[status]();
}

export const MISSION_STATUS_BADGE_VARIANTS: Record<
  MissionStatus,
  "brand" | "neutral"
> = {
  0: "brand",
  1: "neutral",
  2: "neutral",
};

export function isMissionCompleted(status: MissionStatus): boolean {
  return status === 2;
}

export function isMissionOpenForTime(
  mission: MissionData,
  client: ClientWithMissionsData,
): boolean {
  return !isMissionCompleted(mission.status) && client.archivedAt === null;
}

export function missionStatusBadge(
  status: MissionStatus,
  clientType: ClientType,
): { variant: "brand" | "neutral" | "quiet"; label: string } {
  if (isInternalClient(clientType)) {
    return { variant: "quiet", label: m.mission_status_personal() };
  }

  return {
    variant: MISSION_STATUS_BADGE_VARIANTS[status],
    label: missionStatusLabel(status),
  };
}
