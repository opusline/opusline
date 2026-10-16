import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";

import { InvoiceEditorPage } from "@/features/invoices/components/invoice-editor-page";
import { useQuoteEditor } from "@/features/invoices/lib/use-quote-editor";
import { requireInvoicing } from "@/lib/features";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute(
  "/_authed/invoicing/quotes_/$quoteId_/edit",
)({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  component: EditQuoteRoute,
});

function EditQuoteRoute() {
  const { user } = Route.useRouteContext();
  const { quoteId } = Route.useParams();
  const editor = useQuoteEditor(user, Number(quoteId));

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
