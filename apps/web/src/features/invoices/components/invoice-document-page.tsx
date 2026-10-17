import type {
  DocumentLanguage,
  InvoiceDetailData,
  InvoicePaperData,
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
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
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
import {
  INVOICE_STATUS_TOKENS,
  invoiceStatusBadge,
} from "@/lib/invoice-status";
import { m } from "@/paraglide/messages.js";

import { InvoiceHistory } from "./invoice-history";
import { InvoiceLifecycleActions } from "./invoice-lifecycle-actions";
import { InvoicePaper } from "./invoice-paper";

type InvoiceDocumentPageProps = {
  detail: InvoiceDetailData;
  /** The sheet in `language`; null while it loads or after it failed. */
  paper: InvoicePaperData | null;
  /** Set once the sheet failed to load: the page then offers to try again instead of waiting. */
  onRetryPaper?: () => void;
  language: DocumentLanguage;
  onLanguageChange: (language: DocumentLanguage) => void;
  pdfHref: (language: DocumentLanguage) => string;
  logoSrc?: string;
  accountToday: string;
  isPending: boolean;
  error: string | null;
  onPay: (paidOn: string) => void;
  onRemind: () => void;
  onDelete: () => void;
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
  pdfHref,
  logoSrc,
  accountToday,
  isPending,
  error,
  onPay,
  onRemind,
  onDelete,
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
        {invoice.number !== null && invoice.status !== 2 ? (
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
              render={<a download href={pdfHref(0)} />}
            >
              {m.document_download_fr()}
            </DropdownMenuItem>
            <DropdownMenuItem
              data-language="en"
              data-testid="document-download-item"
              render={<a download href={pdfHref(1)} />}
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
              data-status={INVOICE_STATUS_TOKENS[invoice.status]}
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
            <SegmentedControl
              aria-label={m.invoicing_document_language()}
              onValueChange={(value) => {
                const next = value[0];

                if (next === "0" || next === "1") {
                  onLanguageChange(Number(next) as DocumentLanguage);
                }
              }}
              size="sm"
              value={[String(language)]}
            >
              <SegmentedControlItem
                data-testid="document-language-fr"
                value="0"
              >
                {m.invoicing_language_french()}
              </SegmentedControlItem>
              <SegmentedControlItem
                data-testid="document-language-en"
                value="1"
              >
                {m.invoicing_language_english()}
              </SegmentedControlItem>
            </SegmentedControl>
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
            // The sheet keeps its print proportions: a phone scrolls across it.
            <div className="overflow-x-auto">
              <div className="min-w-150">
                <InvoicePaper logoSrc={logoSrc} paper={paper} />
              </div>
            </div>
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
            <Panel className="px-5 py-5" padding="none">
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
