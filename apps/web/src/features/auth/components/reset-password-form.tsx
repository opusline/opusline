import { zResetPasswordData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { CircleAlert, CircleCheck } from "lucide-react";
import * as z from "zod/mini";

import type { FieldErrorMap } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

// The token and the address travel in the emailed link; the form only owns
// the two fields the user types.
const newPasswordFields = z.pick(zResetPasswordData, {
  password: true,
  password_confirmation: true,
});

const newPasswordSchema = newPasswordFields.check(
  z.refine((values) => values.password === values.password_confirmation, {
    error: () => m.auth_passwords_mismatch(),
    path: ["password_confirmation"],
  }),
);

type NewPasswordValues = z.infer<typeof newPasswordFields>;

type ResetPasswordFormProps = {
  onSubmit: (
    values: NewPasswordValues,
  ) => Promise<FieldErrorMap | null | undefined> | undefined;
  isPending?: boolean;
  error?: string | null;
  isDone?: boolean;
};

export function ResetPasswordForm({
  onSubmit,
  isPending,
  error,
  isDone,
}: ResetPasswordFormProps) {
  const form = useForm({
    defaultValues: { password: "", password_confirmation: "" },
    validators: {
      onSubmit: newPasswordSchema,
      onSubmitAsync: async ({ value }) => {
        const fieldErrors = await onSubmit(value);
        return fieldErrors ? { fields: fieldErrors } : null;
      },
    },
  });

  if (isDone) {
    return (
      <Alert data-testid="reset-password-done" variant="success">
        <CircleCheck />
        <AlertDescription>{m.auth_reset_done()}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      {error ? (
        <Alert data-testid="reset-password-error" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <form.Field name="password">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                {m.security_password_new_label()}
              </FieldLabel>
              <Input
                aria-invalid={isInvalid}
                autoComplete="new-password"
                data-testid="reset-password-new"
                id={field.name}
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
              <FieldLabel htmlFor={field.name}>
                {m.auth_password_confirm_label()}
              </FieldLabel>
              <Input
                aria-invalid={isInvalid}
                autoComplete="new-password"
                data-testid="reset-password-confirmation"
                id={field.name}
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
      <Button
        className="mt-1 w-full"
        data-testid="reset-password-submit"
        disabled={isPending}
        size="2xl"
        type="submit"
      >
        {m.auth_reset_submit()}
      </Button>
    </form>
  );
}
