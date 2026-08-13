import {
  listInvoicesOptions,
  showInvoiceOptions,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { InvoiceDrawer } from "@/features/invoices/components/invoice-drawer";
import { InvoicesTable } from "@/features/invoices/components/invoices-table";

export const Route = createFileRoute("/_authed/factures")({
  component: FacturesPage,
});

function FacturesPage() {
  const { data, isPending, isError } = useQuery(listInvoicesOptions());
  const [openInvoiceId, setOpenInvoiceId] = useState<number | null>(null);

  const detail = useQuery({
    ...showInvoiceOptions({ path: { invoice: openInvoiceId ?? 0 } }),
    enabled: openInvoiceId !== null,
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          Factures
        </h1>
        <p className="mt-1 max-w-[60ch] text-muted-foreground-3 text-sm text-pretty">
          Les factures sont éditées ailleurs. Opusline garde la trace de ce qui
          est facturé, de ce qui reste à facturer et de ce qui est encaissé.
        </p>
      </div>
      {isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Impossible de charger les factures. Réessayez dans un instant.
          </AlertDescription>
        </Alert>
      )}
      {data !== undefined && (
        <InvoicesTable invoices={data.invoices} onOpen={setOpenInvoiceId} />
      )}
      <InvoiceDrawer
        detail={detail.data}
        open={openInvoiceId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setOpenInvoiceId(null);
          }
        }}
      />
    </div>
  );
}
