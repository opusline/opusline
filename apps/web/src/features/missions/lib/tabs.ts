export const MISSION_TABS = [
  "entries",
  "invoices",
  "cra",
  "documents",
  "config",
] as const;

export type MissionTab = (typeof MISSION_TABS)[number];

export function isMissionTab(value: unknown): value is MissionTab {
  return (MISSION_TABS as readonly unknown[]).includes(value);
}
