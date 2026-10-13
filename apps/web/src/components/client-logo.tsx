import { cn } from "@opusline/ui/lib/utils";
import { useState } from "react";

import { initials } from "@/lib/initials";

const SIZE_CLASSES = {
  sm: "size-9 p-1 font-medium text-xs",
  lg: "size-14 p-1.5 font-heading font-medium text-xl tracking-wide sm:size-18 sm:p-2 sm:text-2xl",
} as const;

type ClientLogoProps = {
  name: string;
  /** Omitted while the client has no logo, or before one has been picked. */
  src?: string;
  size: keyof typeof SIZE_CLASSES;
  className?: string;
};

export function ClientLogo({ name, src, size, className }: ClientLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showLogo = src !== undefined && failedSrc !== src;

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border border-border-2 bg-secondary text-muted-foreground-4",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {showLogo ? (
        <img
          alt=""
          className="size-full object-contain"
          onError={() => setFailedSrc(src)}
          src={src}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
