import type { ClientType, Color, CreateClientData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { ChipGroup, ChipOption } from "@opusline/ui/components/chip";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Separator } from "@opusline/ui/components/separator";
import { Swatch, SwatchGroup } from "@opusline/ui/components/swatch";
import { cn } from "@opusline/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { CircleAlert, InfoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AddressFields } from "@/components/address-fields";
import { ClientLogo } from "@/components/client-logo";
import { FormTextField } from "@/components/form-text-field";
import { LogoPicker } from "@/components/logo-picker";
import { PaymentTermsPicker } from "@/components/payment-terms-picker";
import { paymentTermsLabel } from "@/lib/billing";
import type { FormSubmitResult } from "@/lib/form";
import { COLOR_CLASSES, COLORS, colorLabel } from "@/lib/palette";
import { m } from "@/paraglide/messages.js";
import {
  BILLING_ADDRESS_NAMES,
  type ClientFormValues,
  toClientPayload,
} from "../lib/client-form";
import {
  CLIENT_TYPES,
  clientTypeHint,
  clientTypeOptionLabel,
  randomColor,
} from "../lib/labels";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

type NewClientPageProps = {
  onSubmit: (
    body: CreateClientData,
    chainToMission: boolean,
    logo: File | null,
  ) => Promise<FormSubmitResult>;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
};

