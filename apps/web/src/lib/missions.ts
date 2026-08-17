import type { ClientWithMissionsData, MissionData } from "@opusline/api-client";

/**
 * Missions arrive nested under their client, so anything holding a bare mission
 * id — a running timer, a time entry — has to walk the clients to resolve it.
 */
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
