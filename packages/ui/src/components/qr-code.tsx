import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { useMemo } from "react";
import { encode } from "uqr";

const qrCodeVariants = cva("shrink-0 rounded-md border border-border-2 p-2", {
  variants: {
    size: {
      default: "size-40",
      lg: "size-52",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type QrCodeProps = React.ComponentProps<"svg"> &
  VariantProps<typeof qrCodeVariants> & {
    /** The text the code encodes, verbatim. */
    value: string;
    /** What the code stands for, read out in place of the modules. */
    label: string;
  };

/**
 * Drawn as one path over a white tile whatever the theme: a phone camera
 * reads contrast, not design tokens, and a dark-mode inversion is the one
 * thing that reliably breaks scanning.
 */
function QrCode({ value, label, size, className, ...props }: QrCodeProps) {
  const { modules, moduleCount } = useMemo(() => {
    const { data } = encode(value);

    const path = data
      .flatMap((row, y) =>
        row.flatMap((isDark, x) => (isDark ? [`M${x} ${y}h1v1h-1z`] : [])),
      )
      .join("");

    return { modules: path, moduleCount: data.length };
  }, [value]);

  return (
    <svg
      aria-label={label}
      className={cn(qrCodeVariants({ size }), className)}
      role="img"
      shapeRendering="crispEdges"
      style={{ background: "#fff", color: "#000" }}
      viewBox={`0 0 ${moduleCount} ${moduleCount}`}
      {...props}
    >
      <path d={modules} fill="currentColor" />
    </svg>
  );
}

export { QrCode, qrCodeVariants };
