import type { CreditNoteData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { Label } from "@opusline/ui/components/label";
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import { Download } from "lucide-react";
import { useId, useState } from "react";

import { DateField } from "@/components/date-field";
import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import {
  CREDIT_NOTE_SETTLEMENT_LABELS,
  CREDIT_NOTE_SETTLEMENT_TOKENS,
} from "../lib/credit-note-draft";

type CreditNotesPanelProps = {
  creditNotes: CreditNoteData[];
  accountToday: string;
  isPending: boolean;
  pdfHref: (creditNote: CreditNoteData) => string;
  /** Records the refund a credit note owes as made; absent where the page cannot. */
  onRefund?: (creditNote: number, refundedOn: string) => void;
};

/** The credit notes issued on an invoice, and the refunds they still owe. */
export function CreditNotesPanel({
  creditNotes,
  accountToday,
  isPending,
  pdfHref,
  onRefund,
}: CreditNotesPanelProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <Panel data-testid="document-credit-notes" padding="none">
      <PanelTitle className="px-4 pt-5">{m.credit_notes_title()}</PanelTitle>
      <ul className="divide-y px-4 pt-3 pb-4">
        {creditNotes.map((creditNote) => {
          const toRefund =
            creditNote.status === 0 && creditNote.settlement === 2;

          return (
            <li
              className="flex flex-col gap-2 py-3"
              data-credit-note={creditNote.id}
              data-settlement={
                CREDIT_NOTE_SETTLEMENT_TOKENS[creditNote.settlement]
              }
              data-status={creditNote.status === 0 ? "issued" : "settled"}
              data-testid="credit-note-row"
              key={creditNote.id}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="min-w-0 text-foreground-hi text-sm">
                  {creditNote.number}
                  <span className="ml-2 font-mono text-muted-foreground-3 text-xs tabular-nums">
                    {formatAmountWithCents(format, creditNote.amountTtc.amount)}
                  </span>
                </span>
                <a
                  aria-label={m.credit_notes_download({
                    number: creditNote.number,
                  })}
                  className="text-muted-foreground-3 hover:text-foreground-hi"
                  data-testid="credit-note-download"
                  download
                  href={pdfHref(creditNote)}
                >
                  <Download aria-hidden className="size-4" />
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground-3 text-xs">
                <span>
                  {m.credit_notes_issued_on({
                    date: calendarDateNumericLabel(
                      dateFormat,
                      creditNote.issuedOn,
                    ),
                  })}
                </span>
                <Badge variant={toRefund ? "attention" : "neutral"}>
                  {toRefund
                    ? m.credit_notes_to_refund()
                    : CREDIT_NOTE_SETTLEMENT_LABELS[creditNote.settlement]()}
                </Badge>
              </div>
              {toRefund && onRefund !== undefined ? (
                <RefundForm
                  accountToday={accountToday}
                  creditNote={creditNote}
                  isPending={isPending}
                  onRefund={onRefund}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function RefundForm({
  creditNote,
  accountToday,
  isPending,
  onRefund,
}: {
  creditNote: CreditNoteData;
  accountToday: string;
  isPending: boolean;
  onRefund: (creditNote: number, refundedOn: string) => void;
}) {
  const id = useId();
  const [refundedOn, setRefundedOn] = useState(accountToday);

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        onRefund(creditNote.id, refundedOn);
      }}
    >
      <Label htmlFor={id}>{m.credit_notes_refunded_on()}</Label>
      <DateField
        id={id}
        max={accountToday}
        min={creditNote.issuedOn}
        onChange={setRefundedOn}
        value={refundedOn}
      />
      <Button
        className="self-start"
        data-testid="credit-note-mark-refunded"
        disabled={isPending || refundedOn === ""}
        size="lg"
        type="submit"
      >
        {m.credit_notes_mark_refunded()}
      </Button>
    </form>
  );
}
