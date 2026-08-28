import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";

const FEEDBACK_MS = 1600;

const PRESETS = {
  default: {
    size: "xl",
    variant: "secondary",
    className: "border-border-4",
  },
  icon: {
    size: "icon-lg",
    variant: "outline",
    className: "border-border-2 text-muted-foreground-3",
  },
} as const;

type CopyButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "size" | "variant"
> & {
  /** What lands on the clipboard, verbatim. */
  value: string;
  /** `icon` drops the text — give it an aria-label. */
  size?: keyof typeof PRESETS;
  label?: string;
  copiedLabel?: string;
  failedLabel?: string;
};

/** Copies its value and flashes the outcome for a moment. */
function CopyButton({
  className,
  size = "default",
  value,
  label,
  copiedLabel,
  failedLabel,
  onClick,
  ...props
}: CopyButtonProps) {
  const [outcome, setOutcome] = useState<{
    state: "copied" | "failed";
  } | null>(null);

  // Each click stores a fresh object, so the effect re-runs and the pending
  // revert is replaced rather than inherited.
  useEffect(() => {
    if (outcome === null) {
      return;
    }

    const revert = setTimeout(() => setOutcome(null), FEEDBACK_MS);

    return () => clearTimeout(revert);
  }, [outcome]);

  const copy = () => {
    // Undefined outside a secure context, and a rejecting promise when the
    // document is not focused — a self-hosted install over plain http hits the
    // first, so it has to say so rather than silently do nothing.
    const clipboard = navigator.clipboard;

    if (clipboard === undefined) {
      setOutcome({ state: "failed" });
      return;
    }

    clipboard
      .writeText(value)
      .then(() => setOutcome({ state: "copied" }))
      .catch(() => setOutcome({ state: "failed" }));
  };

  const preset = PRESETS[size];
  const currentLabel = {
    idle: label,
    copied: copiedLabel,
    failed: failedLabel,
  }[outcome?.state ?? "idle"];

  return (
    <Button
      className={cn(
        "cursor-pointer hover:border-primary hover:text-primary-text data-[state=failed]:border-destructive data-[state=failed]:text-destructive",
        preset.className,
        className,
      )}
      data-state={outcome?.state ?? "idle"}
      onClick={(event) => {
        onClick?.(event);
        copy();
      }}
      size={preset.size}
      variant={preset.variant}
      {...props}
    >
      {outcome?.state === "copied" ? <CheckIcon /> : <CopyIcon />}
      {size === "default" && currentLabel}
      {/* With a visible label the swap already carries the outcome; announcing
          it again would put it in the button's accessible name twice. */}
      {size === "icon" && (
        <span aria-live="polite" className="sr-only">
          {outcome === null ? null : currentLabel}
        </span>
      )}
    </Button>
  );
}

export { CopyButton };
