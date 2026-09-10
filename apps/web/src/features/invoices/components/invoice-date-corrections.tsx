import type { InvoiceData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { Label } from "@opusline/ui/components/label";
import { useId, useState } from "react";

import { DateField } from "@/components/date-field";
import { m } from "@/paraglide/messages.js";

export type InvoiceDateCorrection = {
  sentOn: string;
  /** Null on an invoice that has not been collected — there is no date to move. */
  paidOn: string | null;
};

type InvoiceDateCorrectionsProps = {
  invoice: InvoiceData;
  /** The day the invoice went out, as its history records it. */
  sentOn: string;
  /** Today in the account's timezone — the latest date the API's fiscal rules accept. */
  accountToday: string;
  isPending: boolean;
  error: string | null;
  onSubmit: (correction: InvoiceDateCorrection) => void;
};

/**
 * Putting the record straight after the fact.
 *
 * The lifecycle buttons only ever move an invoice forward, which leaves no way to
 * fix a send date typed a week late or a payment noticed on the bank statement
 * days after it landed — and the second of those decides which declaration period
 * the revenue falls in, so it cannot be a write-once field.
 */
export function InvoiceDateCorrections({
  invoice,
  sentOn,
  accountToday,
  isPending,
  error,
  onSubmit,
}: InvoiceDateCorrectionsProps) {
  const sentOnFieldId = useId();
  const paidOnFieldId = useId();
  const [sentOnDraft, setSentOnDraft] = useState(sentOn);
  const [paidOnDraft, setPaidOnDraft] = useState(invoice.paidOn ?? "");

  if (invoice.status === 0) {
    return null;
  }

  const isPaid = invoice.status === 2;
  const isComplete = sentOnDraft !== "" && (!isPaid || paidOnDraft !== "");
  const hasChanges =
    sentOnDraft !== sentOn || (isPaid && paidOnDraft !== invoice.paidOn);

  return (
    <section className="border-t px-4 py-5">
      <h3 className={eyebrowVariants()}>{m.invoices_correct_dates_title()}</h3>

      <form
        className="mt-3.5 flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({
            sentOn: sentOnDraft,
            paidOn: isPaid ? paidOnDraft : null,
          });
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={sentOnFieldId}>{m.invoices_sent_on_label()}</Label>
          <DateField
            id={sentOnFieldId}
            max={accountToday}
            min={invoice.issuedOn}
            onChange={setSentOnDraft}
            value={sentOnDraft}
          />
        </div>

        {isPaid && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={paidOnFieldId}>{m.invoices_paid_on_label()}</Label>
            <DateField
              id={paidOnFieldId}
              max={accountToday}
              min={sentOnDraft === "" ? invoice.issuedOn : sentOnDraft}
              onChange={setPaidOnDraft}
              value={paidOnDraft}
            />
            <p className="text-muted-foreground-3 text-xs">
              {m.invoices_correct_dates_hint()}
            </p>
          </div>
        )}

        <Button
          className="self-start"
          disabled={isPending || !isComplete || !hasChanges}
          type="submit"
          variant="outline"
        >
          {isPending ? m.common_saving() : m.invoices_correct_dates_save()}
        </Button>

        {error !== null && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
