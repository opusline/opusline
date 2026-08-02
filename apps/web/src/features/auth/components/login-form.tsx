import { zLoginData } from "@opusline/api-client/zod";
import { Button } from "@opusline/ui/components/button";
import { Checkbox } from "@opusline/ui/components/checkbox";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import * as z from "zod/mini";

const loginSchema = z.extend(zLoginData, { remember: z.boolean() });

type LoginFormProps = {
  onSubmit: (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => Promise<Record<string, { message: string }> | null | undefined> | void;
  isPending?: boolean;
  error?: string | null;
};

export function LoginForm({ onSubmit, isPending, error }: LoginFormProps) {
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
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <form.Field name="email">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Adresse e-mail</FieldLabel>
              <Input
                aria-invalid={isInvalid}
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
              <FieldLabel htmlFor={field.name}>Mot de passe</FieldLabel>
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
            <FieldLabel
              className="font-normal text-xs text-muted-foreground"
              htmlFor={field.name}
            >
              Rester connecté 30 jours
            </FieldLabel>
          </Field>
        )}
      </form.Field>
      <Button className="mt-1 h-9 w-full" disabled={isPending} type="submit">
        Se connecter
      </Button>
    </form>
  );
}
