import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { CheckIcon } from "lucide-react";

import {
  useDateFormat,
  useLocale,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { monthName } from "../lib/labels";

type DeclaredBannerProps = {
  /** `YYYY-MM`. */
  month: string;
  /** `Y-m-d`. */
  declaredOn: string;
  deductedCents: number;
  isBusy: boolean;
  onUndo: () => void;
};

export function DeclaredBanner({
  month,
  declaredOn,
  deductedCents,
  isBusy,
  onUndo,
}: DeclaredBannerProps) {
  const locale = useLocale();
  const dateFormat = useDateFormat();
  const format = useMoneyFormat();

  return (
    <Alert variant="success">
      <CheckIcon />
      <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
        <span>
          {m.expenses_declared_banner({
            month: monthName(locale, month),
            date: calendarDateNumericLabel(dateFormat, declaredOn),
            amount: formatAmountWithCents(format, deductedCents),
          })}
        </span>
        <Button disabled={isBusy} onClick={onUndo} size="sm" variant="link">
          {m.expenses_declared_undo()}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
