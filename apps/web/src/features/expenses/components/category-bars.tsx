import { Eyebrow } from "@opusline/ui/components/eyebrow";
import { Meter } from "@opusline/ui/components/meter";
import { useId } from "react";

export type CategoryBarRow = {
  key: string;
  label: string;
  cents: number;
  /** The grouped « Abonnements » row reads quieter than a category. */
  tone?: "brand" | "quiet";
};

type CategoryBarsProps = {
  title: string;
  caption: string;
  rows: CategoryBarRow[];
  formatValue: (cents: number) => string;
};

/** Each bar against the largest, the amount at its right. */
export function CategoryBars({
  title,
  caption,
  rows,
  formatValue,
}: CategoryBarsProps) {
  const id = useId();
  const largest = Math.max(...rows.map((row) => row.cents), 0);

  return (
    <section className="rounded-md border bg-card px-5 py-4.5">
      <div className="mb-3.5 flex items-baseline justify-between gap-2.5">
        <Eyebrow>{title}</Eyebrow>
        <span className="text-muted-foreground-3 text-xs">{caption}</span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {rows.map((row, index) => (
          <li
            className="grid grid-cols-[7rem_minmax(0,1fr)_5.5rem] items-center gap-3 text-sm"
            key={row.key}
          >
            <span className="truncate text-foreground-3" id={`${id}-${index}`}>
              {row.label}
            </span>
            <Meter
              aria-labelledby={`${id}-${index}`}
              getAriaValueText={() => formatValue(row.cents)}
              tone={row.tone ?? "brand"}
              value={largest === 0 ? 0 : row.cents / largest}
            />
            <span className="text-right font-mono text-foreground-2 tabular-nums">
              {formatValue(row.cents)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
