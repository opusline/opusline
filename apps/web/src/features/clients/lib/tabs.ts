export const CLIENT_TABS = [
  "missions",
  "factures",
  "documents",
  "coordonnees",
] as const;

export type ClientTab = (typeof CLIENT_TABS)[number];

export function isClientTab(value: unknown): value is ClientTab {
  return (CLIENT_TABS as readonly unknown[]).includes(value);
}
