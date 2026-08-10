import type {
  BillingMode,
  ClientWithMissionsData,
  MissionData,
} from "@opusline/api-client";

import { formatMissionRate } from "@/lib/billing";
import { COLOR_CLASSES } from "@/lib/palette";

export type TimerMissionOption = {
  billingMode: BillingMode;
  colorClass: string;
  isLast: boolean;
  missionId: number;
  name: string;
  subtitle: string;
};

function isTrackable(
  mission: MissionData,
  client: ClientWithMissionsData,
): boolean {
  return mission.status !== 2 && client.archivedAt === null;
}

export function trackableMissions(
  clients: ClientWithMissionsData[],
  lastMissionId: number | null,
): TimerMissionOption[] {
  return clients
    .flatMap((client) =>
      client.missions
        .filter((mission) => isTrackable(mission, client))
        .map(
          (mission): TimerMissionOption => ({
            billingMode: mission.billingMode,
            colorClass: COLOR_CLASSES[mission.color ?? client.color],
            isLast: mission.id === lastMissionId,
            missionId: mission.id,
            name: mission.name,
            subtitle: `${client.name} · ${formatMissionRate(mission)}`,
          }),
        ),
    )
    .sort(
      (left, right) =>
        Number(right.isLast) - Number(left.isLast) ||
        left.name.localeCompare(right.name, "fr"),
    );
}

export function findMissionById(
  clients: ClientWithMissionsData[],
  missionId: number,
): MissionData | null {
  for (const client of clients) {
    const mission = client.missions.find(
      (candidate) => candidate.id === missionId,
    );

    if (mission !== undefined) {
      return mission;
    }
  }

  return null;
}
