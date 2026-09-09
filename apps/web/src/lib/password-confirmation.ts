import { serverStatus } from "./validation";

/** The API answers 423 to a security-sensitive write until the password is confirmed. */
export function isPasswordConfirmationRequired(error: unknown): boolean {
  return serverStatus(error) === 423;
}

export type GuardedOutcome<T> =
  | { status: "done"; value: T }
  | { status: "cancelled" };

/**
 * Runs a password-gated call, asking for the password and retrying once when
 * the API wants it. A closed dialog is an outcome, not an error: the caller
 * simply has nothing to show.
 */
export type PasswordGuard = <T>(
  action: () => Promise<T>,
) => Promise<GuardedOutcome<T>>;
