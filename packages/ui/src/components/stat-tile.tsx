import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const statTileValueVariants = cva(
  "mt-2 whitespace-nowrap font-mono text-xl leading-none tabular-nums",
  {
    variants: {
      tone: {
        default: "text-foreground-2",
        strong: "text-foreground-hi",
        brand: "text-primary-text",
        warn: "text-destructive",
        quiet: "text-muted-foreground-3",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

/**
 * The tiles share hairlines rather than sitting in gapped cards, so the row reads
 * as one band. Callers set the column count — how many fit is a page decision.
 */
function StatTileRow({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-tile-row"
      className={cn(
        "grid gap-px overflow-hidden rounded-md border bg-border",
        className,
      )}
      {...props}
    />
  );
}

type StatTileProps = ComponentProps<"div"> &
  VariantProps<typeof statTileValueVariants> & {
    label: string;
    value: ReactNode;
    /** The line under the figure: what it is made of, or where it comes from. */
    sub?: ReactNode;
  };

function StatTile({
  label,
  value,
  sub,
  tone,
  className,
  ...props
}: StatTileProps) {
  return (
    <div
      data-slot="stat-tile"
      className={cn("bg-card p-3.5", className)}
      {...props}
    >
      <div className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
        {label}
      </div>
      <div className={cn(statTileValueVariants({ tone }))}>{value}</div>
      {sub === undefined ? null : (
        <div className="mt-1.5 text-muted-foreground-3 text-xs">{sub}</div>
      )}
    </div>
  );
}

export { StatTile, StatTileRow, statTileValueVariants };
