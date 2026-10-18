import type {
  DocumentLanguage,
  InvoiceDetailData,
  InvoicePaperData,
  ReminderDefaultsData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button, buttonVariants } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronLeft,
  CircleAlert,
  Download,
  Send,
} from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents } from "@/lib/billing";
import { calendarDateNumericLabel, calendarRangeLabel } from "@/lib/dates";
import { invoicePdfHref } from "@/lib/documents";
import { invoiceStatusBadge, invoiceStatusToken } from "@/lib/invoice-status";
import { m } from "@/paraglide/messages.js";

import { CreditNotesPanel } from "./credit-notes-panel";
import { DocumentLanguageToggle } from "./document-language-toggle";
import { InvoiceHistory } from "./invoice-history";
import { InvoiceLifecycleActions } from "./invoice-lifecycle-actions";
import { InvoicePaper } from "./invoice-paper";
import { InvoicePaymentsPanel } from "./invoice-payments-panel";
import { InvoiceRemindersPanel } from "./invoice-reminders-panel";

type InvoiceDocumentPageProps = {
  detail: InvoiceDetailData;
  /** The sheet in `language`; null while it loads or after it failed. */
  paper: InvoicePaperData | null;
  /** Set once the sheet failed to load: the page then offers to try again instead of waiting. */
  onRetryPaper?: () => void;
  language: DocumentLanguage;
  onLanguageChange: (language: DocumentLanguage) => void;
  logoSrc?: string;
  accountToday: string;
  isPending: boolean;
  error: string | null;
  onPay: (paidOn: string, amountCents: number | null) => void;
  onRemind: () => void;
  onDelete: () => void;
  /** Takes a payment back off the invoice; absent where the page cannot. */
  onRemovePayment?: (payment: number) => void;
  /** Records the refund a credit note owes as made; absent where the page cannot. */
  onRefund?: (creditNote: number, refundedOn: string) => void;
  /** The automatic reminders of an unpaid invoice; absent where the page has nothing to wire them to. */
  onRemindersChange?: (reminders: ReminderDefaultsData) => void;
  onRemindNow?: () => void;
};

/**
 * An invoice written in Opusline, as the document it is. One recorded from
 * another tool has no sheet to show and keeps the drawer.
 */
