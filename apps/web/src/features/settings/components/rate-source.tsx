import { Button } from "@opusline/ui/components/button";
import { Switch } from "@opusline/ui/components/switch";
import { cn } from "@opusline/ui/lib/utils";
import { RefreshCw } from "lucide-react";

import { FormTextField } from "@/components/form-text-field";
import { fullDateLabel } from "@/lib/dates";
import type { SettingsForm } from "../lib/use-settings-form";

type RateSourceProps = {
  form: SettingsForm;
  ratesCheckedAt: string | null;
  ratesYear: number | null;
  savedAcre: boolean;
  savedBusinessStartedOn: string | null;
  isRefreshing: boolean;
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
  refreshError,
  onRefresh,
}: RateSourceProps) {
  return (
    <div>
      <form.Field name="autoRates">
        {(field) => (
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="mb-1 text-foreground-3 text-sm">
                Source des taux
              </div>
              <div className="text-muted-foreground-2 text-xs leading-relaxed">
                Opusline lit les barèmes publiés par l'URSSAF et applique le
                taux en vigueur.
              </div>
            </div>
            <Switch
              aria-label="Source des taux"
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
                  {refreshError ??
                    (isSituationUnsaved
                      ? "Enregistrez pour appliquer le barème à cette situation."
                      : ratesCheckedAt === null
                        ? "Barème jamais lu"
                        : `Barème ${ratesYear} · dernière vérification le ${fullDateLabel(ratesCheckedAt)}`)}
                </span>
                <Button
                  disabled={isRefreshing || isSituationUnsaved}
                  onClick={onRefresh}
                  size="lg"
                  type="button"
                  variant="outline"
                >
                  <RefreshCw data-icon="inline-start" />
                  Vérifier maintenant
                </Button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <form.Field name="businessStartedOn">
                  {(field) => (
                    <FormTextField
                      field={field}
                      font="mono"
                      label="Début d'activité"
                      labelClassName="text-muted-foreground-2 text-xs"
                      type="date"
                    />
                  )}
                </form.Field>

                <form.Field name="acre">
                  {(field) => (
                    <div className="flex items-start justify-between gap-4 sm:pt-6">
                      <div className="text-muted-foreground-2 text-xs leading-relaxed">
                        Je bénéficie de l'ACRE — le taux est réduit pendant les
                        quatre premiers trimestres.
                      </div>
                      <Switch
                        aria-label="Je bénéficie de l'ACRE"
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
