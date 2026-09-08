import { Button } from "@opusline/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import * as z from "zod/mini";

import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";

const PASSKEY_NAME_MAX = 100;

const passkeyNameSchema = z.object({
  name: z
    .string()
    .check(
      z.minLength(1, { error: () => m.zod_field_required() }),
      z.maxLength(PASSKEY_NAME_MAX),
    ),
});

type PasskeyNameDialogProps = {
  open: boolean;
  title: string;
  initialName: string;
  isPending: boolean;
  onSubmit: (name: string) => Promise<FormSubmitResult>;
  onCancel: () => void;
};

/** Names a passkey: the one just created, or one being renamed. */
export function PasskeyNameDialog({
  open,
  title,
  initialName,
  isPending,
  onSubmit,
  onCancel,
}: PasskeyNameDialogProps) {
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
        {open ? (
          <PasskeyNameForm
            initialName={initialName}
            isPending={isPending}
            onSubmit={onSubmit}
            title={title}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function PasskeyNameForm({
  title,
  initialName,
  isPending,
  onSubmit,
}: Omit<PasskeyNameDialogProps, "open" | "onCancel">) {
  const form = useForm({
    defaultValues: { name: initialName },
    validators: {
      onSubmit: passkeyNameSchema,
      onSubmitAsync: async ({ value }) => {
        const result = await onSubmit(value.name.trim());

        return result.status === "invalid"
          ? { fields: result.fieldErrors }
          : null;
      },
    },
  });

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <DialogHeader>
        <DialogTitle size="lg">{title}</DialogTitle>
      </DialogHeader>
      <form.Field name="name">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                {m.security_passkey_name_label()}
              </FieldLabel>
              <Input
                aria-invalid={isInvalid}
                autoFocus
                id={field.name}
                maxLength={PASSKEY_NAME_MAX}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                onFocus={(event) => event.currentTarget.select()}
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
        <Button disabled={isPending} size="2xl" type="submit">
          {m.common_save()}
        </Button>
      </DialogFooter>
    </form>
  );
}
