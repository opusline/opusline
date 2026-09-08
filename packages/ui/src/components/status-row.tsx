import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusRowVariants = cva("flex flex-wrap items-center gap-4 px-4 py-3.5", {
  variants: {
    /** `muted` is a standalone tile; `plain` is one row of a bordered `divide-y` list. */
    surface: {
      muted: "rounded-md border bg-muted",
      plain: "",
    },
  },
  defaultVariants: {
    surface: "muted",
  },
});

/** A thing and its state: an icon tile, a title with an optional badge, a hint, and the actions on it. */
function StatusRow({
  className,
  surface,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof statusRowVariants>) {
  return (
    <div
      data-slot="status-row"
      className={cn(statusRowVariants({ surface }), className)}
      {...props}
    />
  );
}

function StatusRowMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="status-row-media"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground-3 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function StatusRowContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="status-row-content"
      className={cn("min-w-40 flex-1", className)}
      {...props}
    />
  );
}

function StatusRowTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="status-row-title"
      className={cn(
        "flex flex-wrap items-center gap-2 text-foreground-hi text-sm",
        className,
      )}
      {...props}
    />
  );
}

function StatusRowDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="status-row-description"
      className={cn(
        "mt-0.5 text-muted-foreground-3 text-xs leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

function StatusRowActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="status-row-actions"
      className={cn("ml-auto flex shrink-0 items-center gap-2", className)}
      {...props}
    />
  );
}

export {
  StatusRow,
  StatusRowActions,
  StatusRowContent,
  StatusRowDescription,
  StatusRowMedia,
  StatusRowTitle,
  statusRowVariants,
};
