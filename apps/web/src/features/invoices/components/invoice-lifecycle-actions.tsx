import type { InvoiceData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Input } from "@opusline/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { Label } from "@opusline/ui/components/label";
import { useId, useState } from "react";

import { DateField } from "@/components/date-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import {
  currencySymbol,
  formatAmount,
  formatAmountWithCents,
  parseAmountToCents,
} from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

type InvoiceLifecycleActionsProps = {
  invoice: InvoiceData;
  isPending: boolean;
  error: string | null;
  /** Today in the account's timezone — the date the API's fiscal rules accept. */
  accountToday: string;
  /** The reference is only supplied when the draft does not carry one yet. */
  onSend: (reference: string | null, sentOn: string) => void;
  /** The amount is null for the whole balance, which the API takes as its default. */
  onPay: (paidOn: string, amountCents: number | null) => void;
  onRemind: () => void;
  /** Drafts only: an issued invoice is part of the record and cannot be removed. */
  onDelete: () => void;
};

/**
 * Moving an invoice along: sent, then paid, with a reminder noted in between.
 *
 * Each step is its own endpoint rather than a status field, so each one lands in the
 * invoice's history — which is the record that matters when a client asks when they
 * were chased. A payment short of the balance leaves the invoice here, partly paid,
 * until the rest lands; once it is paid, the payments are the record to correct.
 */
export function InvoiceLifecycleActions({
  invoice,
  isPending,
  error,
  accountToday,
  onSend,
  onPay,
  onRemind,
  onDelete,
}: InvoiceLifecycleActionsProps) {
  // Paid or cancelled: the money is in, or nothing is due under it any more.
  if (invoice.status === 2 || invoice.status === 3) {
    return null;
  }

  return (
    <section className="border-t px-4 py-5">
      {invoice.status === 0 ? (
        <>
          <SendStep
            accountToday={accountToday}
            invoice={invoice}
            isPending={isPending}
            onSend={onSend}
          />
          <Button
            className="mt-4"
            data-testid="invoice-delete-draft"
            disabled={isPending}
            onClick={onDelete}
            size="xl"
            type="button"
            variant="destructive"
          >
            {m.invoices_delete_draft()}
          </Button>
        </>
      ) : (
        <CollectStep
          // A payment changes the balance: the amount field opens on the new one.
          key={invoice.amountDue.amount}
          accountToday={accountToday}
          invoice={invoice}
          isPending={isPending}
          onPay={onPay}
          onRemind={onRemind}
        />
      )}

      {error !== null && (
        <p className="mt-3 text-destructive text-sm" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

function SendStep({
  accountToday,
  invoice,
  isPending,
  onSend,
}: {
  accountToday: string;
  invoice: InvoiceData;
  isPending: boolean;
  onSend: (reference: string | null, sentOn: string) => void;
}) {
  const referenceFieldId = useId();
  const sentOnFieldId = useId();
  const [reference, setReference] = useState("");
  // The invoice's own date, because most go out the day they are written; a
  // draft prepared on Friday and posted on Monday says so instead.
  const [sentOn, setSentOn] = useState(invoice.issuedOn);
  const needsReference = invoice.number === null;
  const trimmed = reference.trim();

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSend(needsReference ? trimmed : null, sentOn);
      }}
    >
      {needsReference && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={referenceFieldId}>
            {m.invoices_reference_label()}
          </Label>
          <Input
            id={referenceFieldId}
            value={reference}
            placeholder="F-2026-001"
            onChange={(event) => setReference(event.target.value)}
          />
          <p className="text-muted-foreground-3 text-xs">
            {m.invoices_send_reference_hint()}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={sentOnFieldId}>{m.invoices_sent_on_label()}</Label>
        <DateField
          id={sentOnFieldId}
          max={accountToday}
          min={invoice.issuedOn}
          onChange={setSentOn}
          value={sentOn}
        />
        <p className="text-muted-foreground-3 text-xs">
          {m.invoices_sent_on_hint()}
        </p>
      </div>

      <Button
        data-testid="invoice-mark-sent"
        type="submit"
        className="self-start"
        disabled={
          isPending || sentOn === "" || (needsReference && trimmed === "")
        }
        size="xl"
      >
        {isPending ? m.common_saving() : m.invoices_mark_sent()}
      </Button>
    </form>
  );
}

function CollectStep({
  accountToday,
  invoice,
  isPending,
  onPay,
  onRemind,
}: {
  accountToday: string;
  invoice: InvoiceData;
  isPending: boolean;
  onPay: (paidOn: string, amountCents: number | null) => void;
  onRemind: () => void;
}) {
  const format = useMoneyFormat();
  const paidOnFieldId = useId();
  const amountFieldId = useId();
  const [paidOn, setPaidOn] = useState(accountToday);
  const due = invoice.amountDue.amount;
  const [amount, setAmount] = useState(formatAmount(format, due));
  const amountCents = parseAmountToCents(format.locale, amount);
  const isAmountInvalid = amountCents === null || amountCents > due;
  const isPartial = amountCents !== null && amountCents < due;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();

        if (amountCents === null || amountCents > due) {
          return;
        }

        // The whole balance is the API's default: sending it would only
        // repeat what it already knows.
        onPay(paidOn, amountCents === due ? null : amountCents);
      }}
    >
      {invoice.amountPaid.amount > 0 ? (
        <p
          className="text-foreground-2 text-sm"
          data-amount-cents={due}
          data-testid="invoice-balance-due"
        >
          {m.invoices_balance_due({
            amount: formatAmountWithCents(format, due),
          })}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={amountFieldId}>{m.invoices_amount_label()}</Label>
        <InputGroup className="max-w-56">
          <InputGroupInput
            aria-invalid={isAmountInvalid}
            data-testid="invoice-amount-received"
            id={amountFieldId}
            inputMode="decimal"
            onChange={(event) => setAmount(event.target.value)}
            value={amount}
          />
          <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
        </InputGroup>
        <p
          className={
            isAmountInvalid
              ? "text-destructive text-xs"
              : "text-muted-foreground-3 text-xs"
          }
        >
          {isAmountInvalid
            ? m.invoices_amount_invalid()
            : m.invoices_amount_hint({
                due: formatAmountWithCents(format, due),
              })}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={paidOnFieldId}>{m.invoices_paid_on_label()}</Label>
        <DateField
          id={paidOnFieldId}
          max={accountToday}
          min={invoice.issuedOn}
          onChange={setPaidOn}
          value={paidOn}
        />
        <p className="text-muted-foreground-3 text-xs">
          {m.invoices_paid_on_hint()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          data-testid="invoice-mark-collected"
          disabled={isPending || paidOn === "" || isAmountInvalid}
          size="xl"
          type="submit"
        >
          {isPending
            ? m.common_saving()
            : isPartial
              ? m.invoices_record_payment()
              : m.invoices_mark_paid()}
        </Button>
        <Button
          data-testid="invoice-remind"
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onRemind}
          size="xl"
        >
          {m.invoices_note_reminder()}
        </Button>
      </div>
    </form>
  );
}
