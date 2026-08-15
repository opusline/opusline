import { listClientsOptions } from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { ClientsTable } from "@/features/clients/components/clients-table";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const { data, isPending, isError } = useQuery(listClientsOptions());

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.nav_clients()}
        </h1>
        <Button render={<Link to="/clients/new" />} size="xl">
          <PlusIcon aria-hidden data-icon="inline-start" />
          {m.clients_new_title()}
        </Button>
      </div>
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
          <AlertDescription>{m.clients_load_failed()}</AlertDescription>
        </Alert>
      )}
      {data !== undefined && <ClientsTable clients={data.clients} />}
    </div>
  );
}
