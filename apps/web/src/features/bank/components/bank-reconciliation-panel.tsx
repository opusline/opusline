import type { BankAccountData, BankMatchData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import { cn } from "@opusline/ui/lib/utils";
import { ArrowRightIcon } from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import {
  bankMatchReasonLabel,
  hasUnlinkedCredits,
  reconciliationNote,
  signedAmountLabel,
} from "../lib/labels";

type BankReconciliationPanelProps = {
  data: BankAccountData;
  /** The suggestion a validate/dismiss request is in flight for. */
  pendingMatchId: number | null;
  onValidate: (matchId: number) => void;
  onDismiss: (matchId: number) => void;
  onOpenInvoice: (invoiceId: number) => void;
  onImport: () => void;
};

export function BankReconciliationPanel({
  data,
  pendingMatchId,
  onValidate,
  onDismiss,
  onOpenInvoice,
  onImport,
}: BankReconciliationPanelProps) {
  const dateFormat = useDateFormat();
  const matches = data.pendingMatches;
  const hasStatement = data.statements.length > 0;
  // "Tout est rapproché" is a factual claim — it only holds when no credit is
  // left without a linked invoice, not merely when no suggestion is pending.
  const fullyLinked = hasStatement && !hasUnlinkedCredits(data);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-md border bg-card",
        matches.length > 0 && "border-primary/35",
      )}
    >
      <div className="flex flex-wrap items-center gap-2.5 border-b px-5 py-3.5">
        <h2 className="font-heading font-semibold text-base text-foreground-hi">
          {m.bank_reconciliation_title()}
        </h2>
        {hasStatement ? (
          matches.length > 0 ? (
            <Badge variant="brand">
              {m.bank_badge_to_validate({ count: matches.length })}
            </Badge>
          ) : (
            <Badge variant="success">{m.bank_badge_up_to_date()}</Badge>
          )
        ) : (
          <Badge variant="neutral">{m.bank_badge_no_statement()}</Badge>
        )}
        <span className="ml-auto text-muted-foreground-3 text-xs">
          {reconciliationNote(dateFormat, data)}
        </span>
      </div>

      {matches.map((match) => (
        <SuggestionRow
          isActing={pendingMatchId !== null}
          key={match.id}
          match={match}
          onDismiss={onDismiss}
          onOpenInvoice={onOpenInvoice}
          onValidate={onValidate}
        />
      ))}

      {matches.length === 0 && (
        <Empty className="px-6 py-9">
          <EmptyHeader className="gap-2">
            <EmptyTitle variant="strong">
              {hasStatement
                ? fullyLinked
                  ? m.bank_reconciled_title()
                  : m.bank_reconciled_unlinked_title()
                : m.bank_no_statement_title()}
            </EmptyTitle>
            <EmptyDescription className="max-w-[52ch] text-pretty text-muted-foreground-3 text-sm">
              {hasStatement
                ? fullyLinked
                  ? m.bank_reconciled_body()
                  : m.bank_reconciled_unlinked_body()
                : m.bank_no_statement_body()}
            </EmptyDescription>
          </EmptyHeader>
          {!hasStatement && (
            <EmptyContent>
              <Button onClick={onImport} size="xl" variant="outline">
                {m.bank_import_button()}
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}
    </section>
  );
}

type SuggestionRowProps = {
  match: BankMatchData;
  isActing: boolean;
  onValidate: (matchId: number) => void;
  onDismiss: (matchId: number) => void;
  onOpenInvoice: (invoiceId: number) => void;
};

function SuggestionRow({
  match,
  isActing,
  onValidate,
  onDismiss,
  onOpenInvoice,
}: SuggestionRowProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <div className="flex flex-wrap items-center gap-4 border-accent border-b px-5 py-3.5 last:border-b-0">
      <div className="min-w-0 flex-1 basis-64">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <span className="shrink-0 font-mono text-muted-foreground-3 text-sm tabular-nums">
            {calendarDateNumericLabel(dateFormat, match.bookedOn)}
          </span>
          <span className="truncate text-foreground-2 text-sm">
            {match.label}
          </span>
        </div>
        <div className="mt-0.5 text-muted-foreground-3 text-xs">
          {bankMatchReasonLabel(match.reason)}
        </div>
      </div>
      <span className="shrink-0 font-mono text-sm text-success tabular-nums">
        {signedAmountLabel(format, match.amount.amount)}
      </span>
      <ArrowRightIcon
        aria-hidden
        className="size-4 shrink-0 text-muted-foreground-4"
      />
      <button
        aria-label={m.bank_match_invoice_aria({
          number: match.invoice.number ?? String(match.invoice.id),
        })}
        className="min-w-25 shrink-0 text-left font-mono text-foreground-2 text-sm transition-colors hover:text-primary-text"
        onClick={() => onOpenInvoice(match.invoice.id)}
        type="button"
      >
        {match.invoice.number ?? "—"}
      </button>
      <div className="flex shrink-0 gap-1.5">
        <Button
          disabled={isActing}
          onClick={() => onValidate(match.id)}
          size="lg"
        >
          {m.bank_match_validate()}
        </Button>
        <Button
          disabled={isActing}
          onClick={() => onDismiss(match.id)}
          size="lg"
          variant="outline"
        >
          {m.bank_match_ignore()}
        </Button>
      </div>
    </div>
  );
}
