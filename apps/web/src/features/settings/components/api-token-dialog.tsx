import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { CopyButton } from "@opusline/ui/components/copy-button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { TriangleAlert } from "lucide-react";
import * as z from "zod/mini";

import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";

const TOKEN_NAME_MAX = 100;

const tokenNameSchema = z.object({
  name: z
    .string()
    .check(
      z.minLength(1, { error: () => m.zod_field_required() }),
      z.maxLength(TOKEN_NAME_MAX),
    ),
});

type ApiTokenDialogProps = {
  open: boolean;
  /** The secret of the token just created, which turns the dialog into its one-time reveal. */
  createdToken: string | null;
  isPending: boolean;
  onSubmit: (name: string) => Promise<FormSubmitResult>;
  onClose: () => void;
};

/** Names a token, then shows the secret the API answered with — this once. */
export function ApiTokenDialog({
  open,
  createdToken,
  isPending,
  onSubmit,
  onClose,
}: ApiTokenDialogProps) {
  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      open={open}
    >
      <DialogContent size="lg">
        {!open ? null : createdToken === null ? (
          <TokenNameForm isPending={isPending} onSubmit={onSubmit} />
        ) : (
          <TokenReveal onClose={onClose} token={createdToken} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TokenNameForm({
  isPending,
  onSubmit,
}: Pick<ApiTokenDialogProps, "isPending" | "onSubmit">) {
  const form = useForm({
    defaultValues: { name: "" },
    validators: {
      onSubmit: tokenNameSchema,
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
        <DialogTitle size="lg">{m.security_token_name_title()}</DialogTitle>
      </DialogHeader>
      <form.Field name="name">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>
                {m.security_token_name_label()}
              </FieldLabel>
              <Input
                aria-invalid={isInvalid}
                autoFocus
                id={field.name}
                maxLength={TOKEN_NAME_MAX}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                value={field.state.value}
              />
              <FieldDescription>
                {m.security_token_name_hint()}
              </FieldDescription>
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
            </Field>
          );
        }}
      </form.Field>
      <DialogFooter layout="inline">
        <Button disabled={isPending} size="2xl" type="submit">
          {m.security_token_create()}
        </Button>
      </DialogFooter>
    </form>
  );
}

function TokenReveal({
  token,
  onClose,
}: {
  token: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <DialogHeader className="gap-2">
        <DialogTitle size="lg">{m.security_token_created_title()}</DialogTitle>
      </DialogHeader>
      <Alert variant="warn">
        <TriangleAlert />
        <AlertDescription>{m.security_token_once_warning()}</AlertDescription>
      </Alert>
      <div className="flex w-full items-center gap-2 rounded-md border bg-muted px-3 py-2">
        <code
          className="flex-1 break-all font-mono text-foreground-hi text-sm"
          data-testid="api-token-secret"
        >
          {token}
        </code>
        <CopyButton
          aria-label={m.common_copy()}
          copiedLabel={m.common_copied()}
          failedLabel={m.common_copy_failed()}
          size="icon"
          value={token}
        />
      </div>
      <DialogFooter layout="inline">
        <Button onClick={onClose} size="2xl" type="button">
          {m.common_close()}
        </Button>
      </DialogFooter>
    </div>
  );
}
