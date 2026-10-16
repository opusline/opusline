import {
  createExternalQuoteMutation,
  listClientsOptions,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import {
  ExternalQuotePage,
  type ExternalQuoteSubmit,
} from "@/features/invoices/components/external-quote-page";
import { accountTodayCalendarDate } from "@/lib/dates";
import { requireInvoicing } from "@/lib/features";
import { invalidateQuoteWrites } from "@/lib/query-invalidation";
import { uploadWithProgress } from "@/lib/upload-with-progress";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/invoicing/quotes_/external")({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  component: ExternalQuoteRoute,
});

function ExternalQuoteRoute() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const toast = useToast();
  const format = useMoneyFormat();
  const clients = useQuery(listClientsOptions());
  const [error, setError] = useState<string | null>(null);
  const create = useMutation(createExternalQuoteMutation());

  const submit = async (input: ExternalQuoteSubmit) => {
    setError(null);

    let created: Awaited<ReturnType<typeof create.mutateAsync>>;

    try {
      created = await create.mutateAsync({
        body: {
          clientId: input.clientId,
          title: input.title,
          number: input.number,
          amountHt: { amount: input.amountHtCents, currency: format.currency },
          issuedOn: input.issuedOn,
          status: input.status,
        },
      });
    } catch (failure) {
      setError(serverErrorMessage(failure, m.external_quote_failed()));

      return;
    }

    // The quote exists from here on: a file that fails to land is reported
    // on its page, where it can be dropped again, not as a failed form.
    if (input.file !== null) {
      try {
        await uploadWithProgress({
          url: "/invoicing/quotes/{quote}/document",
          path: { quote: created.quote.id },
          field: "file",
          file: input.file,
          onProgress: () => {},
        });
      } catch {
        toast.add({ title: m.quote_document_failed() });
      }
    }

    toast.add({
      title: m.external_quote_created_toast({ number: input.number }),
    });
    await invalidateQuoteWrites(queryClient);
    await navigate({
      to: "/invoicing/quotes/$quoteId",
      params: { quoteId: String(created.quote.id) },
    });
  };

  if (clients.isPending) {
    return <Skeleton className="h-150 w-full" />;
  }

  if (clients.isError) {
    return (
      <Alert className="max-w-200" variant="warn">
        <CircleAlert />
        <AlertDescription>{m.external_quote_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ExternalQuotePage
      accountToday={accountTodayCalendarDate(user.timezone)}
      clients={clients.data.clients}
      error={error}
      isSaving={create.isPending}
      onSubmit={(input) => void submit(input)}
    />
  );
}
