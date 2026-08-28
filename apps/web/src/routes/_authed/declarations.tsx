import { showDeclarationsOptions } from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DeclarationsPage } from "@/features/declarations/components/declarations-page";
import { requireFrenchFiscality } from "@/lib/fiscality";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/declarations")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: DeclarationsRoute,
});

function DeclarationsRoute() {
  const declarations = useQuery(showDeclarationsOptions());

  const loadFailed = (
    <Alert variant="destructive">
      <AlertDescription>{m.declarations_load_failed()}</AlertDescription>
    </Alert>
  );

  if (declarations.isPending) {
    return (
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (declarations.data === undefined) {
    return loadFailed;
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* A failed refetch keeps the last good figures on screen — they are what
          the user came to copy, so the error sits above them. */}
      {declarations.isError && loadFailed}

      <DeclarationsPage data={declarations.data} />
    </div>
  );
}
