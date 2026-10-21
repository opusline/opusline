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
  /** The mission whose unbilled time it starts on. */
  mission?: number;
};

function positiveId(value: unknown): number | undefined {
  const id = Number(value);

  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export const Route = createFileRoute("/_authed/invoicing/invoices_/new")({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  validateSearch: (search: Record<string, unknown>): NewInvoiceSearch => {
    const duplicate = positiveId(search.duplicate);
    const mission = positiveId(search.mission);

    return {
      ...(duplicate === undefined ? {} : { duplicate }),
      ...(mission === undefined ? {} : { mission }),
    };
  },
  component: NewInvoiceRoute,
});

function NewInvoiceRoute() {
  const { user } = Route.useRouteContext();
  const { duplicate, mission } = Route.useSearch();
  const editor = useInvoiceEditor(
    user,
    null,
    duplicate ?? null,
    mission ?? null,
  );

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
