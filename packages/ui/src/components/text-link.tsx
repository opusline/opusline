import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * A link drawn as text rather than as a button — the sanctioned spelling of the
 * role.
 *
 * `--primary` is a fill colour and reads at 3.42:1 as light-mode text, so the
 * theme carries a separate `--link` pair for anything the user clicks in a line
 * of text. Exported as classes too, because most of these links are a router
 * `<Link>` rather than a bare `<a>`.
 */
const linkVariants = cva("text-link transition-colors hover:text-link-hover", {
  variants: {
    size: {
      /** Takes the size of the sentence it sits in. */
      inherit: "",
      xs: "text-xs",
      sm: "text-sm",
    },
    /**
     * A link sitting inside a sentence needs `always`: `--link` clears AA
     * against the surfaces it is painted on but not against the body text
     * around it, and a cue that only appears on hover is no cue at all for a
     * keyboard or a touchscreen (WCAG 1.4.1).
     */
    underline: {
      always: "underline underline-offset-4",
      hover: "hover:underline",
      never: "",
    },
  },
  defaultVariants: {
    size: "inherit",
    underline: "never",
  },
});

function TextLink({
  className,
  size,
  underline,
  ...props
}: React.ComponentProps<"a"> & VariantProps<typeof linkVariants>) {
  return (
    <a
      data-slot="text-link"
      className={cn(linkVariants({ size, underline }), className)}
      {...props}
    />
  );
}

export { linkVariants, TextLink };
