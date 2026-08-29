import type { Locale } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Switch } from "@opusline/ui/components/switch";
import { cn } from "@opusline/ui/lib/utils";
import { RefreshCw } from "lucide-react";
import { FormDateField } from "@/components/form-date-field";
import { useLocale } from "@/components/money-format-provider";
import { fullDateLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import type { SettingsForm } from "../lib/use-settings-form";

function rateStatusLabel({
  locale,
  refreshError,
  isBackgroundRefresh,
  isSituationUnsaved,
  ratesCheckedAt,
  ratesYear,
}: {
  locale: Locale;
  refreshError: string | null;
  isBackgroundRefresh: boolean;
  isSituationUnsaved: boolean;
  ratesCheckedAt: string | null;
  ratesYear: number | null;
}): string {
  if (refreshError !== null) {
    return refreshError;
  }

  if (isBackgroundRefresh) {
    return m.settings_rates_refreshing();
  }

  if (isSituationUnsaved) {
    return m.settings_rates_unsaved();
  }

  if (ratesCheckedAt === null) {
    return m.settings_rates_never_read();
  }

  return m.settings_rates_status({
    year: String(ratesYear),
    date: fullDateLabel(locale, ratesCheckedAt),
  });
}

type RateSourceProps = {
  form: SettingsForm;
  ratesCheckedAt: string | null;
  ratesYear: number | null;
  savedAcre: boolean;
  savedBusinessStartedOn: string | null;
  isRefreshing: boolean;
  /** A save scheduled a background barème read that has not landed yet. */
  isBackgroundRefresh: boolean;
  refreshError: string | null;
  onRefresh: () => void;
};

export function RateSource({
  form,
  ratesCheckedAt,
  ratesYear,
  savedAcre,
  savedBusinessStartedOn,
  isRefreshing,
  isBackgroundRefresh,
  refreshError,
  onRefresh,
}: RateSourceProps) {
  const locale = useLocale();

  return (
    <div>
      <form.Field name="autoRates">
        {(field) => (
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="mb-1 text-foreground-3 text-sm">
                {m.settings_rates_source_label()}
              </div>
              <div className="text-muted-foreground-2 text-xs leading-relaxed">
                {m.settings_rates_source_hint()}
              </div>
            </div>
            <Switch
              aria-label={m.settings_rates_source_label()}
              checked={field.state.value}
              onCheckedChange={field.handleChange}
            />
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => ({
          autoRates: state.values.autoRates,
          isSituationUnsaved:
            state.values.acre !== savedAcre ||
            (state.values.businessStartedOn === ""
              ? null
              : state.values.businessStartedOn) !== savedBusinessStartedOn,
        })}
      >
        {({ autoRates, isSituationUnsaved }) =>
          autoRates ? (
            <>
              <div className="mt-3.5 flex flex-wrap items-center gap-3 rounded-md border bg-muted px-4 py-3">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    refreshError === null && !isSituationUnsaved
                      ? "bg-success"
                      : "bg-primary",
                  )}
                />
                <span
                  aria-live="polite"
                  className="min-w-40 flex-1 text-foreground-3 text-sm"
                >
                  {rateStatusLabel({
                    locale,
                    refreshError,
                    isBackgroundRefresh,
                    isSituationUnsaved,
                    ratesCheckedAt,
                    ratesYear,
                  })}
                </span>
                <Button
                  disabled={
                    isRefreshing || isBackgroundRefresh || isSituationUnsaved
                  }
                  onClick={onRefresh}
                  size="lg"
                  type="button"
                  variant="outline"
                >
                  <RefreshCw data-icon="inline-start" />
                  {m.settings_rates_check_now()}
                </Button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <form.Field
                  name="businessStartedOn"
                  validators={{
                    onChangeListenTo: ["acre"],
                    onChange: ({ value, fieldApi }) =>
                      fieldApi.form.getFieldValue("acre") && value === ""
                        ? { message: m.settings_acre_required() }
                        : undefined,
                  }}
                >
                  {(field) => (
                    <FormDateField
                      field={field}
                      label={m.settings_business_started_label()}
                      labelClassName="text-muted-foreground-2 text-xs"
                    />
                  )}
                </form.Field>

                <form.Field name="acre">
                  {(field) => (
                    <div className="flex items-start justify-between gap-4 sm:pt-6">
                      <div className="text-muted-foreground-2 text-xs leading-relaxed">
                        {m.settings_acre_label()}
                      </div>
                      <Switch
                        aria-label={m.settings_acre_switch_label()}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                      />
                    </div>
                  )}
                </form.Field>
              </div>
            </>
          ) : null
        }
      </form.Subscribe>
    </div>
  );
}