export function NewClientPage({
  onSubmit,
  onCancel,
  isPending,
  error,
}: NewClientPageProps) {
  const [defaultColor] = useState<Color>(randomColor);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const chainToMissionRef = useRef(false);

  useEffect(() => {
    if (logo === null) {
      setLogoPreview(undefined);
      return;
    }

    const url = URL.createObjectURL(logo);
    setLogoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [logo]);

  const form = useForm({
    defaultValues: {
      name: "",
      type: 0,
      siret: "",
      vatNumber: "",
      billingAddressLine1: "",
      billingAddressLine2: "",
      billingPostalCode: "",
      billingCity: "",
      billingCountry: "",
      billingContactName: "",
      billingEmail: "",
      color: defaultColor,
      paymentTermsDays: 45,
    } as ClientFormValues,
    validators: {
      onSubmitAsync: async ({ value }) => {
        const result = await onSubmit(
          toClientPayload(value),
          chainToMissionRef.current,
          logo,
        );

        return result.status === "invalid"
          ? { fields: result.fieldErrors }
          : null;
      },
    },
  });

  return (
    <div className="grid max-w-270 items-start gap-4 md:grid-cols-2">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2 text-muted-foreground-2 text-sm">
          <Link
            className="text-link transition-colors hover:text-link-hover"
            to="/clients"
          >
            {m.nav_clients()}
          </Link>
          <span>/</span>
          <span className="text-muted-foreground">
            {m.clients_breadcrumb_new()}
          </span>
        </div>
        <h1 className="mb-1 font-heading font-semibold text-2xl text-foreground-hi">
          {m.clients_new_title()}
        </h1>
        <p className="mb-5 text-muted-foreground-3 text-sm">
          {m.clients_new_subtitle()}
        </p>

        <form
          className="flex flex-col gap-5 rounded-md border bg-card p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          {error ? (
            <Alert variant="warn">
              <CircleAlert />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-wrap items-start gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-foreground-3 text-sm">Logo</span>
              <LogoPicker
                isPending={isPending}
                label={m.clients_logo_aria()}
                onPick={setLogo}
                onRemove={() => setLogo(null)}
                placeholder={m.clients_logo_drop()}
                removeLabel={m.clients_logo_remove()}
                size="lg"
                src={logoPreview}
              />
              <span className="w-49 text-muted-foreground-3 text-xs leading-normal">
                {m.clients_logo_hint()}
              </span>
            </div>
            <div className="min-w-60 flex-1">
              <form.Field name="name">
                {(field) => (
                  <FormTextField
                    field={field}
                    label={m.clients_name_label()}
                    labelClassName="text-foreground-3"
                    placeholder="Nordlys"
                  />
                )}
              </form.Field>
            </div>
          </div>

          <form.Field name="type">
            {(field) => (
              <Field>
                <FieldLabel
                  className="text-foreground-3"
                  htmlFor={`${field.name}-options`}
                >
                  {m.clients_type_label()}
                </FieldLabel>
                <ChipGroup
                  aria-label={m.clients_type_label()}
                  className="items-stretch"
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
                    <ChipOption
                      className="min-w-48 flex-1"
                      key={clientType}
                      value={String(clientType)}
                      label={clientTypeOptionLabel(clientType)}
                      hint={clientTypeHint(clientType)}
                    />
                  ))}
                </ChipGroup>
              </Field>
            )}
          </form.Field>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="siret">
              {(field) => (
                <FormTextField
                  field={field}
                  label="SIRET"
                  labelClassName="text-foreground-3"
                  font="mono"
                  placeholder="443 061 841 00047"
                />
              )}
            </form.Field>
            <form.Field name="vatNumber">
              {(field) => (
                <FormTextField
                  field={field}
                  label={m.clients_vat_label()}
                  labelClassName="text-foreground-3"
                  font="mono"
                  placeholder="FR64 443061841"
                />
              )}
            </form.Field>
          </div>

          <AddressFields
            names={BILLING_ADDRESS_NAMES}
            complementLabel={m.address_complement_label()}
            gapClassName="gap-4"
            labelClassName="text-foreground-3"
            renderField={(name, render) => (
              <form.Field name={name}>{(field) => render(field)}</form.Field>
            )}
            setFieldValue={(name, value) => form.setFieldValue(name, value)}
            streetLabel={m.clients_billing_address_label()}
            withPlaceholders
          />

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="billingContactName">
              {(field) => (
                <FormTextField
                  field={field}
                  label={m.clients_contact_label()}
                  labelClassName="text-foreground-3"
                  placeholder="Camille Dupont"
                />
              )}
            </form.Field>
            <form.Field name="billingEmail">
              {(field) => (
                <FormTextField
                  field={field}
                  label={m.clients_billing_email_label()}
                  labelClassName="text-foreground-3"
                  type="email"
                  placeholder="factures@nordlys.example"
                />
              )}
            </form.Field>
          </div>

          <form.Field name="color">
            {(field) => (
              <Field>
                <div className="flex items-baseline gap-2">
                  <FieldLabel
                    className="text-foreground-3"
                    htmlFor={`${field.name}-swatches`}
                  >
                    {m.clients_default_color_label()}
                  </FieldLabel>
                  <span className="text-muted-foreground-3 text-xs">
                    {colorLabel(field.state.value)} ·{" "}
                    {m.clients_color_inherited()}
                  </span>
                </div>
                <SwatchGroup
                  aria-label={m.clients_default_color_label()}
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

          <form.Field name="paymentTermsDays">
            {(field) => {
              const isInvalid = !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    className="text-foreground-3"
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
                  <p className="text-muted-foreground-3 text-xs">
                    {m.clients_payment_terms_hint()}
                  </p>
                  {isInvalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              );
            }}
          </form.Field>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              disabled={isPending}
              onClick={() => {
                chainToMissionRef.current = false;
              }}
              size="2xl"
              type="submit"
            >
              {m.clients_create_submit()}
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                chainToMissionRef.current = true;
              }}
              size="2xl"
              type="submit"
              variant="outline"
            >
              {m.clients_create_and_chain()}
            </Button>
            <Button
              disabled={isPending}
              onClick={onCancel}
              size="2xl"
              type="button"
              variant="ghost"
            >
              {m.timer_cancel()}
            </Button>
          </div>
        </form>
      </div>

      <form.Subscribe selector={(state) => state.values}>
        {(values) => (
          <div className="flex min-w-0 flex-col gap-3.5">
            <div>
              <div className={cn(EYEBROW_CLASSES, "mb-2.5")}>
                {m.clients_preview_title()}
              </div>
              <div className="flex items-center gap-3 rounded-md border bg-card px-5 py-4">
                <ClientLogo name={values.name} size="sm" src={logoPreview} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className={cn(
                        "size-2.5 shrink-0 rounded-sm",
                        COLOR_CLASSES[values.color],
                      )}
                    />
                    <span
                      className={cn(
                        "truncate text-sm",
                        values.name.trim() === ""
                          ? "text-muted-foreground-5"
                          : "font-medium text-foreground-hi",
                      )}
                    >
                      {values.name.trim() === ""
                        ? m.clients_preview_name_placeholder()
                        : values.name}
                    </span>
                  </div>
                  <div className="mt-0.75 text-muted-foreground-3 text-xs">
                    {m.clients_payment_at({
                      terms: paymentTermsLabel(values.paymentTermsDays),
                    })}
                  </div>
                </div>
              </div>
            </div>

            {values.type === 1 && (
              <div className="rounded-md border border-primary/32 bg-primary/7 px-5 py-4">
                <div className="flex gap-2.5">
                  <InfoIcon
                    aria-hidden
                    className="mt-px size-4 shrink-0 text-primary-text-strong"
                    strokeWidth={2}
                  />
                  <div>
                    <div className="mb-1.5 font-medium text-primary-text text-sm">
                      {m.clients_esn_card_title()}
                    </div>
                    <div className="text-foreground-4 text-sm leading-relaxed">
                      {m.clients_esn_card_before()}{" "}
                      <strong className="font-medium text-foreground-2">
                        {m.clients_esn_card_strong()}
                      </strong>
                      {m.clients_esn_card_after()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-md border bg-card px-5 py-4">
              <div className={cn(EYEBROW_CLASSES, "mb-3")}>
                {m.clients_todo_title()}
              </div>
              <div className="flex flex-col gap-3">
                {[
                  m.clients_create_submit(),
                  m.clients_todo_step_mission(),
                  m.clients_todo_step_grid(),
                ].map((step, index) => (
                  <div className="flex items-start gap-2.5" key={step}>
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                        index === 0
                          ? "border-primary/45 bg-primary/15 text-primary-text"
                          : "border-border-3 text-muted-foreground-3",
                      )}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        index === 0
                          ? "text-foreground-3"
                          : "text-muted-foreground-3",
                      )}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </form.Subscribe>
    </div>
  );
}
