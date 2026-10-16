import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";

import { InvoiceEditorPage } from "@/features/invoices/components/invoice-editor-page";
import { useInvoiceEditor } from "@/features/invoices/lib/use-invoice-editor";
import { requireInvoicing } from "@/lib/features";
import { m } from "@/paraglide/messages.js";

type NewInvoiceSearch = {
  /** The invoice this one starts as a copy of. */
  duplicate?: number;
};

export const Route = createFileRoute("/_authed/invoicing/invoices_/new")({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  validateSearch: (search: Record<string, unknown>): NewInvoiceSearch => {
    const duplicate = Number(search.duplicate);

    return Number.isInteger(duplicate) && duplicate > 0 ? { duplicate } : {};
  },
  component: NewInvoiceRoute,
});

function NewInvoiceRoute() {
  const { user } = Route.useRouteContext();
  const { duplicate } = Route.useSearch();
  const editor = useInvoiceEditor(user, null, duplicate ?? null);

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
