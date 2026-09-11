import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Field, FieldError, FieldLabel } from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import { useForm } from "@tanstack/react-form";
import { LockIcon } from "lucide-react";
import type { ReactNode } from "react";
import * as z from "zod/mini";

import { m } from "@/paraglide/messages.js";

const unlockSchema = z.object({
  password: z
    .string()
    .check(z.minLength(1, { error: () => m.zod_field_required() })),
});

export type SessionLockReason = "inactivity" | "expired";

type SessionLockProps = {
  /** What raised the lock, which is the only thing the two states say differently. */
  reason: SessionLockReason;
  /**
   * What the app knows is still going — the running timer, when there is one.
   * The node carries its own box: only what fills the slot knows whether it has
   * anything to say, and an empty frame is worse than none.
   */
  status?: ReactNode;
  error: string | null;
  isPending: boolean;
  onUnlock: (password: string) => Promise<string | null>;
  onSignOut: () => void;
};

/**
 * The screen between a locked session and the work behind it.
 *
 * It covers the app rather than replacing it: the router keeps its state, the
 * drawer keeps what was open, and unlocking puts the same page back rather than
 * a fresh /week. That is the whole reason this exists instead of a redirect.
 */
export function SessionLock({
  reason,
  status,
  error,
  isPending,
  onUnlock,
  onSignOut,
}: SessionLockProps) {
  const form = useForm({
    defaultValues: { password: "" },
    validators: {
      onSubmit: unlockSchema,
      onSubmitAsync: async ({ value }) => {
        const failure = await onUnlock(value.password);

        return failure === null
          ? null
          : { fields: { password: { message: failure } } };
      },
    },
  });

  return (
    // Not a Dialog: a dialog can be dismissed, and this one cannot be. aria-modal
    // with a heading gives assistive tech the same containment without the escape.
    <div
      aria-labelledby="session-lock-title"
      aria-modal="true"
      className="fixed inset-0 z-100 flex items-center justify-center bg-overlay p-6 supports-backdrop-filter:backdrop-blur-sm"
      role="dialog"
    >
      <div className="w-full max-w-100 rounded-xl border bg-popover p-6 shadow-lg">
        <div className="flex items-center gap-2.5">
          <LockIcon aria-hidden className="size-4 text-muted-foreground-3" />
          <h2
            className="font-heading font-semibold text-foreground-hi text-xl"
            id="session-lock-title"
          >
            {reason === "expired"
              ? m.session_lock_expired_title()
              : m.session_lock_title()}
          </h2>
        </div>

        <p className="mt-2 text-muted-foreground-3 text-sm leading-relaxed">
          {reason === "expired"
            ? m.session_lock_expired_body()
            : m.session_lock_body()}
        </p>

        {status}

        <form
          className="mt-5 flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
        >
          <form.Field name="password">
            {(field) => (
              <Field data-invalid={!field.state.meta.isValid}>
                <FieldLabel htmlFor="session-lock-password">
                  {m.auth_password_label()}
                </FieldLabel>
                <Input
                  // The lock appears without being asked for, so it takes the
                  // focus: whoever comes back is here to type a password.
                  autoFocus
                  aria-invalid={!field.state.meta.isValid}
                  autoComplete="current-password"
                  id="session-lock-password"
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  type="password"
                  value={field.state.value}
                />
                {field.state.meta.isValid ? null : (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>

          {error !== null && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button disabled={isPending} size="2xl" type="submit">
            {m.session_lock_unlock()}
          </Button>
        </form>

        <Button
          className="mt-1 w-full"
          onClick={onSignOut}
          size="xl"
          type="button"
          variant="ghost"
        >
          {m.session_lock_sign_out()}
        </Button>
      </div>
    </div>
  );
}
