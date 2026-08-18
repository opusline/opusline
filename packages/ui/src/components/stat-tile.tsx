import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const statTileValueVariants = cva(
  "mt-2 whitespace-nowrap font-mono leading-none tabular-nums",
  {
    variants: {
      tone: {
        default: "text-foreground-2",
        strong: "text-foreground-hi",
        brand: "text-primary-text",
        warn: "text-destructive",
        quiet: "text-muted-foreground-3",
      },
      size: {
        default: "text-xl",
        lg: "text-2xl",
      },
    },
    defaultVariants: {
      tone: "default",
      size: "default",
    },
  },
);

const statTileRowVariants = cva("grid", {
  variants: {
    variant: {
      /** Hairline-shared, so a run of related figures reads as one band. */
      band: "gap-px overflow-hidden rounded-md border bg-border",
      /** Standalone cards, for tiles that answer separate questions. */
      cards:
        "gap-4 *:data-[slot=stat-tile]:rounded-md *:data-[slot=stat-tile]:border",
    },
  },
  defaultVariants: {
    variant: "band",
  },
});

/**
 * Callers set the column count — how many tiles fit is a page decision.
 */
function StatTileRow({
  className,
  variant,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof statTileRowVariants>) {
  return (
    <div
      data-slot="stat-tile-row"
      className={cn(statTileRowVariants({ variant }), className)}
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
    /**
     * How far through its ceiling the figure sits, as a 0–1 ratio, drawn as a
     * bar between the figure and the sub line. Decorative on purpose: the two
     * lines around it already say the same thing in words.
     */
    meter?: number;
    /** An affordance sitting right of the label, e.g. an edit icon button. */
    action?: ReactNode;
  };

function StatTile({
  label,
  value,
  sub,
  meter,
  action,
  tone,
  size,
  className,
  ...props
}: StatTileProps) {
  return (
    <div
      data-slot="stat-tile"
      className={cn("bg-card p-3.5", className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
          {label}
        </div>
        {action}
      </div>
      <div className={cn(statTileValueVariants({ tone, size }))}>{value}</div>
      {meter === undefined || !Number.isFinite(meter) ? null : (
        <div
          aria-hidden
          className="mt-2.5 h-1.5 overflow-hidden rounded-sm bg-secondary-2"
        >
          <div
            className="h-full bg-primary"
            style={{ width: `${Math.min(Math.max(meter, 0), 1) * 100}%` }}
          />
        </div>
      )}
      {sub === undefined ? null : (
        <div className="mt-1.5 text-muted-foreground-3 text-xs">{sub}</div>
      )}
    </div>
  );
}

export { StatTile, StatTileRow, statTileRowVariants, statTileValueVariants };
