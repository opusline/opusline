import { zUpdateUserPasswordData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { CircleAlert, CircleCheck } from "lucide-react";
import { useState } from "react";
import * as z from "zod/mini";

import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";
import { SettingsSection } from "./settings-section";

const passwordSchema = zUpdateUserPasswordData.check(
  z.refine((values) => values.password === values.password_confirmation, {
    error: () => m.auth_passwords_mismatch(),
    path: ["password_confirmation"],
  }),
);

type PasswordValues = z.infer<typeof zUpdateUserPasswordData>;

type PasswordCardProps = {
  isPending: boolean;
  error: string | null;
  onSubmit: (values: PasswordValues) => Promise<FormSubmitResult>;
};

export function PasswordCard({
  isPending,
  error,
  onSubmit,
}: PasswordCardProps) {
  const [hasChanged, setHasChanged] = useState(false);

  const form = useForm({
    defaultValues: { password: "", password_confirmation: "" },
    validators: {
      onSubmit: passwordSchema,
      onSubmitAsync: async ({ value }) => {
        setHasChanged(false);
        const result = await onSubmit(value);

        if (result.status === "invalid") {
          return { fields: result.fieldErrors };
        }

        if (result.status === "success") {
          setHasChanged(true);
          form.reset();
        }

        return null;
      },
    },
  });

  return (
    <SettingsSection
      description={m.security_password_description()}
      title={m.security_password_title()}
    >
      {error === null ? null : (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {hasChanged ? (
        <Alert className="mb-3.5" variant="success">
          <CircleCheck />
          <AlertDescription>{m.security_password_changed()}</AlertDescription>
        </Alert>
      ) : null}

      <form
        className="flex max-w-sm flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="new-password">
                  {m.security_password_new_label()}
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="new-password"
                  id="new-password"
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  type="password"
                  value={field.state.value}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <form.Field name="password_confirmation">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="new-password-confirmation">
                  {m.auth_password_confirm_label()}
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="new-password"
                  id="new-password-confirmation"
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  type="password"
                  value={field.state.value}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
        <div>
          <Button disabled={isPending} size="lg" type="submit">
            {m.security_password_submit()}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
