import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";

import { InvoiceEditorPage } from "@/features/invoices/components/invoice-editor-page";
import { useQuoteEditor } from "@/features/invoices/lib/use-quote-editor";
import { requireInvoicing } from "@/lib/features";
import { m } from "@/paraglide/messages.js";

type NewQuoteSearch = {
  /** The quote this one starts as a copy of. */
  duplicate?: number;
};

export const Route = createFileRoute("/_authed/invoicing/quotes_/new")({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  validateSearch: (search: Record<string, unknown>): NewQuoteSearch => {
    const duplicate = Number(search.duplicate);

    return Number.isInteger(duplicate) && duplicate > 0 ? { duplicate } : {};
  },
  component: NewQuoteRoute,
});

function NewQuoteRoute() {
  const { user } = Route.useRouteContext();
  const { duplicate } = Route.useSearch();
  const editor = useQuoteEditor(user, null, duplicate ?? null);

  if (editor.status === "pending") {
    return <Skeleton className="h-150 w-full" />;
  }

  if (editor.status === "error") {
    return (
      <Alert className="max-w-200" variant="warn">
        <CircleAlert />
        <AlertDescription>{m.editor_quote_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return <InvoiceEditorPage {...editor.page} />;
}
