import { zRegisterUserData } from "@opusline/api-client/zod";
import { Button } from "@opusline/ui/components/button";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
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
  }) => Promise<Record<string, { message: string }> | null | undefined> | void;
  isPending?: boolean;
  error?: string | null;
};

const fields = [
  { name: "name", label: "Nom", type: "text" },
  { name: "email", label: "Adresse e-mail", type: "email" },
  { name: "password", label: "Mot de passe", type: "password" },
  {
    name: "password_confirmation",
    label: "Confirmer le mot de passe",
    type: "password",
  },
] as const;

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
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {fields.map(({ name, label, type }) => (
        <form.Field key={name} name={name}>
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  id={field.name}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  type={type}
                  value={field.state.value}
                />
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : null}
              </Field>
            );
          }}
        </form.Field>
      ))}
      <Button className="mt-1 h-9 w-full" disabled={isPending} type="submit">
        Créer le compte
      </Button>
    </form>
  );
}
