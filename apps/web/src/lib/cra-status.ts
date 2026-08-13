import type { CraStatus } from "@opusline/api-client";

export const CRA_STATUS_LABELS: Record<CraStatus, string> = {
  0: "Brouillon",
  1: "Envoyé",
  2: "Signé",
};

type BadgeTone = "brand" | "neutral" | "quiet" | "success" | "warn";

/**
 * Brand is the design's "needs your attention" tone, and a sent CRA is the one that
 * asks something of you — a signature you are still waiting on. A draft is yours to
 * finish, and a signed one is the end of the story.
 */
const STATUS_TONES: Record<CraStatus, BadgeTone> = {
  0: "quiet",
  1: "brand",
  2: "success",
};

export function craStatusBadge(status: CraStatus): {
  variant: BadgeTone;
  label: string;
} {
  return { variant: STATUS_TONES[status], label: CRA_STATUS_LABELS[status] };
}
