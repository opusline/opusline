import { listFiscalDeadlinesOptions } from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { DeadlinesPage } from "@/features/deadlines/components/deadlines-page";
import { requireFrenchFiscality } from "@/lib/fiscality";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/deadlines")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: DeadlinesRoute,
});

function DeadlinesRoute() {
  const fiscalDeadlines = useQuery(listFiscalDeadlinesOptions());

  if (fiscalDeadlines.isPending) {
    return (
      <div className="flex max-w-270 flex-col gap-5">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (fiscalDeadlines.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.deadlines_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return <DeadlinesPage fiscalDeadlines={fiscalDeadlines.data} />;
}
