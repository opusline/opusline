import type { CraStatus } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

const CRA_STATUS_MESSAGES: Record<CraStatus, () => string> = {
  0: m.cra_status_draft,
  1: m.cra_status_sent,
  2: m.cra_status_signed,
};

export function craStatusLabel(status: CraStatus): string {
  return CRA_STATUS_MESSAGES[status]();
}

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
  return { variant: STATUS_TONES[status], label: craStatusLabel(status) };
}
