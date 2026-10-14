import type { InvoicingSettingsData } from "@opusline/api-client";
import {
  currentUserQueryKey,
  showInvoicingSettingsOptions,
  showInvoicingSettingsQueryKey,
  showSettingsOptions,
  updateInvoicingSettingsMutation,
} from "@opusline/api-client/react-query";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { useToast } from "@opusline/ui/components/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { InvoicingSettingsPage } from "@/features/invoices/components/invoicing-settings-page";
import { useCompanyLogo } from "@/lib/use-company-logo";
import { serverErrorMessage } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/invoicing/settings")({
  component: InvoicingSettingsRoute,
});

function InvoicingSettingsRoute() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const settings = useQuery(showInvoicingSettingsOptions());
  const identity = useQuery(showSettingsOptions());
  const logo = useCompanyLogo(identity.data?.hasLogo ?? false);
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    ...updateInvoicingSettingsMutation(),
    onSuccess: (saved: InvoicingSettingsData) => {
      setError(null);
      queryClient.setQueryData(showInvoicingSettingsQueryKey(), saved);
      // The new-client form starts from the account's payment term.
      queryClient.setQueryData(
        currentUserQueryKey(),
        (user) =>
          user && {
            ...user,
            defaultPaymentTermsDays: saved.defaultPaymentTermsDays,
          },
      );
      toast.add({ title: m.invoicing_settings_saved() });
    },
    onError: (failure) =>
      setError(serverErrorMessage(failure, m.common_save_failed())),
  });

  if (settings.isPending || identity.isPending) {
    return <Skeleton className="h-96 w-full max-w-180" />;
  }

  if (settings.isError || identity.isError) {
    return (
      <Alert className="max-w-180" variant="warn">
        <CircleAlert />
        <AlertDescription>
          {m.invoicing_settings_load_failed()}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <InvoicingSettingsPage
      error={error}
      identity={identity.data}
      isSaving={save.isPending}
      logo={logo}
      onSave={(body) => save.mutate({ body })}
      settings={settings.data}
    />
  );
}
