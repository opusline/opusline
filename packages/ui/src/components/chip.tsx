import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

function ChipGroup({ className, ...props }: ToggleGroupPrimitive.Props) {
  return (
    <ToggleGroupPrimitive
      data-slot="chip-group"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  );
}

const chipVariants = cva(
  "group/chip inline-flex items-center whitespace-nowrap border border-border-2 bg-transparent text-muted-foreground-3 transition-colors outline-none hover:border-muted-foreground-6 hover:text-foreground-hi focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-pressed:border-primary/45 data-pressed:bg-primary/10 data-pressed:text-primary-text",
  {
    variants: {
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-8 px-3 text-sm",
        lg: "h-9 px-3.5 text-sm",
        xl: "h-10 px-3.5 text-sm",
      },
      shape: {
        square: "rounded-md",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "square",
    },
  },
);

function Chip({
  className,
  size,
  shape,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof chipVariants>) {
  return (
    <TogglePrimitive
      data-slot="chip"
      className={cn(chipVariants({ size, shape }), className)}
      {...props}
    />
  );
}

const chipOptionVariants = cva(
  "group/chip flex flex-col gap-0.5 rounded-md border border-border-2 bg-transparent px-3.5 py-2.5 transition-colors outline-none hover:border-muted-foreground-6 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-pressed:border-primary/45 data-pressed:bg-primary/10",
  {
    variants: {
      align: {
        start: "items-start text-left",
        center: "items-center justify-center text-center",
      },
      font: {
        sans: "",
        mono: "font-mono tabular-nums",
      },
    },
    defaultVariants: { align: "start", font: "sans" },
  },
);

function ChipOption({
  align,
  className,
  font,
  label,
  hint,
  ...props
}: TogglePrimitive.Props &
  VariantProps<typeof chipOptionVariants> & {
    label: string;
    hint?: string;
  }) {
  return (
    <TogglePrimitive
      data-slot="chip-option"
      className={cn(chipOptionVariants({ align, font }), className)}
      {...props}
    >
      <span className="font-medium text-foreground-3 text-sm group-data-pressed/chip:text-primary-text">
        {label}
      </span>
      {hint !== undefined && (
        <span className="font-sans text-muted-foreground-3 text-xs">
          {hint}
        </span>
      )}
    </TogglePrimitive>
  );
}

function ChipCount({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chip-count"
      className={cn(
        "ml-2 font-mono text-muted-foreground-5 text-xs tabular-nums group-data-pressed/chip:text-primary-note",
        className,
      )}
      {...props}
    />
  );
}

export {
  Chip,
  ChipCount,
  ChipGroup,
  ChipOption,
  chipOptionVariants,
  chipVariants,
};
