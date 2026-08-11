import type { SettingsData, UpdateSettingsData } from "@opusline/api-client";
import { useForm } from "@tanstack/react-form";

import type { FormSubmitResult } from "@/lib/form";
import {
  type SettingsFormValues,
  toSettingsPayload,
  toSettingsValues,
} from "./settings-form";

export function useSettingsForm(
  settings: SettingsData,
  onSubmit: (body: UpdateSettingsData) => Promise<FormSubmitResult>,
) {
  return useForm({
    defaultValues: toSettingsValues(settings) as SettingsFormValues,
    validators: {
      onSubmitAsync: async ({ value }) => {
        const result = await onSubmit(toSettingsPayload(value, settings));

        return result.status === "invalid"
          ? { fields: result.fieldErrors }
          : null;
      },
    },
  });
}

export type SettingsForm = ReturnType<typeof useSettingsForm>;
