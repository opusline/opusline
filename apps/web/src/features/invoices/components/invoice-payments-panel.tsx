import type { InvoicePaymentData } from "@opusline/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@opusline/ui/components/alert-dialog";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import { Landmark, Trash2 } from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

type InvoicePaymentsPanelProps = {
  payments: InvoicePaymentData[];
  isPending: boolean;
  /** Takes a payment back; absent where the screen cannot. */
  onRemove?: (payment: number) => void;
};

/** The money that landed on the invoice, payment by payment, each on its own day. */
export function InvoicePaymentsPanel({
  payments,
  isPending,
  onRemove,
}: InvoicePaymentsPanelProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <Panel data-testid="document-payments" padding="none">
      <PanelTitle className="px-4 pt-5">{m.payments_title()}</PanelTitle>
      <ul className="divide-y px-4 pt-3 pb-4">
        {payments.map((payment) => (
          <li
            className="flex items-center justify-between gap-3 py-2.5"
            data-amount-cents={payment.amount.amount}
            data-payment={payment.id}
            data-testid="invoice-payment"
            key={payment.id}
          >
            <span className="flex min-w-0 flex-wrap items-center gap-2 text-sm">
              <span className="text-foreground-2">
                {m.payments_received_on({
                  amount: formatAmountWithCents(format, payment.amount.amount),
                  date: calendarDateNumericLabel(dateFormat, payment.paidOn),
                })}
              </span>
              {payment.bankMovementId === null ? null : (
                <Badge variant="neutral">
                  <Landmark aria-hidden className="size-3" />
                  {m.payments_from_bank()}
                </Badge>
              )}
            </span>
            {onRemove === undefined ? null : (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      aria-label={m.payments_remove()}
                      data-testid="invoice-payment-remove"
                      disabled={isPending}
                      size="icon-lg"
                      variant="ghost"
                    />
                  }
                >
                  <Trash2 />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {m.payments_remove_confirm_title()}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {m.payments_remove_confirm_body()}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
                    <AlertDialogAction
                      data-testid="invoice-payment-remove-confirm"
                      onClick={() => onRemove(payment.id)}
                      render={<Button size="2xl" variant="destructive" />}
                    >
                      {m.payments_remove()}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
