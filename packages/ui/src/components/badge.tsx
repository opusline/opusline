import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border px-2 py-0.75 text-xs whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted-2 text-muted-foreground",
        quiet: "border-border-2 bg-secondary text-muted-foreground-4",
        brand: "border-primary/40 bg-primary/14 text-primary-text-strong",
        "brand-solid":
          "border-transparent bg-primary text-primary-foreground uppercase",
        success: "border-success/35 bg-success/12 text-success",
        warn: "border-destructive/40 bg-destructive/14 text-destructive",
        attention: "border-attention/40 bg-attention/12 text-attention",
        info: "border-info/38 bg-info/12 text-info",
        "brand-outline": "border-primary/50 bg-transparent text-primary-text",
      },
      shape: {
        default: "rounded-sm",
        pill: "rounded-full px-2.5",
      },
    },
    defaultVariants: {
      variant: "neutral",
      shape: "default",
    },
  },
);

function Badge({
  className,
  variant = "neutral",
  shape,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, shape }), className),
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
