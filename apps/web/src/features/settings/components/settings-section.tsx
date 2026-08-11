import { cn } from "@opusline/ui/lib/utils";
import { type ReactNode, useId } from "react";

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
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn("rounded-md border bg-card px-7 py-6.5", className)}
    >
      <h2
        className="mb-1 font-heading font-semibold text-base text-foreground-hi"
        id={titleId}
      >
        {title}
      </h2>
      <p className="mb-5 text-muted-foreground-3 text-sm leading-relaxed">
        {description}
      </p>
      {children}
    </section>
  );
}
