import type { CatalogItemData } from "@opusline/api-client";
import {
  createCatalogItemMutation,
  deleteCatalogItemMutation,
  listCatalogItemsOptions,
  listCatalogItemsQueryKey,
  updateCatalogItemMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { CatalogPage } from "@/features/invoices/components/catalog-page";
import { requireInvoicing } from "@/lib/features";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/invoicing/catalog")({
  beforeLoad: ({ context }) => requireInvoicing(context.user),
  component: CatalogRoute,
});

function CatalogRoute() {
  const { user } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const toast = useToast();
  const catalog = useQuery(listCatalogItemsOptions());
  const [error, setError] = useState<string | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: listCatalogItemsQueryKey() });
  const create = useMutation(createCatalogItemMutation());
  const update = useMutation(updateCatalogItemMutation());
  const remove = useMutation({
    ...deleteCatalogItemMutation(),
    onSuccess: refresh,
  });

  if (catalog.isPending) {
    return <Skeleton className="h-64 w-full max-w-200" />;
  }

  if (catalog.isError) {
    return (
      <Alert className="max-w-200" variant="warn">
        <CircleAlert />
        <AlertDescription>{m.catalog_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <CatalogPage
      error={error}
      isSaving={create.isPending || update.isPending || remove.isPending}
      items={catalog.data.items}
      onRemove={(item: CatalogItemData) =>
        remove.mutate(
          { path: { catalogItem: item.id } },
          {
            onSuccess: () =>
              toast.add({ title: m.catalog_removed({ label: item.label }) }),
            onError: (failure) =>
              setError(serverErrorMessage(failure, m.common_save_failed())),
          },
        )
      }
      onSave={async (id, body) => {
        try {
          if (id === null) {
            await create.mutateAsync({ body });
            toast.add({ title: m.catalog_added() });
          } else {
            await update.mutateAsync({ body, path: { catalogItem: id } });
            toast.add({ title: m.catalog_saved() });
          }

          setError(null);
          await refresh();

          return true;
        } catch (failure) {
          setError(serverErrorMessage(failure, m.common_save_failed()));

          return false;
        }
      }}
      vatLiable={user.vatLiable}
    />
  );
}
