import type { DeclarationData } from "@opusline/api-client";
import {
  listDeclarationsOptions,
  listDeclarationsQueryKey,
  recordDeclarationMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { DeclarationsPage } from "@/features/declarations/components/declarations-page";
import { requireFrenchFiscality } from "@/lib/fiscality";
import { operationFilter } from "@/lib/query-invalidation";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/declarations")({
  beforeLoad: ({ context }) => requireFrenchFiscality(context.user),
  component: DeclarationsRoute,
});

function DeclarationsRoute() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const declarations = useQuery(listDeclarationsOptions());
  const recordDeclaration = useMutation(recordDeclarationMutation());

  const handleMarkFiled = async (declaration: DeclarationData) => {
    setError(null);

    try {
      await recordDeclaration.mutateAsync({
        body: { kind: declaration.kind, period: declaration.period },
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: listDeclarationsQueryKey() }),
        // The deadlines screen reads the same periods and must not keep
        // showing one as outstanding after it was filed here.
        queryClient.invalidateQueries(operationFilter("listFiscalDeadlines")),
      ]);
    } catch (caught) {
      setError(serverErrorMessage(caught, m.declarations_save_failed()));
    }
  };

  if (declarations.isPending) {
    return (
      <div className="flex max-w-270 flex-col gap-5">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (declarations.data === undefined) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{m.declarations_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <DeclarationsPage
      declarations={declarations.data}
      error={error}
      isSaving={recordDeclaration.isPending}
      onMarkFiled={(declaration) => void handleMarkFiled(declaration)}
    />
  );
}
