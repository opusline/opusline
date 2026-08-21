import type {
  ClientType,
  ClientWithMissionsData,
  MissionData,
  MissionStatus,
} from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";
import { missionBills } from "./billing";
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

/**
 * Whether an invoice can be recorded against this mission. Unlike tracking time, a
 * finished mission still bills — the invoice usually comes after the work — but an
 * internal client has nobody to invoice, and a mission with no rate is not billable
 * by construction.
 */
export function isMissionOpenForInvoicing(
  mission: MissionData,
  client: ClientWithMissionsData,
): boolean {
  return (
    missionBills(mission) &&
    !isInternalClient(client.type) &&
    client.archivedAt === null
  );
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
