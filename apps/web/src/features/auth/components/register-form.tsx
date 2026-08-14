import { zRegisterUserData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { CircleAlert } from "lucide-react";
import * as z from "zod/mini";

const registerSchema = zRegisterUserData.check(
  z.refine((values) => values.password === values.password_confirmation, {
    error: "Les mots de passe ne correspondent pas.",
    path: ["password_confirmation"],
  }),
);

type RegisterFormProps = {
  onSubmit: (values: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) =>
    | Promise<Record<string, { message: string }> | null | undefined>
    | undefined;
  isPending?: boolean;
  error?: string | null;
};

export function RegisterForm({
  onSubmit,
  isPending,
  error,
}: RegisterFormProps) {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validators: {
      onSubmit: registerSchema,
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
      <form.Field name="name">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Nom</FieldLabel>
              <Input
                aria-invalid={isInvalid}
                id={field.name}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                value={field.state.value}
              />
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
            </Field>
          );
        }}
      </form.Field>
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
      <form.Field name="password_confirmation">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                Confirmer le mot de passe
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
      <Button
        className="mt-1 w-full"
        disabled={isPending}
        size="2xl"
        type="submit"
      >
        Créer le compte
      </Button>
    </form>
  );
}
