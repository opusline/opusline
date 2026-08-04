import { listClientsOptions } from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ClientsTable } from "@/features/clients/components/clients-table";

export const Route = createFileRoute("/_authed/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const { data, isPending, isError } = useQuery(listClientsOptions());

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        Clients
      </h1>
      {isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}
      {isError && (
        <Alert variant="destructive">
          <AlertDescription>
            Impossible de charger les clients. Réessayez dans un instant.
          </AlertDescription>
        </Alert>
      )}
      {data !== undefined && <ClientsTable clients={data.clients} />}
    </div>
  );
}
