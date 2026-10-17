import type {
  DocumentLanguage,
  InvoicePaperData,
  QuoteBilling,
  QuoteDetailData,
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
import { Meter } from "@opusline/ui/components/meter";
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
import { useId } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import {
  centsShare,
  formatAmountWithCents,
  formatPercentFromBp,
} from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { quotePdfHref } from "@/lib/documents";
import { invoiceStatusBadge, invoiceStatusToken } from "@/lib/invoice-status";
import { m } from "@/paraglide/messages.js";
import { quoteStatusBadge, quoteStatusToken } from "../lib/quote-status";
import { FiledDocumentPanel } from "./filed-document-panel";
import { InvoicePaper } from "./invoice-paper";

/** Filing the PDF of a quote recorded from another tool: Opusline has no sheet of it. */
export type QuoteDocumentFiling = {
  isPending: boolean;
  isUploading: boolean;
  uploadPercent: number | null;
  error: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
};

type QuoteDocumentPageProps = {
  detail: QuoteDetailData;
  /** The sheet in `language`; null while it loads or after it failed. */
  paper: InvoicePaperData | null;
  onRetryPaper?: () => void;
  language: DocumentLanguage;
  onLanguageChange: (language: DocumentLanguage) => void;
  logoSrc?: string;
  isPending: boolean;
  error: string | null;
  onAccept: () => void;
  onRefuse: () => void;
  onReopen: () => void;
  onDelete: () => void;
  /** Builds the deposit, balance or whole invoice as a draft, then opens it. */
  onInvoice: (billing: QuoteBilling) => void;
  onOpenInvoice: (invoiceId: number) => void;
  /** Only a quote issued elsewhere takes a document; one written here filed its own. */
  filing?: QuoteDocumentFiling;
};

/** A quote as the document it is, with « Suivi du devis » beside it. */
export function QuoteDocumentPage({
  detail,
  paper,
  onRetryPaper,
  language,
  onLanguageChange,
  logoSrc,
  isPending,
  error,
  onAccept,
  onRefuse,
  onReopen,
  onDelete,
  onInvoice,
  onOpenInvoice,
  filing,
}: QuoteDocumentPageProps) {
  const format = useMoneyFormat();
  const { quote, client } = detail;
  const isDraft = quote.status === 0;
  const isExternal = quote.source === 0;
  const badge = quoteStatusBadge(quote);
  const ht = formatAmountWithCents(format, quote.amountHt.amount);

  return (
    <div className="pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          aria-label={m.quote_document_back()}
          className={buttonVariants({ size: "icon-lg", variant: "ghost" })}
          to="/invoicing/quotes"
        >
          <ChevronLeft />
        </Link>
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1">
          <Link
            className="text-muted-foreground-3 text-sm hover:text-foreground-hi"
            to="/invoicing/quotes"
          >
            {m.invoicing_nav_quotes()}
          </Link>
          <span aria-hidden className="text-muted-foreground-4 text-sm">
            /
          </span>
          <h1
            className="font-heading font-semibold text-foreground-hi text-xl"
            data-reference={quote.number ?? ""}
            data-testid="page-heading"
          >
            {quote.number === null
              ? m.quote_document_draft_heading()
              : m.quote_document_heading({ number: quote.number })}
          </h1>
          <span className="text-muted-foreground-3 text-sm">
            {quote.title === null
              ? client.name
              : `${client.name} · ${quote.title}`}
          </span>
        </div>
        {quote.number !== null && quote.status === 1 ? (
          <Link
            className={buttonVariants({ size: "xl", variant: "outline" })}
            data-testid="document-send"
            params={{ quoteId: String(quote.id) }}
            to="/invoicing/quotes/$quoteId/send"
          >
            <Send data-icon="inline-start" />
            {m.document_send()}
          </Link>
        ) : null}
        {isExternal ? null : (
          <Link
            className={buttonVariants({ size: "xl", variant: "ghost" })}
            data-testid="document-duplicate"
            search={{ duplicate: quote.id }}
            to="/invoicing/quotes/new"
          >
            {m.document_duplicate()}
          </Link>
        )}
        {isExternal ? (
          detail.document === null ? null : (
            <a
              className={buttonVariants({ size: "xl", variant: "outline" })}
              data-testid="quote-document-download"
              download
              href={quotePdfHref(quote.id, language)}
            >
              <Download data-icon="inline-start" />
              {m.document_download()}
            </a>
          )
        ) : (
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
                render={<a download href={quotePdfHref(quote.id, 0)} />}
              >
                {m.document_download_fr()}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-language="en"
                data-testid="document-download-item"
                render={<a download href={quotePdfHref(quote.id, 1)} />}
              >
                {m.document_download_en()}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span
              className="font-mono font-semibold text-2xl text-foreground-hi tabular-nums"
              data-amount-cents={quote.amountTtc.amount}
              data-testid="document-amount"
            >
              {formatAmountWithCents(format, quote.amountTtc.amount)}
            </span>
            <Badge
              data-status={quoteStatusToken(quote)}
              data-testid="document-status"
              variant={badge.variant}
            >
              {badge.label}
            </Badge>
            {isExternal ? (
              <Badge data-testid="document-source" variant="quiet">
                {m.quote_source_external()}
              </Badge>
            ) : null}
            <span className="text-muted-foreground-3 text-sm">
              {m.quote_document_amount_note({ ht })}
            </span>
          </div>

          {isExternal ? (
            filing === undefined ? null : (
              <Panel data-testid="quote-document" padding="none">
                <FiledDocumentPanel
                  document={detail.document}
                  downloadHref={quotePdfHref(quote.id, language)}
                  error={filing.error}
                  isPending={filing.isPending}
                  isUploading={filing.isUploading}
                  onRemove={filing.onRemove}
                  onUpload={filing.onUpload}
                  subject="quote"
                  uploadPercent={filing.uploadPercent}
                />
              </Panel>
            )
          ) : (
            <>
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
                <div className="overflow-x-auto">
                  <div className="min-w-150">
                    <InvoicePaper logoSrc={logoSrc} paper={paper} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          {isDraft ? (
            <Panel
              className="px-5 py-5"
              data-testid="document-draft"
              padding="none"
            >
              <PanelTitle className="mb-2">{m.quote_draft_title()}</PanelTitle>
              <p className="mb-4 text-muted-foreground-3 text-sm">
                {m.quote_draft_text()}
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  className={buttonVariants({ size: "xl" })}
                  data-testid="document-resume-draft"
                  params={{ quoteId: String(quote.id) }}
                  to="/invoicing/quotes/$quoteId/edit"
                >
                  {m.document_draft_resume()}
                </Link>
                <Button
                  data-testid="quote-delete-draft"
                  disabled={isPending}
                  onClick={onDelete}
                  size="xl"
                  variant="ghost"
                >
                  {m.quote_delete_draft()}
                </Button>
              </div>
              <ActionError error={error} />
            </Panel>
          ) : (
            <Panel
              className="px-5 py-5"
              data-testid="quote-tracking"
              padding="none"
            >
              <PanelTitle className="mb-3.5">
                {m.quote_tracking_title()}
              </PanelTitle>
              <QuoteTracking detail={detail} />
              <div className="mt-4 flex flex-col gap-2">
                {quote.status === 1 && !quote.isExpired ? (
                  <>
                    <Button
                      data-testid="quote-accept"
                      disabled={isPending}
                      onClick={onAccept}
                      size="xl"
                    >
                      {m.quote_accept()}
                    </Button>
                    <Button
                      data-testid="quote-refuse"
                      disabled={isPending}
                      onClick={onRefuse}
                      size="xl"
                      variant="outline"
                    >
                      {m.quote_refuse()}
                    </Button>
                  </>
                ) : null}
                {quote.status === 3 || quote.isExpired ? (
                  <Button
                    data-testid="quote-reopen"
                    disabled={isPending}
                    onClick={onReopen}
                    size="xl"
                    variant="outline"
                  >
                    {m.quote_reopen()}
                  </Button>
                ) : null}
              </div>
              <ActionError error={error} />
            </Panel>
          )}

          {quote.status === 2 || detail.billing.invoices.length > 0 ? (
            <Panel
              className="px-5 py-5"
              data-invoiced-cents={detail.billing.invoicedTtc.amount}
              data-testid="quote-billing"
              padding="none"
            >
              <PanelTitle className="mb-3.5">
                {m.quote_billing_title()}
              </PanelTitle>
              <QuoteBillingPanel
                detail={detail}
                isPending={isPending}
                onInvoice={onInvoice}
                onOpenInvoice={onOpenInvoice}
              />
            </Panel>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function ActionError({ error }: { error: string | null }) {
  return error === null ? null : (
    <p className="mt-3 text-destructive text-sm" role="alert">
      {error}
    </p>
  );
}

/** The dates that tell where the quote stands, as the design's « Suivi du devis » rows. */
function QuoteTracking({ detail }: { detail: QuoteDetailData }) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const { quote } = detail;
  const rows: Array<[string, string]> = [
    [
      m.quote_tracking_sent_on(),
      calendarDateNumericLabel(dateFormat, quote.issuedOn),
    ],
    [
      m.quote_tracking_valid_until(),
      calendarDateNumericLabel(dateFormat, quote.validUntil),
    ],
  ];

  if (quote.depositAmount !== null && quote.depositRateBp !== null) {
    rows.push([
      m.quote_tracking_deposit(),
      m.quote_tracking_deposit_value({
        amount: formatAmountWithCents(format, quote.depositAmount.amount),
        rate: formatPercentFromBp(format.locale, quote.depositRateBp),
      }),
    ]);
  }

  if (quote.acceptedOn !== null) {
    rows.push([
      m.quote_tracking_accepted_on(),
      calendarDateNumericLabel(dateFormat, quote.acceptedOn),
    ]);
  }

  if (quote.refusedOn !== null) {
    rows.push([
      m.quote_tracking_refused_on(),
      calendarDateNumericLabel(dateFormat, quote.refusedOn),
    ]);
  }

  return (
    <div className="flex flex-col gap-3">
      <dl className="flex flex-col gap-2.5">
        {rows.map(([label, value]) => (
          <div className="flex justify-between gap-3 text-sm" key={label}>
            <dt className="text-muted-foreground-3">{label}</dt>
            <dd className="text-right text-foreground-2">{value}</dd>
          </div>
        ))}
      </dl>
      {quote.isExpired ? (
        <p
          className="text-primary-note text-xs leading-relaxed"
          data-testid="quote-tracking-note"
        >
          {m.quote_tracking_expired()}
        </p>
      ) : quote.status === 2 ? (
        <p
          className="text-primary-note text-xs leading-relaxed"
          data-testid="quote-tracking-note"
        >
          {m.quote_tracking_accepted()}
        </p>
      ) : null}
    </div>
  );
}

const BILLING_KIND_MESSAGES: Record<QuoteBilling, () => string> = {
  0: m.quote_billing_kind_deposit,
  1: m.quote_billing_kind_balance,
  2: m.quote_billing_kind_full,
};

/** What the quote has billed, and what it can bill next, as the design's « Factures liées ». */
function QuoteBillingPanel({
  detail,
  isPending,
  onInvoice,
  onOpenInvoice,
}: {
  detail: QuoteDetailData;
  isPending: boolean;
  onInvoice: (billing: QuoteBilling) => void;
  onOpenInvoice: (invoiceId: number) => void;
}) {
  const format = useMoneyFormat();
  const billedId = useId();
  const { quote, billing } = detail;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-foreground-2 text-sm" id={billedId}>
          {billing.invoicedTtc.amount === 0
            ? m.quote_billing_none()
            : m.quote_billing_invoiced({
                invoiced: formatAmountWithCents(
                  format,
                  billing.invoicedTtc.amount,
                ),
                total: formatAmountWithCents(format, quote.amountTtc.amount),
              })}
        </p>
        <Meter
          aria-labelledby={billedId}
          className="mt-2"
          data-testid="quote-billing-bar"
          tone="brand"
          value={centsShare(billing.invoicedTtc.amount, quote.amountTtc.amount)}
        />
      </div>

      {billing.invoices.length === 0 ? null : (
        <ul className="flex flex-col gap-2">
          {billing.invoices.map((link) => {
            const badge = invoiceStatusBadge(link);

            return (
              <li key={link.id}>
                <button
                  className="flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition-colors hover:bg-accent"
                  data-billing={link.billing}
                  data-status={invoiceStatusToken(link)}
                  data-testid="quote-linked-invoice"
                  onClick={() => onOpenInvoice(link.id)}
                  type="button"
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-foreground-2 text-sm">
                      {link.number ?? "—"}
                    </span>
                    <span className="block text-muted-foreground-3 text-xs">
                      {BILLING_KIND_MESSAGES[link.billing]()} ·{" "}
                      {formatAmountWithCents(format, link.amountTtc.amount)}
                    </span>
                  </span>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {billing.canInvoiceDeposit ||
      billing.canInvoiceBalance ||
      billing.canInvoiceFull ? (
        <div className="flex flex-col gap-2">
          {billing.canInvoiceDeposit && quote.depositRateBp !== null ? (
            <Button
              data-testid="quote-invoice-deposit"
              disabled={isPending}
              onClick={() => onInvoice(0)}
              size="xl"
            >
              {m.quote_invoice_deposit({
                rate: formatPercentFromBp(format.locale, quote.depositRateBp),
              })}
            </Button>
          ) : null}
          {billing.canInvoiceBalance ? (
            <Button
              data-testid="quote-invoice-balance"
              disabled={isPending}
              onClick={() => onInvoice(1)}
              size="xl"
            >
              {m.quote_invoice_balance()}
            </Button>
          ) : null}
          {billing.canInvoiceFull ? (
            <Button
              data-testid="quote-invoice-full"
              disabled={isPending}
              onClick={() => onInvoice(2)}
              size="xl"
              variant={billing.canInvoiceDeposit ? "outline" : "default"}
            >
              {m.quote_invoice_full()}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
