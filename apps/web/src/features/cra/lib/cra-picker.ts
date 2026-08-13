import type { CraListItemData, CraStatus } from "@opusline/api-client";

import { foldAccents } from "@/lib/documents";
import { monthTitle } from "@/lib/months";

/**
 * The aside's list: what is owed, what is out, what has come back.
 */

export const CRA_GROUPS = ["toProduce", "sent", "signed"] as const;
export type CraGroupKey = (typeof CRA_GROUPS)[number];

export const CRA_GROUP_LABELS: Record<CraGroupKey, string> = {
  toProduce: "À produire",
  sent: "En attente de signature",
  signed: "Signés",
};

const GROUP_STATUS: Record<CraGroupKey, CraStatus> = {
  toProduce: 0,
  sent: 1,
  signed: 2,
};

/** The dot beside each group heading, in the design's own tones. */
export const CRA_GROUP_DOT_CLASSES: Record<CraGroupKey, string> = {
  toProduce: "bg-primary",
  sent: "bg-muted-foreground-4",
  signed: "bg-success",
};

export type CraGroup = {
  key: CraGroupKey;
  label: string;
  items: CraListItemData[];
};

/**
 * A stable identity for a row that may not exist yet. A month still owed has no id,
 * so mission and month are what tell two of them apart.
 */
export function craItemKey(
  item: Pick<CraListItemData, "missionId" | "month">,
): string {
  return `${item.missionId}:${item.month}`;
}

/**
 * Matches on everything the row shows — the design's placeholder promises "Client,
 * mission, mois", and a search that ignored the month would be lying about it.
 */
export function matchesQuery(item: CraListItemData, query: string): boolean {
  return matchesNeedle(item, foldAccents(query.trim().toLowerCase()));
}

/**
 * The fields are tried in turn rather than folded into one haystack up front: the
 * mission name matches most searches, and `monthTitle` is the expensive one.
 */
function matchesNeedle(item: CraListItemData, needle: string): boolean {
  if (needle === "") {
    return true;
  }

  const matches = (field: string) =>
    foldAccents(field.toLowerCase()).includes(needle);

  return (
    matches(item.missionName) ||
    matches(item.clientName) ||
    matches(item.month) ||
    matches(monthTitle(item.month))
  );
}

/**
 * The list as the aside draws it. Empty groups are dropped rather than shown as a
 * heading with nothing underneath.
 */
export function groupCras(items: CraListItemData[], query: string): CraGroup[] {
  // Folded once rather than once per row: this runs on every keystroke.
  const needle = foldAccents(query.trim().toLowerCase());
  const matching = items.filter((item) => matchesNeedle(item, needle));

  return CRA_GROUPS.map((key) => ({
    key,
    label: CRA_GROUP_LABELS[key],
    items: matching.filter((item) => item.status === GROUP_STATUS[key]),
  })).filter((group) => group.items.length > 0);
}
