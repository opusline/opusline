import type { TokenAbility } from "@opusline/api-client";
import { zTokenAbility } from "@opusline/api-client/zod";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Checkbox } from "@opusline/ui/components/checkbox";
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
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { TriangleAlert } from "lucide-react";
import * as z from "zod/mini";

import type { FormSubmitResult } from "@/lib/form";
import { m } from "@/paraglide/messages.js";
import { TOKEN_ABILITIES, tokenAbilityLabel } from "../lib/token-abilities";

const TOKEN_NAME_MAX = 100;

// invoices:read was the only ability tokens once had: it stays ticked, so a
// token made without looking at the list grants what it always did.
const DEFAULT_ABILITIES: TokenAbility[] = ["invoices:read"];

const tokenSchema = z.object({
  name: z
    .string()
    .check(
      z.minLength(1, { error: () => m.zod_field_required() }),
      z.maxLength(TOKEN_NAME_MAX),
    ),
  abilities: z
    .array(zTokenAbility)
    .check(
      z.minLength(1, { error: () => m.security_token_abilities_required() }),
    ),
});

type ApiTokenDialogProps = {
  open: boolean;
  /** The secret of the token just created, which turns the dialog into its one-time reveal. */
  createdToken: string | null;
  isPending: boolean;
  onSubmit: (
    name: string,
    abilities: TokenAbility[],
  ) => Promise<FormSubmitResult>;
  onClose: () => void;
};

/** Names a token and picks what it reads, then shows the secret the API answered with — this once. */
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
          <TokenForm isPending={isPending} onSubmit={onSubmit} />
        ) : (
          <TokenReveal onClose={onClose} token={createdToken} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function TokenForm({
  isPending,
  onSubmit,
}: Pick<ApiTokenDialogProps, "isPending" | "onSubmit">) {
  const form = useForm({
    defaultValues: { name: "", abilities: DEFAULT_ABILITIES },
    validators: {
      onSubmit: tokenSchema,
      onSubmitAsync: async ({ value }) => {
        const result = await onSubmit(value.name.trim(), value.abilities);

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
      <form.Field name="abilities">
        {(field) => {
          const isInvalid = !field.state.meta.isValid;
          const toggle = (ability: TokenAbility, isGranted: boolean) =>
            field.handleChange(
              TOKEN_ABILITIES.filter((candidate) =>
                candidate === ability
                  ? isGranted
                  : field.state.value.includes(candidate),
              ),
            );
          return (
            <FieldSet data-invalid={isInvalid}>
              <FieldLegend variant="label">
                {m.security_token_abilities_label()}
              </FieldLegend>
              <FieldGroup data-slot="checkbox-group">
                {TOKEN_ABILITIES.map((ability) => {
                  const id = `${field.name}-${ability}`;
                  return (
                    <Field key={ability} orientation="horizontal">
                      <Checkbox
                        aria-invalid={isInvalid}
                        checked={field.state.value.includes(ability)}
                        data-ability={ability}
                        data-testid="api-token-ability"
                        id={id}
                        onCheckedChange={(checked) => toggle(ability, checked)}
                      />
                      <FieldLabel htmlFor={id}>
                        {tokenAbilityLabel(ability)}
                      </FieldLabel>
                    </Field>
                  );
                })}
              </FieldGroup>
              {isInvalid ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
            </FieldSet>
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
