export type PillSkin = "billedDay" | "hourly" | "nonBillable" | "live";

export const PILL_SKINS: Record<
  PillSkin,
  { label: string; swatch: string; pill: string; note: string }
> = {
  billedDay: {
    label: "Jour facturé au TJM",
    swatch: "border-primary/50 bg-primary/15",
    pill: "border-primary/50 bg-primary/15 text-primary-text group-hover:bg-primary/25",
    note: "text-primary-note",
  },
  hourly: {
    label: "Heures",
    swatch: "border-border-3 bg-secondary",
    pill: "border-border-3 bg-secondary text-foreground-2 group-hover:border-muted-foreground-6",
    note: "text-muted-foreground-4",
  },
  nonBillable: {
    label: "Non facturable",
    swatch: "border-border-3 bg-stripes",
    pill: "border-border-3 bg-stripes text-muted-foreground group-hover:border-muted-foreground-6",
    note: "text-muted-foreground-4",
  },
  live: {
    label: "Suivi en cours",
    swatch: "border-primary/65 border-dashed bg-primary/9",
    pill: "border-primary/65 border-dashed bg-primary/9 text-primary-text",
    note: "text-primary-note",
  },
};
