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

type CopyButtonOwnProps = {
  /** What lands on the clipboard, verbatim. */
  value: string;
  size?: keyof typeof PRESETS;
  label?: string;
  /** Both outcomes are required: they replace the visible label, so an absent
   *  one would leave the button wordless the moment it is pressed. */
  copiedLabel: string;
  failedLabel: string;
};

/**
 * `default` shows its label, `icon` shows none — so the union makes each preset
 * demand whatever gives it an accessible name.
 */
type CopyButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "size" | "variant"
> &
  CopyButtonOwnProps &
  (
    | { size?: "default"; label: string }
    | { size: "icon"; "aria-label": string }
  );

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
  const outcomeLabel =
    outcome === null
      ? null
      : { copied: copiedLabel, failed: failedLabel }[outcome.state];

  return (
    <>
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
        {size === "default" && (outcomeLabel ?? label)}
      </Button>
      {/* A sibling, never a child: inside the button its text would join the
          accessible name. `sr-only` is absolutely positioned, so it stays out
          of the flex flow of whatever row holds the button. */}
      <span aria-live="polite" className="sr-only">
        {outcomeLabel}
      </span>
    </>
  );
}

export { CopyButton };
