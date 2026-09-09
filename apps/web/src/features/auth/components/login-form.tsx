import { zLoginData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Checkbox } from "@opusline/ui/components/checkbox";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { Separator } from "@opusline/ui/components/separator";
import { useForm } from "@tanstack/react-form";
import { CircleAlert, Fingerprint } from "lucide-react";
import * as z from "zod/mini";

import { m } from "@/paraglide/messages.js";

const loginSchema = z.extend(zLoginData, { remember: z.boolean() });

type LoginFormProps = {
  onSubmit: (values: {
    email: string;
    password: string;
    remember: boolean;
  }) =>
    | Promise<Record<string, { message: string }> | null | undefined>
    | undefined;
  isPending?: boolean;
  error?: string | null;
  /** Present when this browser can sign in with a passkey instead of the password. */
  passkey?: {
    onSignIn: (remember: boolean) => void;
    isPending: boolean;
  };
};

export function LoginForm({
  onSubmit,
  isPending,
  error,
  passkey,
}: LoginFormProps) {
  const form = useForm({
    defaultValues: { email: "", password: "", remember: false },
    validators: {
      onSubmit: loginSchema,
      onSubmitAsync: async ({ value }) => {
        const fieldErrors = await onSubmit(value);
        return fieldErrors ? { fields: fieldErrors } : null;
      },
    },
  });

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
                autoComplete="username webauthn"
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
      <form.Field name="password">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                {m.auth_password_label()}
              </FieldLabel>
              <Input
                aria-invalid={isInvalid}
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
      <form.Field name="remember">
        {(field) => (
          <Field orientation="horizontal">
            <Checkbox
              checked={field.state.value}
              id={field.name}
              onCheckedChange={(checked) => field.handleChange(checked)}
            />
            <FieldLabel htmlFor={field.name}>
              {m.auth_remember_label()}
            </FieldLabel>
          </Field>
        )}
      </form.Field>
      <Button
        className="mt-1 w-full"
        disabled={isPending}
        size="2xl"
        type="submit"
      >
        {m.auth_login_submit()}
      </Button>
      {passkey ? (
        <form.Subscribe selector={(state) => state.values.remember}>
          {(remember) => (
            <>
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-muted-foreground-3 text-xs">
                  {m.auth_or()}
                </span>
                <Separator className="flex-1" />
              </div>
              <Button
                className="w-full"
                disabled={isPending || passkey.isPending}
                onClick={() => passkey.onSignIn(remember)}
                size="2xl"
                type="button"
                variant="outline"
              >
                <Fingerprint data-icon="inline-start" />
                {m.auth_passkey_sign_in()}
              </Button>
            </>
          )}
        </form.Subscribe>
      ) : null}
    </form>
  );
}
