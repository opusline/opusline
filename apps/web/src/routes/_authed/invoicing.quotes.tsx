import {
  listQuotesOptions,
  showInvoicingSettingsOptions,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { CreateDocumentMenu } from "@/features/invoices/components/create-document-menu";
import { QuoteSummaryTiles } from "@/features/invoices/components/quote-summary-tiles";
import { QuotesTable } from "@/features/invoices/components/quotes-table";
import { requireInvoicing } from "@/lib/features";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/invoicing/quotes")({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  component: QuotesPage,
});

function QuotesPage() {
  const navigate = useNavigate();
  const quotes = useQuery(listQuotesOptions());
  const invoicingSettings = useQuery(showInvoicingSettingsOptions());

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            className="font-heading font-semibold text-2xl text-foreground-hi"
            data-testid="page-heading"
          >
            {m.quotes_title()}
          </h1>
          <p className="mt-1 max-w-[60ch] text-muted-foreground-3 text-sm text-pretty">
            {m.quotes_page_intro()}
          </p>
        </div>
        <CreateDocumentMenu
          document="quote"
          mode={invoicingSettings.data?.mode ?? 0}
          onAddElsewhere={() =>
            void navigate({ to: "/invoicing/quotes/external" })
          }
          onCreate={() => void navigate({ to: "/invoicing/quotes/new" })}
        />
      </div>

      {quotes.isPending ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : null}
      {quotes.isError ? (
        <Alert variant="destructive">
          <AlertDescription>{m.quotes_load_failed()}</AlertDescription>
        </Alert>
      ) : null}
      {quotes.data === undefined ? null : (
        <>
          <QuoteSummaryTiles quotes={quotes.data.quotes} />
          <QuotesTable
            onOpen={(quoteId) =>
              void navigate({
                params: { quoteId: String(quoteId) },
                to: "/invoicing/quotes/$quoteId",
              })
            }
            quotes={quotes.data.quotes}
          />
        </>
      )}
    </div>
  );
}
