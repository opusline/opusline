import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { cn } from "@opusline/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

const panelVariants = cva("rounded-md border bg-card", {
  variants: {
    /** Rounds off children that run edge to edge — a table, a divided list. */
    clip: {
      true: "overflow-hidden",
      false: "",
    },
    /** `none` is for panels whose children draw their own rows. */
    padding: {
      none: "",
      compact: "px-4 py-3",
      default: "p-5",
      loose: "p-6",
    },
  },
  defaultVariants: {
    clip: false,
    padding: "none",
  },
});

/**
 * The id a `PanelTitle` inside this panel should carry, plus the callback that
 * tells the panel one exists. A `<section>` is only a landmark once it is
 * named, and `aria-labelledby` pointing at nothing is worse than no label at
 * all — so the panel waits to be told rather than guessing.
 */
const PanelTitleContext = createContext<{
  titleId: string;
  registerTitle: () => void;
} | null>(null);

/**
 * The app's section panel: a bordered block of card surface. A panel holding a
 * `PanelTitle` becomes a labelled landmark, so the screens built out of eight
 * of these can be navigated block by block.
 */
function Panel({
  className,
  clip,
  padding,
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof panelVariants>) {
  const titleId = useId();
  const [hasTitle, setHasTitle] = useState(false);
  const registration = useMemo(
    () => ({ titleId, registerTitle: () => setHasTitle(true) }),
    [titleId],
  );

  return (
    <PanelTitleContext value={registration}>
      <section
        data-slot="panel"
        aria-labelledby={hasTitle ? titleId : undefined}
        className={cn(panelVariants({ clip, padding }), className)}
        {...props}
      />
    </PanelTitleContext>
  );
}

const panelHeaderVariants = cva("border-b px-5 py-3.5", {
  variants: {
    layout: {
      block: "",
      /** Title on one side, a count or a control on the other. */
      split: "flex flex-wrap items-baseline justify-between gap-3",
    },
    surface: {
      flat: "",
      sunken: "bg-muted-2",
    },
  },
  defaultVariants: {
    layout: "block",
    surface: "flat",
  },
});

function PanelHeader({
  className,
  layout,
  surface,
  ...props
}: React.ComponentProps<"header"> & VariantProps<typeof panelHeaderVariants>) {
  return (
    <header
      data-slot="panel-header"
      className={cn(panelHeaderVariants({ layout, surface }), className)}
      {...props}
    />
  );
}

const panelTitleVariants = cva("text-foreground-hi", {
  variants: {
    size: {
      eyebrow: eyebrowVariants(),
      sm: "font-medium text-sm",
      default: "font-heading font-semibold text-base",
      lg: "font-heading font-semibold text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/**
 * Panels nest, so the heading level is the caller's to state: a panel inside
 * another panel's body is an `h3`, and an out-of-order heading is a real
 * navigation bug for anyone listing a page by its headings.
 */
function PanelTitle({
  className,
  id,
  level = 2,
  size,
  ...props
}: React.ComponentProps<"h2"> &
  VariantProps<typeof panelTitleVariants> & { level?: 2 | 3 | 4 }) {
  const registration = useContext(PanelTitleContext);
  const register = registration?.registerTitle;
  const Heading = `h${level}` as const;

  useEffect(() => {
    register?.();
  }, [register]);

  return (
    <Heading
      data-slot="panel-title"
      className={cn(panelTitleVariants({ size }), className)}
      id={id ?? registration?.titleId}
      {...props}
    />
  );
}

function PanelDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="panel-description"
      className={cn(
        "text-muted-foreground-3 text-sm leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export {
  Panel,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  panelHeaderVariants,
  panelTitleVariants,
  panelVariants,
};
