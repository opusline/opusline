import { zUpdateUserEmailData } from "@opusline/api-client/zod";
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

type EmailValues = z.infer<typeof zUpdateUserEmailData>;

/**
 * The API asks for the password before it validates, so the two refusals the
 * generated schema cannot express are caught here rather than after the dialog.
 */
function newEmailSchema(currentEmail: string) {
  return zUpdateUserEmailData.check(
    z.refine((values) => values.email === values.email.toLowerCase(), {
      error: () => m.security_email_lowercase(),
      path: ["email"],
    }),
    z.refine((values) => values.email !== currentEmail, {
      error: () => m.security_email_unchanged(),
      path: ["email"],
    }),
  );
}

type EmailCardProps = {
  currentEmail: string;
  isPending: boolean;
  error: string | null;
  onSubmit: (values: EmailValues) => Promise<FormSubmitResult>;
};

export function EmailCard({
  currentEmail,
  isPending,
  error,
  onSubmit,
}: EmailCardProps) {
  const [hasChanged, setHasChanged] = useState(false);

  const form = useForm({
    defaultValues: { email: "" },
    validators: {
      onSubmit: newEmailSchema(currentEmail),
      onSubmitAsync: async ({ value }) => {
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
      description={m.security_email_description({ email: currentEmail })}
      title={m.security_email_title()}
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
          <AlertDescription>{m.security_email_changed()}</AlertDescription>
        </Alert>
      ) : null}

      <form
        className="flex max-w-sm flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setHasChanged(false);
          void form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="new-email">
                  {m.security_email_new_label()}
                </FieldLabel>
                <Input
                  aria-invalid={isInvalid}
                  autoComplete="email"
                  data-testid="settings-new-email"
                  id="new-email"
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
        <div>
          <Button
            data-testid="settings-change-email"
            disabled={isPending}
            size="lg"
            type="submit"
          >
            {m.security_email_submit()}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
