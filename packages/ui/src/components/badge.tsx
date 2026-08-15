import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border px-2 py-0.75 text-xs whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted-2 text-muted-foreground",
        quiet: "border-border-2 bg-secondary text-muted-foreground-4",
        brand: "border-primary/40 bg-primary/14 text-primary-text-strong",
        "brand-solid": "border-transparent bg-primary text-primary-foreground",
        success: "border-success/35 bg-success/12 text-success",
        warn: "border-destructive/40 bg-destructive/14 text-destructive",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({
  className,
  variant = "neutral",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
