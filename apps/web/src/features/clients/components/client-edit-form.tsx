import type {
  ClientType,
  ClientWithMissionsData,
  Color,
  UpdateClientData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Swatch, SwatchGroup } from "@opusline/ui/components/swatch";
import { useForm } from "@tanstack/react-form";
import { CircleAlert, PencilIcon } from "lucide-react";
import { useState } from "react";
import { AddressFields } from "@/components/address-fields";
import { FormTextField } from "@/components/form-text-field";
import { LogoPicker } from "@/components/logo-picker";
import { PaymentTermsPicker } from "@/components/payment-terms-picker";
import { clientTypeLabel } from "@/lib/client-types";
import type { FormSubmitResult } from "@/lib/form";
import type { LogoUploadResult } from "@/lib/logos";
import { COLOR_CLASSES, COLORS, colorLabel } from "@/lib/palette";
import {
  VAT_TREATMENTS,
  vatTreatmentHint,
  vatTreatmentLabel,
} from "@/lib/vat-treatment";
import { m } from "@/paraglide/messages.js";
import {
  BILLING_ADDRESS_NAMES,
  type ClientFormValues,
  toClientPayload,
} from "../lib/client-form";
import { CLIENT_TYPES } from "../lib/labels";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";
const EDIT_LABEL_CLASSES = "text-muted-foreground-3 text-xs";

type ClientEditFormProps = {
  client: ClientWithMissionsData;
  onSubmit: (body: UpdateClientData) => Promise<FormSubmitResult>;
  onCancel: () => void;
  logoSrc: string;
  onUploadLogo: (logo: File) => Promise<LogoUploadResult>;
  onRemoveLogo: () => Promise<boolean>;
  isPending?: boolean;
  error?: string | null;
};

