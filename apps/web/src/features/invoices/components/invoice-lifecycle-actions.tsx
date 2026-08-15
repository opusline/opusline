import type { InvoiceData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Input } from "@opusline/ui/components/input";
import { Label } from "@opusline/ui/components/label";
import { useId, useState } from "react";

import { m } from "@/paraglide/messages.js";

type InvoiceLifecycleActionsProps = {
  invoice: InvoiceData;
  isPending: boolean;
  error: string | null;
  /** Today in the account's timezone — the date the API's fiscal rules accept. */
  accountToday: string;
  /** The reference is only supplied when the draft does not carry one yet. */
  onSend: (reference: string | null) => void;
  onPay: (paidOn: string) => void;
  onRemind: () => void;
};

/**
 * Moving an invoice along: sent, then paid, with a reminder noted in between.
 *
 * Each step is its own endpoint rather than a status field, so each one lands in the
 * invoice's history — which is the record that matters when a client asks when they
 * were chased. Paid is the end of the road here: correcting a payment date shifts
 * revenue between declaration periods and goes through an edit, not a transition.
 */
export function InvoiceLifecycleActions({
  invoice,
  isPending,
  error,
  accountToday,
  onSend,
  onPay,
  onRemind,
}: InvoiceLifecycleActionsProps) {
  if (invoice.status === 2) {
    return null;
  }

  return (
    <section className="border-t px-4 py-5">
      {invoice.status === 0 ? (
        <SendStep invoice={invoice} isPending={isPending} onSend={onSend} />
      ) : (
        <CollectStep
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
  invoice,
  isPending,
  onSend,
}: {
  invoice: InvoiceData;
  isPending: boolean;
  onSend: (reference: string | null) => void;
}) {
  const referenceFieldId = useId();
  const [reference, setReference] = useState("");
  const needsReference = invoice.number === null;
  const trimmed = reference.trim();

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSend(needsReference ? trimmed : null);
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

      <Button
        type="submit"
        className="self-start"
        disabled={isPending || (needsReference && trimmed === "")}
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
  onPay: (paidOn: string) => void;
  onRemind: () => void;
}) {
  const paidOnFieldId = useId();
  const [paidOn, setPaidOn] = useState(accountToday);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onPay(paidOn);
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={paidOnFieldId}>{m.invoices_paid_on_label()}</Label>
        <Input
          id={paidOnFieldId}
          type="date"
          value={paidOn}
          min={invoice.issuedOn}
          max={accountToday}
          onChange={(event) => setPaidOn(event.target.value)}
        />
        <p className="text-muted-foreground-3 text-xs">
          {m.invoices_paid_on_hint()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending || paidOn === ""}>
          {isPending ? m.common_saving() : m.invoices_mark_paid()}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onRemind}
        >
          {m.invoices_note_reminder()}
        </Button>
      </div>
    </form>
  );
}
