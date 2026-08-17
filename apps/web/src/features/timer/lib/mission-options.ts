import type { BillingMode, ClientWithMissionsData } from "@opusline/api-client";

import { formatMissionRate, type MoneyFormat } from "@/lib/billing";
import { isMissionOpenForTime } from "@/lib/mission-status";
import { COLOR_CLASSES } from "@/lib/palette";

export type TimerMissionOption = {
  billingMode: BillingMode;
  colorClass: string;
  isLast: boolean;
  missionId: number;
  name: string;
  subtitle: string;
};

export function trackableMissions(
  format: MoneyFormat,
  clients: ClientWithMissionsData[],
  lastMissionId: number | null,
): TimerMissionOption[] {
  return clients
    .flatMap((client) =>
      client.missions
        .filter((mission) => isMissionOpenForTime(mission, client))
        .map(
          (mission): TimerMissionOption => ({
            billingMode: mission.billingMode,
            colorClass: COLOR_CLASSES[mission.color ?? client.color],
            isLast: mission.id === lastMissionId,
            missionId: mission.id,
            name: mission.name,
            subtitle: `${client.name} · ${formatMissionRate(format, mission)}`,
          }),
        ),
    )
    .sort(
      (left, right) =>
        Number(right.isLast) - Number(left.isLast) ||
        left.name.localeCompare(right.name, format.locale),
    );
}
