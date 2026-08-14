import type { CraDetailData, Locale, SettingsData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";
import { useLocale } from "@/components/money-format-provider";
import {
  CHECK_DAYS,
  CHECK_DAYS_MATCHING,
  CHECK_RECIPIENT,
  CHECK_RECIPIENT_DETAIL,
  CHECK_SIGNATURE,
  CHECK_SIGNATURE_MISSING,
  CHECK_SIGNATURE_OFF,
  CHECK_SIGNATURE_ON,
  CHECK_SIGNATURE_READY,
  checkDaysDrift,
  daysLabel,
  REVIEW_TITLE,
} from "../lib/labels";

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
      title: CHECK_DAYS,
      detail:
        cra.differenceDays === 0
          ? CHECK_DAYS_MATCHING
          : checkDaysDrift(locale, cra.differenceDays),
      value: daysLabel(locale, cra.totalDays),
      tone: cra.differenceDays === 0 ? "ok" : "attention",
    },
    {
      key: "recipient",
      title: CHECK_RECIPIENT,
      detail: CHECK_RECIPIENT_DETAIL,
      value: recipientName,
      tone: "ok",
    },
    {
      key: "signature",
      title: CHECK_SIGNATURE,
      detail: settings.hasSignature
        ? CHECK_SIGNATURE_READY
        : CHECK_SIGNATURE_MISSING,
      value: settings.hasSignature ? CHECK_SIGNATURE_ON : CHECK_SIGNATURE_OFF,
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
        {REVIEW_TITLE}
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
