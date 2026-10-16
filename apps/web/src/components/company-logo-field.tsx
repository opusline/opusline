import { cn } from "@opusline/ui/lib/utils";

import { LogoPicker } from "@/components/logo-picker";
import { COMPANY_LOGO_RULES, type CompanyLogoSlot } from "@/lib/logos";
import { m } from "@/paraglide/messages.js";

/** The account's logo slot with its title and hint, as the settings and the invoicing page both show it. */
export function CompanyLogoField({
  logo,
  testId,
  className,
}: {
  logo: CompanyLogoSlot;
  testId: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <LogoPicker
        error={logo.error}
        isPending={logo.isPending}
        label={m.settings_logo_input_aria()}
        onPick={logo.onPick}
        onRemove={logo.onRemove}
        placeholder={m.settings_logo_pick()}
        removeLabel={m.settings_logo_remove_aria()}
        rules={COMPANY_LOGO_RULES}
        size="sm"
        src={logo.src}
        testId={testId}
      />
      <span className="min-w-40 flex-1">
        <span className="block text-foreground-hi text-sm">
          {m.settings_logo_title()}
        </span>
        <span className="mt-0.5 block text-muted-foreground-3 text-xs">
          {m.settings_logo_hint()}
        </span>
      </span>
    </div>
  );
}
