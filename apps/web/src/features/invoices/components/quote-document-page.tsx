import type {
  DocumentLanguage,
  InvoicePaperData,
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
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, CircleAlert, Download } from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatAmountWithCents, formatPercentFromBp } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";
import { quoteStatusBadge, quoteStatusToken } from "../lib/quote-status";
import { InvoicePaper } from "./invoice-paper";

type QuoteDocumentPageProps = {
  detail: QuoteDetailData;
  /** The sheet in `language`; null while it loads or after it failed. */
  paper: InvoicePaperData | null;
  onRetryPaper?: () => void;
  language: DocumentLanguage;
  onLanguageChange: (language: DocumentLanguage) => void;
  pdfHref: (language: DocumentLanguage) => string;
  logoSrc?: string;
  isPending: boolean;
  error: string | null;
  onAccept: () => void;
  onRefuse: () => void;
  onReopen: () => void;
  onDelete: () => void;
};

/** A quote as the document it is, with « Suivi du devis » beside it. */
export function QuoteDocumentPage({
  detail,
  paper,
  onRetryPaper,
  language,
  onLanguageChange,
  pdfHref,
  logoSrc,
  isPending,
  error,
  onAccept,
  onRefuse,
  onReopen,
  onDelete,
}: QuoteDocumentPageProps) {
  const format = useMoneyFormat();
  const { quote, client } = detail;
  const isDraft = quote.status === 0;
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
        <Link
          className={buttonVariants({ size: "xl", variant: "ghost" })}
          data-testid="document-duplicate"
          search={{ duplicate: quote.id }}
          to="/invoicing/quotes/new"
        >
          {m.document_duplicate()}
        </Link>
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
            <span className="text-muted-foreground-3 text-sm">
              {m.quote_document_amount_note({ ht })}
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
