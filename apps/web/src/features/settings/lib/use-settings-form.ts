import type { SettingsData, UpdateSettingsData } from "@opusline/api-client";
import { useForm } from "@tanstack/react-form";

import { useMoneyFormat } from "@/components/money-format-provider";
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
  const format = useMoneyFormat();

  return useForm({
    defaultValues: toSettingsValues(format, settings) as SettingsFormValues,
    validators: {
      onSubmitAsync: async ({ value }) => {
        const result = await onSubmit(
          toSettingsPayload(format, value, settings),
        );

        return result.status === "invalid"
          ? { fields: result.fieldErrors }
          : null;
      },
    },
  });
}

export type SettingsForm = ReturnType<typeof useSettingsForm>;
