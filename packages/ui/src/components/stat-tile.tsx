import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
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

type StatTileProps = useRender.ComponentProps<"div"> &
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
    /**
     * A name the figure belongs to, on the figure's own baseline and in the
     * body face — for a tile answering "which one, and how much" rather than
     * "how much". The figure moves to the end of the row.
     */
    lead?: ReactNode;
  };

/**
 * `render` makes the whole tile the target — pass `render={<Link to="…" />}` and
 * it becomes a link, hover and focus ring included, rather than a div with a
 * click handler nobody can tab to.
 */
function StatTile({
  label,
  value,
  sub,
  meter,
  action,
  lead,
  tone,
  size,
  className,
  render,
  ...props
}: StatTileProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className={eyebrowVariants()}>{label}</div>
        {action}
      </div>
      <div className={cn(statTileValueVariants({ tone, size }))}>
        {lead === undefined ? (
          value
        ) : (
          <span className="flex items-baseline justify-between gap-3.5">
            <span className="min-w-0 truncate font-sans text-base text-foreground-hi">
              {lead}
            </span>
            <span>{value}</span>
          </span>
        )}
      </div>
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
    </>
  );

  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "block bg-card p-3.5 text-left",
          render === undefined
            ? undefined
            : "cursor-pointer transition-colors hover:border-border-4 focus-visible:outline-2 focus-visible:outline-primary-text focus-visible:outline-offset-2",
          className,
        ),
        children: body,
      },
      props,
    ),
    render,
    // Emitted as data-slot: StatTileRow's `cards` variant selects on it to
    // paint the border and radius.
    state: { slot: "stat-tile" },
  });
}

export { StatTile, StatTileRow, statTileRowVariants, statTileValueVariants };
