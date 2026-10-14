import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";

import { InvoiceEditorPage } from "@/features/invoices/components/invoice-editor-page";
import { useInvoiceEditor } from "@/features/invoices/lib/use-invoice-editor";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute(
  "/_authed/invoicing/invoices_/$invoiceId/edit",
)({
  component: EditInvoiceRoute,
});

function EditInvoiceRoute() {
  const { user } = Route.useRouteContext();
  const { invoiceId } = Route.useParams();
  const editor = useInvoiceEditor(user, Number(invoiceId));

  if (editor.status === "pending") {
    return <Skeleton className="h-150 w-full" />;
  }

  if (editor.status === "error") {
    return (
      <Alert className="max-w-200" variant="warn">
        <CircleAlert />
        <AlertDescription>{m.editor_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return <InvoiceEditorPage {...editor.page} />;
}
