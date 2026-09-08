import { confirmPasswordMutation } from "@opusline/api-client/react-query";
import { zConfirmPasswordData } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";
import * as z from "zod/mini";

import { serverFieldErrors, writeErrorBanner } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

const confirmPasswordSchema = z.extend(zConfirmPasswordData, {
  password: z
    .string()
    .check(z.minLength(1, { error: () => m.zod_field_required() })),
});

type ConfirmPasswordDialogProps = {
  open: boolean;
  onConfirmed: () => void;
  onCancel: () => void;
};

/** Asks for the password the API wants before a security-sensitive change. */
export function ConfirmPasswordDialog({
  open,
  onConfirmed,
  onCancel,
}: ConfirmPasswordDialogProps) {
  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onCancel();
        }
      }}
      open={open}
    >
      <DialogContent size="lg">
        {open ? <ConfirmPasswordForm onConfirmed={onConfirmed} /> : null}
      </DialogContent>
    </Dialog>
  );
}

function ConfirmPasswordForm({ onConfirmed }: { onConfirmed: () => void }) {
  const confirmPassword = useMutation(confirmPasswordMutation());

  const form = useForm({
    defaultValues: { password: "" },
    validators: {
      onSubmit: confirmPasswordSchema,
      onSubmitAsync: async ({ value }) => {
        try {
          await confirmPassword.mutateAsync({ body: value });
          onConfirmed();
          return null;
        } catch (error) {
          const fieldErrors = serverFieldErrors(error);
          return fieldErrors ? { fields: fieldErrors } : null;
        }
      },
    },
  });

  const banner = writeErrorBanner(
    confirmPassword.error,
    m.security_confirm_password_failed(),
  );

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <DialogHeader className="gap-2">
        <DialogTitle size="lg">
          {m.security_confirm_password_title()}
        </DialogTitle>
        <DialogDescription size="lg">
          {m.security_confirm_password_description()}
        </DialogDescription>
      </DialogHeader>
      {banner === null ? null : (
        <Alert variant="warn">
          <CircleAlert />
          <AlertDescription>{banner}</AlertDescription>
        </Alert>
      )}
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
                autoComplete="current-password"
                autoFocus
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
      <DialogFooter layout="inline">
        <Button disabled={confirmPassword.isPending} size="2xl" type="submit">
          {m.security_confirm_password_submit()}
        </Button>
      </DialogFooter>
    </form>
  );
}
