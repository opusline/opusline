import { m } from "@/paraglide/messages.js";

export type PillSkin = "billedDay" | "hourly" | "nonBillable" | "live";

export const PILL_SKINS: Record<
  PillSkin,
  { label: () => string; swatch: string; pill: string; note: string }
> = {
  billedDay: {
    label: m.week_skin_billed_day,
    swatch: "border-primary/50 bg-primary/15",
    pill: "border-primary/50 bg-primary/15 text-primary-text group-hover:bg-primary/25",
    note: "text-primary-note",
  },
  hourly: {
    label: m.week_skin_hourly,
    swatch: "border-border-3 bg-secondary",
    pill: "border-border-3 bg-secondary text-foreground-2 group-hover:border-muted-foreground-6",
    note: "text-muted-foreground-4",
  },
  nonBillable: {
    label: m.timer_non_billable,
    swatch: "border-border-3 bg-stripes",
    pill: "border-border-3 bg-stripes text-muted-foreground group-hover:border-muted-foreground-6",
    note: "text-muted-foreground-4",
  },
  live: {
    label: m.timer_running_state,
    swatch: "border-primary/65 border-dashed bg-primary/9",
    pill: "border-primary/65 border-dashed bg-primary/9 text-primary-text",
    note: "text-primary-note",
  },
};

/**
 * The mark on a cell holding time no invoice covers yet. Not a PillSkin: it sits
 * on top of whichever skin the pill already wears rather than replacing it, so it
 * carries only the ring itself — callers add their own placement.
 */
export const UNINVOICED_RING =
  "size-2 rounded-full border-2 border-primary-note";
