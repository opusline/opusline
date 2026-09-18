import type {
  LiberatingPaymentOutlookData,
  Locale,
} from "@opusline/api-client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@opusline/ui/components/alert";
import { linkVariants } from "@opusline/ui/components/text-link";
import { Link } from "@tanstack/react-router";
import { CircleAlert, Info } from "lucide-react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import {
  cachedFormatter,
  formatWholeAmount,
  type MoneyFormat,
} from "@/lib/billing";
import { calendarDateLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

type LiberatingPaymentNoticeProps = {
  outlook: LiberatingPaymentOutlookData;
  /** `Y-m-d`, the account's today: an end already past asks to act now, not on the day. */
  today: string;
};

const QUARTER_PARTS_PER_PART = 4;

/**
 * Says when the versement libératoire has to be switched off, and why — the
 * option is never turned off for the user, since the change belongs to a
 * 1 January and to their settings. Without an end in sight it only asks for
 * the avis figures that could announce one.
 */
export function LiberatingPaymentNotice({
  outlook,
  today,
}: LiberatingPaymentNoticeProps) {
  const locale = useLocale();
  const format = useMoneyFormat();
  const settingsLink = (
    <Link
      className={linkVariants({ underline: "always" })}
      search={{ tab: "fiscalite" }}
      to="/settings"
    >
      {m.declarations_liberating_settings_link()}
    </Link>
  );

  if (outlook.endsOn === null) {
    return outlook.needsReferenceTaxIncome ? (
      <Alert
        data-testid="declarations-liberating-payment"
        data-state="needs-income"
        variant="brand"
      >
        <Info aria-hidden />
        <AlertDescription>
          {m.declarations_liberating_needs_income()} {settingsLink}
        </AlertDescription>
      </Alert>
    ) : null;
  }

  const date = calendarDateLabel(locale, outlook.endsOn);
  const hasEnded = outlook.endsOn <= today;

  return (
    <Alert
      data-ends-on={outlook.endsOn}
      data-reason={outlook.reason ?? undefined}
      data-state={hasEnded ? "ended" : "ending"}
      data-testid="declarations-liberating-payment"
      variant="warn"
    >
      <CircleAlert aria-hidden />
      <AlertTitle>
        {hasEnded
          ? m.declarations_liberating_ended_title({ date })
          : m.declarations_liberating_ends_title({ date })}
      </AlertTitle>
      <AlertDescription>
        {endReason(outlook, format, locale)}{" "}
        {hasEnded
          ? m.declarations_liberating_ended_action()
          : m.declarations_liberating_ends_action()}{" "}
        {settingsLink}
      </AlertDescription>
    </Alert>
  );
}

function endReason(
  outlook: LiberatingPaymentOutlookData,
  format: MoneyFormat,
  locale: Locale,
): string | null {
  if (outlook.ceiling !== null) {
    return m.declarations_liberating_ceiling_reason({
      ceiling: formatWholeAmount(format, outlook.ceiling.amount),
    });
  }

  if (
    outlook.referenceTaxIncome === null ||
    outlook.referenceTaxIncomeYear === null ||
    outlook.referenceTaxIncomeLimit === null ||
    outlook.taxHouseholdQuarterParts === null
  ) {
    return null;
  }

  const parts = outlook.taxHouseholdQuarterParts / QUARTER_PARTS_PER_PART;

  return m.declarations_liberating_income_reason({
    count: parts,
    year: outlook.referenceTaxIncomeYear,
    income: formatWholeAmount(format, outlook.referenceTaxIncome.amount),
    limit: formatWholeAmount(format, outlook.referenceTaxIncomeLimit.amount),
    parts: cachedFormatter(locale, { maximumFractionDigits: 2 }).format(parts),
  });
}
