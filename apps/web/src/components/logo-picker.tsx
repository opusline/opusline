import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";
import { XIcon } from "lucide-react";
import { useId, useState } from "react";

import { LOGO_ACCEPT, rejectLogoReason } from "@/lib/logos";

const BOX_CLASSES = {
  sm: "h-15 w-22",
  lg: "h-31 w-49",
} as const;

const SLOT_CLASSES = {
  sm: "rounded-md text-xs",
  lg: "rounded-lg text-sm",
} as const;

const REMOVE_SIZES = { sm: "icon-xs", lg: "icon-sm" } as const;

type LogoPickerProps = {
  /** Accessible name of the file input. */
  label: string;
  /** Accessible name of the remove action, which the input's label can't carry. */
  removeLabel: string;
  /**
   * Current logo, either the stored one or a preview of the picked file. The
   * stored URL is always well-formed even when the client has no logo, so a
   * failed load is what tells us the slot is actually empty.
   */
  src?: string;
  placeholder: string;
  size: keyof typeof BOX_CLASSES;
  onPick: (logo: File) => void;
  onRemove: () => void;
  /** Locks both actions while an upload or a removal is in flight. */
  isPending?: boolean;
  /** Failure coming back from the server, shown under the slot. */
  error?: string | null;
};

export function LogoPicker({
  label,
  removeLabel,
  src,
  placeholder,
  size,
  onPick,
  onRemove,
  isPending,
  error,
}: LogoPickerProps) {
  const messageId = useId();
  const [isDragOver, setIsDragOver] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showLogo = src !== undefined && failedSrc !== src;

  const pick = (files: ArrayLike<File> | null) => {
    const file = files?.[0];

    if (file === undefined || isPending) {
      return;
    }

    const reason = rejectLogoReason(file);
    setRejected(reason);

    if (reason === null) {
      onPick(file);
    }
  };

  const message = rejected ?? error ?? null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className={cn("relative", BOX_CLASSES[size])}>
        <label
          aria-describedby={message === null ? undefined : messageId}
          className={cn(
            "flex size-full items-center justify-center overflow-hidden border border-border-3 border-dashed bg-muted p-1.5 text-center text-muted-foreground-3 transition-colors",
            "has-[input:focus-visible]:border-primary has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-primary/20",
            SLOT_CLASSES[size],
            isPending
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:border-muted-foreground-6",
            isDragOver && !isPending && "border-primary bg-primary/7",
            showLogo && "border-solid bg-card",
          )}
          onDragLeave={() => setIsDragOver(false)}
          onDragOver={(event) => {
            if (isPending) {
              return;
            }

            event.preventDefault();
            setIsDragOver(true);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragOver(false);
            pick(event.dataTransfer.files);
          }}
        >
          <input
            accept={LOGO_ACCEPT}
            aria-label={label}
            className="sr-only"
            disabled={isPending}
            onChange={(event) => {
              pick(event.target.files);
              event.target.value = "";
            }}
            type="file"
          />
          {showLogo ? (
            <img
              alt=""
              className="size-full object-contain"
              onError={() => setFailedSrc(src)}
              src={src}
            />
          ) : (
            placeholder
          )}
        </label>
        {showLogo && (
          <Button
            aria-label={removeLabel}
            className="absolute top-1 right-1"
            disabled={isPending}
            onClick={onRemove}
            size={REMOVE_SIZES[size]}
            variant="outline"
          >
            <XIcon aria-hidden />
          </Button>
        )}
      </div>
      {message !== null && (
        <span className="text-destructive text-xs" id={messageId} role="alert">
          {message}
        </span>
      )}
    </div>
  );
}
