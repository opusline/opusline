import type { RecurringDebitData } from "@opusline/api-client";
import {
  Alert,
  AlertAction,
  AlertDescription,
} from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { RefreshCwIcon } from "lucide-react";

import { useLocale, useMoneyFormat } from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import { monthName } from "../lib/labels";

type DetectedDebitBannerProps = {
  debit: RecurringDebitData;
  isBusy: boolean;
  onCreate: (debit: RecurringDebitData) => void;
  onDismiss: (debit: RecurringDebitData) => void;
};

/** The same compte-pro debit three months running, with no subscription behind it. */
export function DetectedDebitBanner({
  debit,
  isBusy,
  onCreate,
  onDismiss,
}: DetectedDebitBannerProps) {
  const format = useMoneyFormat();
  const locale = useLocale();

  return (
    <Alert variant="brand">
      <RefreshCwIcon />
      <AlertDescription>
        <span className="text-foreground-hi">
          {m.subscriptions_detected_title({
            label: debit.label,
            amount: formatAmountWithCents(format, debit.amount.amount),
            day: debit.debitDay,
            count: debit.months.length,
          })}
        </span>
        <span className="mt-0.5 block text-muted-foreground-3 text-xs">
          {m.subscriptions_detected_sub({
            months: debit.months
              .map((month) => monthName(locale, month))
              .join(", "),
          })}
        </span>
      </AlertDescription>
      <AlertAction>
        <Button
          disabled={isBusy}
          onClick={() => onCreate(debit)}
          size="lg"
          variant="secondary"
        >
          {m.subscriptions_detected_create()}
        </Button>
        <Button
          disabled={isBusy}
          onClick={() => onDismiss(debit)}
          size="lg"
          variant="ghost"
        >
          {m.subscriptions_detected_dismiss()}
        </Button>
      </AlertAction>
    </Alert>
  );
}
