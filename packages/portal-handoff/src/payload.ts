/**
 * What the web app hands to the browser extension through the portal URL's
 * fragment. Amounts are whole euros — the portals reject cents — and the
 * version lets a newer web app and an older extension fail closed instead of
 * filling the wrong box.
 */
export const HANDOFF_VERSION = 1;

export type Portal = "urssaf" | "impots";

/** The 3310-CA3 lines the extension fills; `08_tax` is the tax column of line 08. */
export const CA3_BOXES = [
  "A1",
  "2A",
  "3B",
  "08",
  "08_tax",
  "19",
  "20",
  "21",
  "22",
  "25",
  "32",
] as const;

export type Ca3Box = (typeof CA3_BOXES)[number];

type HandoffBase = {
  v: typeof HANDOFF_VERSION;
  /** `YYYY-MM`, or `YYYY-Qn` for a quarterly URSSAF declaration. */
  period: string;
  /** ISO 8601 instant the web app built the payload; the extension expires it. */
  issuedAt: string;
};

export type UrssafHandoff = HandoffBase & {
  portal: "urssaf";
  fields: { turnover: number };
};

export type ImpotsHandoff = HandoffBase & {
  portal: "impots";
  fields: Partial<Record<Ca3Box, number>>;
};

export type HandoffPayload = UrssafHandoff | ImpotsHandoff;
