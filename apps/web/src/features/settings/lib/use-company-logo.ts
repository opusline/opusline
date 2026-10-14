import {
  deleteCompanyLogoMutation,
  showSettingsQueryKey,
  uploadCompanyLogoMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { companyLogoHref } from "@/lib/logos";
import { serverErrorMessage, serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";
import type { CompanyLogoSlot } from "../components/identity-settings-form";

export function useCompanyLogo(hasLogo: boolean): CompanyLogoSlot {
  const queryClient = useQueryClient();
  // The URL never changes, so a replaced logo needs a cache-busting version.
  const [version, setVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setError(null);
    setVersion((current) => current + 1);
    await queryClient.invalidateQueries({ queryKey: showSettingsQueryKey() });
  };

  const upload = useMutation({
    ...uploadCompanyLogoMutation(),
    onSuccess: refresh,
    onError: (failure) =>
      setError(
        serverFieldErrors(failure)?.logo?.message ??
          serverErrorMessage(failure, m.common_upload_failed()),
      ),
  });

  const remove = useMutation({
    ...deleteCompanyLogoMutation(),
    onSuccess: refresh,
    onError: () => setError(m.common_upload_failed()),
  });

  return {
    src: hasLogo ? companyLogoHref(version) : undefined,
    isPending: upload.isPending || remove.isPending,
    error,
    onPick: (logo) => upload.mutate({ body: { logo } }),
    onRemove: () => remove.mutate({}),
  };
}
