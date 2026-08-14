import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";

import { FormTextField } from "@/components/form-text-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import { PaymentTermsPicker } from "@/components/payment-terms-picker";
import { currencySymbol, formatRateDraft } from "@/lib/billing";
import {
  hasInvoiceNumberCounter,
  parseBufferCents,
  previewInvoiceNumber,
} from "../lib/settings-form";
import type { SettingsForm } from "../lib/use-settings-form";
import { SettingsSection } from "./settings-section";

export function BillingSettingsForm({ form }: { form: SettingsForm }) {
  const format = useMoneyFormat();

  return (
    <SettingsSection
      description="Valeurs proposées à la création d'un client, et seuil utilisé par la page Trésorerie."
      title="Facturation et trésorerie"
    >
      <form.Field name="defaultPaymentTermsDays">
        {(field) => {
          const isInvalid = !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel
                className="text-foreground-3 text-sm"
                htmlFor={`${field.name}-options`}
              >
                Délai de paiement par défaut
              </FieldLabel>
              <PaymentTermsPicker
                id={`${field.name}-options`}
                isInvalid={isInvalid}
                onBlur={field.handleBlur}
                onChange={field.handleChange}
                value={field.state.value}
                variant="inline"
              />
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : (
                <FieldDescription>
                  Au-delà de 60 jours, pensez aux pénalités de retard légales.
                </FieldDescription>
              )}
            </Field>
          );
        }}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field
        name="invoiceNumberFormat"
        validators={{
          onChange: ({ value }: { value: string }) =>
            hasInvoiceNumberCounter(value)
              ? undefined
              : { message: "Le format doit contenir un seul compteur NNN." },
        }}
      >
        {(field) => (
          <FormTextField
            beside={
              <span
                aria-live="polite"
                className="text-muted-foreground-3 text-sm"
                id={`${field.name}-preview`}
              >
                Prochaine :{" "}
                <span className="font-mono text-foreground-3">
                  {previewInvoiceNumber(field.state.value, new Date())}
                </span>
              </span>
            }
            describedBy={`${field.name}-preview`}
            description="Jetons disponibles : AAAA (année), MM (mois), NNN (compteur)."
            field={field}
            font="mono"
            inputClassName="min-w-45 flex-1"
            label="Numérotation des factures"
            labelClassName="text-foreground-3 text-sm"
          />
        )}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field
        name="treasuryBuffer"
        validators={{
          onChange: ({ value }: { value: string }) =>
            value.trim() === "" ||
            parseBufferCents(format.locale, value) !== null
              ? undefined
              : { message: "Indiquez un montant, ou laissez vide." },
        }}
      >
        {(field) => (
          <FormTextField
            adornment={currencySymbol(format)}
            beside={
              <span
                className="min-w-50 flex-1 text-muted-foreground-3 text-xs"
                id={`${field.name}-hint`}
              >
                Somme gardée sur le compte pro avant tout virement vers votre
                compte personnel.
              </span>
            }
            controlClassName="w-37.5 shrink-0"
            describedBy={`${field.name}-hint`}
            field={{
              name: field.name,
              state: field.state,
              handleBlur: field.handleBlur,
              handleChange: (value: string) =>
                field.handleChange(formatRateDraft(format.locale, value)),
            }}
            font="mono"
            inputMode="decimal"
            label="Matelas de trésorerie"
            labelClassName="text-foreground-3 text-sm"
            placeholder="0"
          />
        )}
      </form.Field>
    </SettingsSection>
  );
}
