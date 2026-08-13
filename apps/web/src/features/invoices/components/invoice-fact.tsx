import { cn } from "@opusline/ui/lib/utils";

const VALUE_CLASSES = {
  figure: "font-mono text-foreground-hi text-sm tabular-nums",
  text: "text-foreground-2 text-sm",
} as const;

type FactProps = {
  label: string;
  value: string;
  /** Amounts and dates read as figures; names read as prose. */
  tone?: keyof typeof VALUE_CLASSES;
};

/** One labelled fact in a `<dl>` — the invoice panel and the create dialog share it. */
export function Fact({ label, value, tone = "figure" }: FactProps) {
  return (
    <div>
      <dt className="text-muted-foreground-3 text-xs">{label}</dt>
      <dd className={cn("mt-1", VALUE_CLASSES[tone])}>{value}</dd>
    </div>
  );
}
