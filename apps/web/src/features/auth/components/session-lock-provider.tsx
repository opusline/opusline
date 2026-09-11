import type { UserData } from "@opusline/api-client";
import {
  confirmPasswordMutation,
  currentUserQueryKey,
  loginMutation,
  logoutMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";

import { INACTIVITY_LOCK_MS, onSessionExpired } from "@/lib/session-lock";
import {
  serverErrorMessage,
  serverFieldErrors,
  serverStatus,
} from "@/lib/validation";
import { m } from "@/paraglide/messages.js";
import { isTwoFactorChallenge } from "../lib/two-factor";
import { useIdleTimeout } from "../lib/use-idle-timeout";
import { SessionLock, type SessionLockReason } from "./session-lock";

type SessionLockProviderProps = {
  children: ReactNode;
  /** What the app knows is still going while the screen is covered. */
  status?: ReactNode;
};

/**
 * Locks the app after a stretch of inactivity, and when the API answers that
 * the session is gone.
 *
 * The lock covers the app instead of redirecting to /login so that unlocking
 * puts back the page that was there — the router, the open drawer and the
 * running timer all survive it.
 */
export function SessionLockProvider({
  children,
  status,
}: SessionLockProviderProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const href = useRouterState({ select: (state) => state.location.href });

  const [reason, setReason] = useState<SessionLockReason | null>(null);
  const [error, setError] = useState<string | null>(null);

  const confirmPassword = useMutation(confirmPasswordMutation());
  const login = useMutation(loginMutation());
  const logout = useMutation(logoutMutation());

  useIdleTimeout(INACTIVITY_LOCK_MS, reason === null, () =>
    setReason("inactivity"),
  );

  useEffect(
    () =>
      onSessionExpired(() => {
        // Only lock a session the app still believes in: the 401 that greets a
        // signed-out visitor has to stay the redirect to /login it is today.
        if (queryClient.getQueryData(currentUserQueryKey()) === undefined) {
          return;
        }

        // An expiry under an already-locked screen changes nothing the user can
        // act on, and the unlock below signs back in either way.
        setReason((locked) => locked ?? "expired");
      }),
    [queryClient],
  );

  const resume = () => {
    setReason(null);
    setError(null);
    // Half an hour of anything is enough to have moved the figures on screen.
    void queryClient.invalidateQueries();
  };

  const signInAgain = async (password: string): Promise<string | null> => {
    const user = queryClient.getQueryData<UserData>(currentUserQueryKey());

    if (user === undefined) {
      await navigate({ to: "/login", search: { redirect: href } });
      return null;
    }

    try {
      const result = await login.mutateAsync({
        body: { email: user.email, password, remember: false },
      });

      if (isTwoFactorChallenge(result)) {
        setError(m.session_lock_needs_login());
        await navigate({ to: "/login", search: { redirect: href } });
        return null;
      }

      queryClient.setQueryData(currentUserQueryKey(), result);
      resume();
      return null;
    } catch (caught) {
      const fieldError = serverFieldErrors(caught)?.password;

      if (fieldError !== undefined) {
        return fieldError.message;
      }

      setError(serverErrorMessage(caught, m.session_lock_failed()));
      return null;
    }
  };

  const unlock = async (password: string): Promise<string | null> => {
    setError(null);

    try {
      await confirmPassword.mutateAsync({ body: { password } });
      resume();
      return null;
    } catch (caught) {
      const fieldError = serverFieldErrors(caught)?.password;

      if (fieldError !== undefined) {
        return fieldError.message;
      }

      if (serverStatus(caught) !== 401) {
        setError(serverErrorMessage(caught, m.session_lock_failed()));
        return null;
      }
    }

    // 401 on the cheap check: the session really is gone, so the same password
    // has to buy a new one rather than confirm the old.
    return signInAgain(password);
  };

  const signOut = async () => {
    try {
      await logout.mutateAsync({});
    } catch {
      // A session that is already gone cannot be logged out of, and the point
      // of the button is to end up signed out either way.
    }

    queryClient.clear();
    await navigate({ to: "/login" });
  };

  return (
    <>
      {children}
      {reason !== null && (
        <SessionLock
          error={error}
          isPending={confirmPassword.isPending || login.isPending}
          onSignOut={() => void signOut()}
          onUnlock={unlock}
          reason={reason}
          status={status}
        />
      )}
    </>
  );
}
