import type { ClientType, MissionStatus } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";

import { missionStatusBadge } from "@/lib/mission-status";

type MissionStatusBadgeProps = {
  status: MissionStatus;
  clientType: ClientType;
};

export function MissionStatusBadge({
  status,
  clientType,
}: MissionStatusBadgeProps) {
  const { variant, label } = missionStatusBadge(status, clientType);

  return <Badge variant={variant}>{label}</Badge>;
}
