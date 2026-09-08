import { type ReactNode, useCallback, useRef, useState } from "react";

import {
  type GuardedOutcome,
  isPasswordConfirmationRequired,
  type PasswordGuard,
} from "@/lib/password-confirmation";
import { ConfirmPasswordDialog } from "../components/confirm-password-dialog";

type PendingConfirmation = {
  settle: (confirmed: boolean) => void;
};

/**
 * The password gate as a hook: `guarded` wraps a security-sensitive call and
 * `dialog` is the prompt to render once. The server owns the confirmation
 * window, so nothing here guesses whether one is still open.
 */
export function usePasswordConfirmation(): {
  guarded: PasswordGuard;
  dialog: ReactNode;
} {
  const [isOpen, setIsOpen] = useState(false);
  const pending = useRef<PendingConfirmation | null>(null);

  const settle = (confirmed: boolean) => {
    const confirmation = pending.current;
    pending.current = null;
    setIsOpen(false);
    confirmation?.settle(confirmed);
  };

  const guarded = useCallback(
    async <T,>(action: () => Promise<T>): Promise<GuardedOutcome<T>> => {
      try {
        return { status: "done", value: await action() };
      } catch (error) {
        if (!isPasswordConfirmationRequired(error)) {
          throw error;
        }
      }

      const confirmed = await new Promise<boolean>((resolve) => {
        pending.current = { settle: resolve };
        setIsOpen(true);
      });

      if (!confirmed) {
        return { status: "cancelled" };
      }

      return { status: "done", value: await action() };
    },
    [],
  );

  const dialog = (
    <ConfirmPasswordDialog
      onCancel={() => settle(false)}
      onConfirmed={() => settle(true)}
      open={isOpen}
    />
  );

  return { guarded, dialog };
}