export function ClientEditForm({
  client,
  onSubmit,
  onCancel,
  logoSrc,
  onUploadLogo,
  onRemoveLogo,
  isPending,
  error,
}: ClientEditFormProps) {
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isLogoPending, setIsLogoPending] = useState(false);

  const handleUploadLogo = async (logo: File) => {
    setIsLogoPending(true);

    try {
      const result = await onUploadLogo(logo);

      setLogoError(result.status === "failed" ? result.message : null);
    } finally {
      setIsLogoPending(false);
    }
  };

  const handleRemoveLogo = async () => {
    setIsLogoPending(true);

    try {
      setLogoError((await onRemoveLogo()) ? null : m.common_delete_failed());
    } finally {
      setIsLogoPending(false);
    }
  };

  const form = useForm({
    defaultValues: {
      name: client.name,
      type: client.type,
      siret: client.siret ?? "",
      vatNumber: client.vatNumber ?? "",
      vatTreatment: client.vatTreatment,
      billingAddressLine1: client.billingAddressLine1 ?? "",
      billingAddressLine2: client.billingAddressLine2 ?? "",
      billingPostalCode: client.billingPostalCode ?? "",
      billingCity: client.billingCity ?? "",
      billingCountry: client.billingCountry ?? "",
      billingContactName: client.billingContactName ?? "",
      billingEmail: client.billingEmail ?? "",
      color: client.color,
      paymentTermsDays: client.paymentTermsDays,
    } as ClientFormValues,
    validators: {
      onSubmitAsync: async ({ value }) => {
        const result = await onSubmit(toClientPayload(value));

        return result.status === "invalid"
          ? { fields: result.fieldErrors }
          : null;
      },
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="mb-5 flex items-center gap-3 border-b pb-3.5">
        <PencilIcon
          aria-hidden
          className="size-3.75 shrink-0 text-muted-foreground-2"
          strokeWidth={1.8}
        />
        <span className="text-foreground-hi text-sm">
          {m.clients_edit_title()}
        </span>
        <span className="flex-1" />
        <span className="text-muted-foreground-3 text-xs">
          {m.clients_edit_note()}
        </span>
      </div>

      {error ? (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid items-start gap-3.5 md:grid-cols-2">
        <div className="rounded-md border bg-card p-5">
          <div className={`${EYEBROW_CLASSES} mb-4`}>
            {m.clients_identity_title()}
          </div>
          <div className="flex flex-col gap-3.5">
            <form.Field name="name">
              {(field) => (
                <FormTextField
                  field={field}
                  label={m.clients_name_label()}
                  labelClassName={EDIT_LABEL_CLASSES}
                />
              )}
            </form.Field>

            <form.Field name="type">
              {(field) => (
                <Field>
                  <FieldLabel
                    className={EDIT_LABEL_CLASSES}
                    htmlFor={`${field.name}-options`}
                  >
                    {m.clients_type_label()}
                  </FieldLabel>
                  <ChipGroup
                    aria-label={m.clients_type_label()}
                    id={`${field.name}-options`}
                    value={[String(field.state.value)]}
                    onValueChange={(value) => {
                      const next = value[0];

                      if (typeof next === "string") {
                        field.handleChange(Number(next) as ClientType);
                      }
                    }}
                  >
                    {CLIENT_TYPES.map((clientType) => (
                      <Chip
                        key={clientType}
                        size="lg"
                        value={String(clientType)}
                      >
                        {clientTypeLabel(clientType)}
                      </Chip>
                    ))}
                  </ChipGroup>
                </Field>
              )}
            </form.Field>

            <div className="flex flex-col gap-2">
              <span className={EDIT_LABEL_CLASSES}>Logo</span>
              <div className="flex items-center gap-3">
                <LogoPicker
                  error={logoError}
                  isPending={isLogoPending}
                  label={m.clients_logo_aria()}
                  onPick={(logo) => void handleUploadLogo(logo)}
                  onRemove={() => void handleRemoveLogo()}
                  placeholder={m.clients_logo_drop_short()}
                  removeLabel={m.clients_logo_remove()}
                  size="sm"
                  src={logoSrc}
                />
                <span className="text-muted-foreground-3 text-xs leading-normal">
                  {m.clients_logo_hint_invoices()}
                </span>
              </div>
            </div>

            <form.Field name="color">
              {(field) => (
                <Field>
                  <div className="flex items-baseline gap-2">
                    <FieldLabel
                      className={EDIT_LABEL_CLASSES}
                      htmlFor={`${field.name}-swatches`}
                    >
                      {m.clients_color_label()}
                    </FieldLabel>
                    <span className="text-muted-foreground-5 text-xs">
                      {colorLabel(field.state.value)}
                    </span>
                  </div>
                  <SwatchGroup
                    aria-label={m.clients_color_label()}
                    id={`${field.name}-swatches`}
                    value={[String(field.state.value)]}
                    onValueChange={(value) => {
                      const next = value[0];

                      if (typeof next === "string") {
                        field.handleChange(Number(next) as Color);
                      }
                    }}
                  >
                    {COLORS.map((color) => (
                      <Swatch
                        key={color}
                        aria-label={colorLabel(color)}
                        className={COLOR_CLASSES[color]}
                        title={colorLabel(color)}
                        value={String(color)}
                      />
                    ))}
                  </SwatchGroup>
                </Field>
              )}
            </form.Field>

            <form.Field name="siret">
              {(field) => (
                <FormTextField
                  field={field}
                  label="SIRET"
                  labelClassName={EDIT_LABEL_CLASSES}
                  font="mono"
                />
              )}
            </form.Field>

            <form.Field name="vatNumber">
              {(field) => (
                <FormTextField
                  field={field}
                  label={m.clients_vat_short_label()}
                  labelClassName={EDIT_LABEL_CLASSES}
                  font="mono"
                />
              )}
            </form.Field>

            <form.Field name="vatTreatment">
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <span className={EDIT_LABEL_CLASSES}>
                    {m.vat_treatment_label()}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {VAT_TREATMENTS.map((treatment) => (
                      <Button
                        key={treatment}
                        aria-pressed={field.state.value === treatment}
                        onClick={() => field.handleChange(treatment)}
                        size="sm"
                        type="button"
                        variant={
                          field.state.value === treatment
                            ? "default"
                            : "outline"
                        }
                      >
                        {vatTreatmentLabel(treatment)}
                      </Button>
                    ))}
                  </div>
                  <p className="text-muted-foreground-3 text-xs">
                    {vatTreatmentHint(field.state.value)}
                  </p>
                </div>
              )}
            </form.Field>

            <AddressFields
              names={BILLING_ADDRESS_NAMES}
              complementLabel={m.address_complement_short()}
              gapClassName="gap-3.5"
              labelClassName={EDIT_LABEL_CLASSES}
              renderField={(name, render) => (
                <form.Field name={name}>{(field) => render(field)}</form.Field>
              )}
              setFieldValue={(name, value) => form.setFieldValue(name, value)}
              streetLabel={m.address_label()}
            />
          </div>
        </div>

        <div className="rounded-md border bg-card p-5">
          <div className={`${EYEBROW_CLASSES} mb-4`}>
            {m.common_billing_title()}
          </div>
          <div className="flex flex-col gap-3.5">
            <form.Field name="billingContactName">
              {(field) => (
                <FormTextField
                  field={field}
                  label="Contact"
                  labelClassName={EDIT_LABEL_CLASSES}
                />
              )}
            </form.Field>

            <form.Field name="billingEmail">
              {(field) => (
                <FormTextField
                  field={field}
                  label="Email"
                  labelClassName={EDIT_LABEL_CLASSES}
                  type="email"
                />
              )}
            </form.Field>

            <form.Field name="paymentTermsDays">
              {(field) => {
                const isInvalid = !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className={EDIT_LABEL_CLASSES}
                      htmlFor={`${field.name}-options`}
                    >
                      {m.clients_payment_terms_label()}
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
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-4">
        <Button disabled={isPending} size="xl" type="submit">
          {m.common_save()}
        </Button>
        <Button
          disabled={isPending}
          onClick={onCancel}
          size="xl"
          type="button"
          variant="ghost"
        >
          {m.common_cancel()}
        </Button>
      </div>
    </form>
  );
}
