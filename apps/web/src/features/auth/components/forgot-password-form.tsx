import { zRequestPasswordResetData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { CircleAlert, CircleCheck } from "lucide-react";

import type { FieldErrorMap } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type ForgotPasswordFormProps = {
  onSubmit: (values: {
    email: string;
  }) => Promise<FieldErrorMap | null | undefined> | undefined;
  isPending?: boolean;
  error?: string | null;
  /**
   * The request was accepted. Says nothing about the address: the API answers
   * the same whether or not it belongs to an account.
   */
  isSent?: boolean;
};

export function ForgotPasswordForm({
  onSubmit,
  isPending,
  error,
  isSent,
}: ForgotPasswordFormProps) {
  const form = useForm({
    defaultValues: { email: "" },
    validators: {
      onSubmit: zRequestPasswordResetData,
      onSubmitAsync: async ({ value }) => {
        const fieldErrors = await onSubmit(value);
        return fieldErrors ? { fields: fieldErrors } : null;
      },
    },
  });

  if (isSent) {
    return (
      <Alert data-testid="forgot-password-sent" variant="success">
        <CircleCheck />
        <AlertDescription>{m.auth_forgot_sent()}</AlertDescription>
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
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <form.Field name="email">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                {m.auth_email_label()}
              </FieldLabel>
              <Input
                aria-invalid={isInvalid}
                autoComplete="username"
                data-testid="forgot-password-email"
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
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
      <Button
        className="mt-1 w-full"
        data-testid="forgot-password-submit"
        disabled={isPending}
        size="2xl"
        type="submit"
      >
        {m.auth_forgot_submit()}
      </Button>
    </form>
  );
}
