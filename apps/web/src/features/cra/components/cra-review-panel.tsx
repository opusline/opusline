import type { CraDetailData, Locale, SettingsData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";
import { useLocale } from "@/components/money-format-provider";
import { m } from "@/paraglide/messages.js";

import { checkDaysDrift, daysLabel } from "../lib/labels";

type Check = {
  key: string;
  title: string;
  detail: string;
  value: string;
  tone: "ok" | "attention";
};

/**
 * The last look before the month goes out: what it reports, who it is for, and
 * whether it will carry a signature.
 */
function checksFor(
  locale: Locale,
  detail: CraDetailData,
  settings: SettingsData,
): Check[] {
  const { cra, recipientName } = detail;

  return [
    {
      key: "days",
      title: m.cra_check_days(),
      detail:
        cra.differenceDays === 0
          ? m.cra_check_days_matching()
          : checkDaysDrift(locale, cra.differenceDays),
      value: daysLabel(locale, cra.totalDays),
      tone: cra.differenceDays === 0 ? "ok" : "attention",
    },
    {
      key: "recipient",
      title: m.cra_check_recipient(),
      detail: m.cra_check_recipient_detail(),
      value: recipientName,
      tone: "ok",
    },
    {
      key: "signature",
      title: m.cra_review_signature_title(),
      detail: settings.hasSignature
        ? m.cra_check_signature_ready()
        : m.cra_check_signature_missing(),
      value: settings.hasSignature
        ? m.cra_check_signature_on()
        : m.cra_check_signature_off(),
      tone: settings.hasSignature ? "ok" : "attention",
    },
  ];
}

type CraReviewPanelProps = {
  detail: CraDetailData;
  settings: SettingsData;
};

export function CraReviewPanel({ detail, settings }: CraReviewPanelProps) {
  const locale = useLocale();
  return (
    <section className="min-w-0 flex-1 rounded-md border bg-card p-5.5">
      <h2 className="mb-3.5 font-heading font-semibold text-foreground-hi text-lg">
        {m.cra_review_title()}
      </h2>

      <dl>
        {checksFor(locale, detail, settings).map((check) => (
          <div
            className="flex flex-wrap items-start gap-x-2.5 gap-y-0.5 border-secondary border-b py-2.75 last:border-b-0"
            key={check.key}
          >
            <span
              aria-hidden
              className={cn(
                "mt-1.5 size-2 shrink-0 rounded-full",
                check.tone === "ok" ? "bg-success" : "bg-primary",
              )}
            />
            <dt className="min-w-0 text-foreground-hi text-sm">
              {check.title}
            </dt>
            <dd className="ml-auto order-3 whitespace-nowrap font-mono text-foreground-2 text-sm tabular-nums">
              {check.value}
            </dd>
            <dd className="order-4 w-full pl-4.5 text-muted-foreground-3 text-xs">
              {check.detail}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
