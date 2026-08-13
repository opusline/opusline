import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";

import { FormTextField } from "@/components/form-text-field";
import { PaymentTermsPicker } from "@/components/payment-terms-picker";
import { formatRateDraft } from "@/lib/billing";
import { parseBufferCents, previewInvoiceNumber } from "../lib/settings-form";
import type { SettingsForm } from "../lib/use-settings-form";
import { SettingsSection } from "./settings-section";

export function BillingSettingsForm({ form }: { form: SettingsForm }) {
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
            value.includes("NNN")
              ? undefined
              : { message: "Le format doit contenir le compteur NNN." },
        }}
      >
        {(field) => (
          <>
            <FormTextField
              describedBy={`${field.name}-preview`}
              description="Jetons disponibles : AAAA (année), MM (mois), NNN (compteur)."
              field={field}
              font="mono"
              inputClassName="min-w-45 flex-1"
              label="Numérotation des factures"
              labelClassName="text-foreground-3 text-sm"
            />
            <span
              aria-live="polite"
              className="mt-2 block text-muted-foreground-3 text-sm"
              id={`${field.name}-preview`}
            >
              Prochaine :{" "}
              <span className="font-mono text-foreground-3">
                {previewInvoiceNumber(field.state.value, new Date())}
              </span>
            </span>
          </>
        )}
      </form.Field>

      <div className="my-5.5 h-px bg-secondary" />

      <form.Field
        name="treasuryBuffer"
        validators={{
          onChange: ({ value }: { value: string }) =>
            value.trim() === "" || parseBufferCents(value) !== null
              ? undefined
              : { message: "Indiquez un montant, ou laissez vide." },
        }}
      >
        {(field) => (
          <FormTextField
            adornment="€"
            description="Retenu en plus des provisions fiscales dans « Combien je peux me virer ? ». Laissez vide pour aucun matelas."
            field={{
              name: field.name,
              state: field.state,
              handleBlur: field.handleBlur,
              handleChange: (value: string) =>
                field.handleChange(formatRateDraft(value)),
            }}
            fieldClassName="max-w-45"
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
