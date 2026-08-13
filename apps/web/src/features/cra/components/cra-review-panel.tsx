import type { CraDetailData, SettingsData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";

import { daysLabel, differenceLabel, REVIEW_TITLE } from "../lib/labels";

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
function checksFor(detail: CraDetailData, settings: SettingsData): Check[] {
  const { cra, recipientName } = detail;

  return [
    {
      key: "days",
      title: "Jours saisis",
      detail:
        cra.differenceDays === 0
          ? "conforme au temps suivi ce mois"
          : `${differenceLabel(cra.differenceDays)} par rapport au temps suivi`,
      value: daysLabel(cra.totalDays),
      tone: cra.differenceDays === 0 ? "ok" : "attention",
    },
    {
      key: "recipient",
      title: "Destinataire",
      detail: "signera le bon pour accord",
      value: recipientName,
      tone: "ok",
    },
    {
      key: "signature",
      title: "Signature",
      detail: settings.hasSignature
        ? "prête à être apposée sur le document"
        : "aucune signature enregistrée dans vos réglages",
      value: settings.hasSignature ? "Enregistrée" : "Absente",
      tone: settings.hasSignature ? "ok" : "attention",
    },
  ];
}

type CraReviewPanelProps = {
  detail: CraDetailData;
  settings: SettingsData;
};

export function CraReviewPanel({ detail, settings }: CraReviewPanelProps) {
  return (
    <section className="min-w-0 flex-1 rounded-md border bg-card p-5.5">
      <h2 className="mb-3.5 font-heading font-semibold text-foreground-hi text-lg">
        {REVIEW_TITLE}
      </h2>

      <dl>
        {checksFor(detail, settings).map((check) => (
          <div
            className="flex items-start gap-2.5 border-secondary border-b py-2.75 last:border-b-0"
            key={check.key}
          >
            <span
              aria-hidden
              className={cn(
                "mt-1.5 size-2 shrink-0 rounded-full",
                check.tone === "ok" ? "bg-success" : "bg-primary",
              )}
            />
            <div className="min-w-0">
              <dt className="text-foreground-hi text-sm">{check.title}</dt>
              <dd className="mt-0.5 text-muted-foreground-3 text-xs">
                {check.detail}
              </dd>
            </div>
            <span className="ml-auto whitespace-nowrap font-mono text-foreground-2 text-sm tabular-nums">
              {check.value}
            </span>
          </div>
        ))}
      </dl>
    </section>
  );
}
