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
import { Input } from "@opusline/ui/components/input";
import { Swatch, SwatchGroup } from "@opusline/ui/components/swatch";
import { Textarea } from "@opusline/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import { CircleAlert, PencilIcon } from "lucide-react";

import {
  CLIENT_TYPE_LABELS,
  CLIENT_TYPES,
  COLOR_CLASSES,
  COLOR_LABELS,
  COLORS,
} from "../lib/labels";
import { PaymentTermsPicker } from "./payment-terms-picker";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";
const EDIT_LABEL_CLASSES = "text-muted-foreground-3 text-xs";

type ClientEditFormValues = {
  name: string;
  type: ClientType;
  siret: string;
  vatNumber: string;
  billingAddress: string;
  billingContactName: string;
  billingEmail: string;
  color: Color;
  paymentTermsDays: number;
};

function valueOrNull(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

function toUpdateClientBody(values: ClientEditFormValues): UpdateClientData {
  return {
    name: values.name.trim(),
    type: values.type,
    siret: valueOrNull(values.siret),
    vatNumber: valueOrNull(values.vatNumber),
    billingAddress: valueOrNull(values.billingAddress),
    billingContactName: valueOrNull(values.billingContactName),
    billingEmail: valueOrNull(values.billingEmail),
    color: values.color,
    paymentTermsDays: values.paymentTermsDays,
  };
}

type ClientEditFormProps = {
  client: ClientWithMissionsData;
  onSubmit: (
    body: UpdateClientData,
  ) => Promise<Record<string, { message: string }> | null | undefined>;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
};

export function ClientEditForm({
  client,
  onSubmit,
  onCancel,
  isPending,
  error,
}: ClientEditFormProps) {
  const form = useForm({
    defaultValues: {
      name: client.name,
      type: client.type,
      siret: client.siret ?? "",
      vatNumber: client.vatNumber ?? "",
      billingAddress: client.billingAddress ?? "",
      billingContactName: client.billingContactName ?? "",
      billingEmail: client.billingEmail ?? "",
      color: client.color,
      paymentTermsDays: client.paymentTermsDays,
    } as ClientEditFormValues,
    validators: {
      onSubmitAsync: async ({ value }) => {
        const fieldErrors = await onSubmit(toUpdateClientBody(value));

        return fieldErrors ? { fields: fieldErrors } : null;
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
        <span className="text-foreground-hi text-sm">Modifier le client</span>
        <span className="flex-1" />
        <span className="text-muted-foreground-3 text-xs">
          Les factures émises gardent les anciennes coordonnées
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
          <div className={`${EYEBROW_CLASSES} mb-4`}>Identité</div>
          <div className="flex flex-col gap-3.5">
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className={EDIT_LABEL_CLASSES}
                      htmlFor={field.name}
                    >
                      Raison sociale
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="type">
              {(field) => (
                <Field>
                  <FieldLabel
                    className={EDIT_LABEL_CLASSES}
                    htmlFor={`${field.name}-options`}
                  >
                    Type de relation
                  </FieldLabel>
                  <ChipGroup
                    aria-label="Type de relation"
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
                        {CLIENT_TYPE_LABELS[clientType]}
                      </Chip>
                    ))}
                  </ChipGroup>
                </Field>
              )}
            </form.Field>

            <form.Field name="color">
              {(field) => (
                <Field>
                  <div className="flex items-baseline gap-2">
                    <FieldLabel
                      className={EDIT_LABEL_CLASSES}
                      htmlFor={`${field.name}-swatches`}
                    >
                      Couleur
                    </FieldLabel>
                    <span className="text-muted-foreground-5 text-xs">
                      {COLOR_LABELS[field.state.value]}
                    </span>
                  </div>
                  <SwatchGroup
                    aria-label="Couleur"
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
                        aria-label={COLOR_LABELS[color]}
                        className={COLOR_CLASSES[color]}
                        title={COLOR_LABELS[color]}
                        value={String(color)}
                      />
                    ))}
                  </SwatchGroup>
                </Field>
              )}
            </form.Field>

            <form.Field name="siret">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className={EDIT_LABEL_CLASSES}
                      htmlFor={field.name}
                    >
                      SIRET
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      font="mono"
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="vatNumber">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className={EDIT_LABEL_CLASSES}
                      htmlFor={field.name}
                    >
                      TVA intracom.
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      font="mono"
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="billingAddress">
              {(field) => (
                <Field>
                  <FieldLabel
                    className={EDIT_LABEL_CLASSES}
                    htmlFor={field.name}
                  >
                    Adresse
                  </FieldLabel>
                  <Textarea
                    className="min-h-18"
                    id={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        </div>

        <div className="rounded-md border bg-card p-5">
          <div className={`${EYEBROW_CLASSES} mb-4`}>Facturation</div>
          <div className="flex flex-col gap-3.5">
            <form.Field name="billingContactName">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className={EDIT_LABEL_CLASSES}
                      htmlFor={field.name}
                    >
                      Contact
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="billingEmail">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      className={EDIT_LABEL_CLASSES}
                      htmlFor={field.name}
                    >
                      Email
                    </FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      type="email"
                      value={field.state.value}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="paymentTermsDays">
              {(field) => (
                <Field>
                  <FieldLabel
                    className={EDIT_LABEL_CLASSES}
                    htmlFor={`${field.name}-options`}
                  >
                    Délai de paiement
                  </FieldLabel>
                  <PaymentTermsPicker
                    id={`${field.name}-options`}
                    onChange={field.handleChange}
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t pt-4">
        <Button disabled={isPending} size="xl" type="submit">
          Enregistrer
        </Button>
        <Button
          disabled={isPending}
          onClick={onCancel}
          size="xl"
          type="button"
          variant="ghost"
        >
          Annuler
        </Button>
      </div>
    </form>
  );
}