export function InvoiceDocumentPage({
  detail,
  paper,
  onRetryPaper,
  language,
  onLanguageChange,
  logoSrc,
  accountToday,
  isPending,
  error,
  onPay,
  onRemind,
  onDelete,
  onRemovePayment,
  onRefund,
  onRemindersChange,
  onRemindNow,
}: InvoiceDocumentPageProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const { invoice, client, history } = detail;
  const isDraft = invoice.status === 0;
  const badge = invoiceStatusBadge(invoice);
  const period = calendarRangeLabel(
    dateFormat,
    invoice.periodStart,
    invoice.periodEnd,
  );
  const ht = formatAmountWithCents(format, invoice.amountHt.amount);

  return (
    <div className="pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          aria-label={m.document_back()}
          className={buttonVariants({ size: "icon-lg", variant: "ghost" })}
          to="/invoicing/invoices"
        >
          <ChevronLeft />
        </Link>
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1">
          <Link
            className="text-muted-foreground-3 text-sm hover:text-foreground-hi"
            to="/invoicing/invoices"
          >
            {m.nav_invoices()}
          </Link>
          <span aria-hidden className="text-muted-foreground-4 text-sm">
            /
          </span>
          <h1
            className="font-heading font-semibold text-foreground-hi text-xl"
            data-reference={invoice.number ?? ""}
            data-testid="page-heading"
          >
            {invoice.number === null
              ? m.document_draft_heading()
              : m.document_heading({ number: invoice.number })}
          </h1>
          <span className="text-muted-foreground-3 text-sm">
            {period === null ? client.name : `${client.name} · ${period}`}
          </span>
        </div>
        <Link
          className={buttonVariants({ size: "xl", variant: "ghost" })}
          data-testid="document-duplicate"
          search={{ duplicate: invoice.id }}
          to="/invoicing/invoices/new"
        >
          {m.document_duplicate()}
        </Link>
        {invoice.status === 1 || invoice.status === 2 ? (
          <CreditNoteActions invoice={invoice} />
        ) : null}
        {invoice.number !== null && invoice.status === 1 ? (
          <Link
            className={buttonVariants({ size: "xl", variant: "outline" })}
            data-testid="document-send"
            params={{ invoiceId: String(invoice.id) }}
            to="/invoicing/invoices/$invoiceId/send"
          >
            <Send data-icon="inline-start" />
            {m.document_send()}
          </Link>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                data-testid="document-download"
                size="xl"
                variant="outline"
              >
                <Download data-icon="inline-start" />
                {m.document_download()}
                <ChevronDown data-icon="inline-end" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={6}>
            <DropdownMenuItem
              data-language="fr"
              data-testid="document-download-item"
              render={<a download href={invoicePdfHref(invoice.id, 0)} />}
            >
              {m.document_download_fr()}
            </DropdownMenuItem>
            <DropdownMenuItem
              data-language="en"
              data-testid="document-download-item"
              render={<a download href={invoicePdfHref(invoice.id, 1)} />}
            >
              {m.document_download_en()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className="font-mono font-semibold text-2xl text-foreground-hi tabular-nums"
              data-amount-cents={invoice.amountTtc.amount}
              data-testid="document-amount"
            >
              {formatAmountWithCents(format, invoice.amountTtc.amount)}
            </span>
            <Badge
              data-status={invoiceStatusToken(invoice)}
              data-testid="document-status"
              variant={badge.variant}
            >
              {badge.label}
            </Badge>
            <span className="text-muted-foreground-3 text-sm">
              {isDraft
                ? m.document_amount_note({ ht })
                : m.document_amount_note_due({
                    ht,
                    due: calendarDateNumericLabel(dateFormat, invoice.dueOn),
                  })}
            </span>
          </div>

          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-muted-foreground-3 text-xs">
              {m.document_preview()}
            </span>
            <DocumentLanguageToggle
              onChange={onLanguageChange}
              value={language}
            />
          </div>
          {paper === null && onRetryPaper !== undefined ? (
            <Alert data-testid="document-paper-failed" variant="warn">
              <CircleAlert />
              <AlertDescription>
                {m.document_paper_load_failed()}
              </AlertDescription>
              <Button
                data-testid="document-paper-retry"
                onClick={onRetryPaper}
                size="sm"
                variant="outline"
              >
                {m.error_retry()}
              </Button>
            </Alert>
          ) : paper === null ? (
            <Skeleton className="h-200 w-full" />
          ) : (
            <InvoicePaper logoSrc={logoSrc} paper={paper} />
          )}
        </div>

        <aside className="flex flex-col gap-4">
          {isDraft ? (
            <Panel
              className="px-5 py-5"
              data-testid="document-draft"
              padding="none"
            >
              <PanelTitle className="mb-2">
                {m.document_draft_title()}
              </PanelTitle>
              <p className="mb-4 text-muted-foreground-3 text-sm">
                {m.document_draft_text()}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  className={buttonVariants({ size: "xl" })}
                  data-testid="document-resume-draft"
                  params={{ invoiceId: String(invoice.id) }}
                  to="/invoicing/invoices/$invoiceId/edit"
                >
                  {m.document_draft_resume()}
                </Link>
                <Button
                  data-testid="invoice-delete-draft"
                  disabled={isPending}
                  onClick={onDelete}
                  size="xl"
                  variant="ghost"
                >
                  {m.invoices_delete_draft()}
                </Button>
              </div>
              {error === null ? null : (
                <p className="mt-3 text-destructive text-sm" role="alert">
                  {error}
                </p>
              )}
            </Panel>
          ) : invoice.status === 1 ? (
            <Panel data-testid="document-collect" padding="none">
              <PanelTitle className="px-4 pt-5">
                {m.document_collect_title()}
              </PanelTitle>
              <InvoiceLifecycleActions
                accountToday={accountToday}
                error={error}
                invoice={invoice}
                isPending={isPending}
                onDelete={onDelete}
                onPay={onPay}
                onRemind={onRemind}
                onSend={() => {}}
              />
            </Panel>
          ) : null}

          {detail.creditNotes.length > 0 ? (
            <CreditNotesPanel
              accountToday={accountToday}
              creditNotes={detail.creditNotes}
              isPending={isPending}
              onRefund={onRefund}
            />
          ) : null}

          {detail.payments.length > 0 ? (
            <InvoicePaymentsPanel
              isPending={isPending}
              onRemove={onRemovePayment}
              payments={detail.payments}
            />
          ) : null}

          {invoice.status === 1 &&
          onRemindersChange !== undefined &&
          onRemindNow !== undefined ? (
            <InvoiceRemindersPanel
              detail={detail}
              isPending={isPending}
              onChange={onRemindersChange}
              onRemindNow={onRemindNow}
            />
          ) : null}

          {detail.quote === null ? null : (
            <Link
              className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm transition-colors hover:bg-accent"
              data-quote={detail.quote.quoteId}
              data-testid="document-from-quote"
              params={{ quoteId: String(detail.quote.quoteId) }}
              to="/invoicing/quotes/$quoteId"
            >
              <span className="text-muted-foreground">
                {m.document_from_quote()}
              </span>
              <span className="font-mono text-primary-text">
                {detail.quote.number ?? "—"}
              </span>
            </Link>
          )}

          {history.length === 0 ? null : (
            <Panel padding="default">
              <PanelTitle className="mb-3.5">
                {m.invoices_history_title()}
              </PanelTitle>
              <InvoiceHistory history={history} />
            </Panel>
          )}
        </aside>
      </div>
    </div>
  );
}

/** « Corriger la facture », « Avoir partiel », « Annuler par un avoir »: an issued invoice is only ever corrected this way. */
function CreditNoteActions({
  invoice,
}: {
  invoice: InvoiceDetailData["invoice"];
}) {
  const items = [
    {
      kind: 0 as const,
      reissue: true,
      label: m.document_correct(),
      testKind: "correct",
    },
    {
      kind: 1 as const,
      reissue: false,
      label: m.document_partial_credit_note(),
      testKind: "partial",
    },
    ...(invoice.amountCredited.amount === 0
      ? [
          {
            kind: 0 as const,
            reissue: false,
            label: m.document_cancel_by_credit_note(),
            testKind: "cancel",
          },
        ]
      : []),
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            data-testid="document-credit-note"
            size="xl"
            variant="outline"
          >
            {m.document_credit_note()}
            <ChevronDown data-icon="inline-end" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" sideOffset={6}>
        {items.map((item) => (
          <DropdownMenuItem
            data-action={item.testKind}
            data-testid="document-credit-note-item"
            key={item.testKind}
            render={
              <Link
                params={{ invoiceId: String(invoice.id) }}
                search={{
                  kind: item.kind,
                  ...(item.reissue ? { reissue: true } : {}),
                }}
                to="/invoicing/invoices/$invoiceId/credit-note"
              />
            }
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
