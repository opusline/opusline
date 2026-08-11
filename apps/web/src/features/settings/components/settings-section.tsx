import { cn } from "@opusline/ui/lib/utils";
import type { ReactNode } from "react";

type SettingsSectionProps = {
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
};

export function SettingsSection({
  title,
  description,
  className,
  children,
}: SettingsSectionProps) {
  return (
    <div className={cn("rounded-md border bg-card px-7 py-6.5", className)}>
      <div className="mb-1 font-heading font-semibold text-base text-foreground-hi">
        {title}
      </div>
      <p className="mb-5 text-muted-foreground-3 text-sm leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}
