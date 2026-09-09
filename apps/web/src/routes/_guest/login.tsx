import type { TwoFactorChallengeData, UserData } from "@opusline/api-client";
import {
  answerTwoFactorChallengeMutation,
  currentUserQueryKey,
  loginMutation,
  loginWithPasskeyMutation,
  passkeyLoginOptionsMutation,
  twoFactorPasskeyOptionsMutation,
} from "@opusline/api-client/react-query";
import { Button } from "@opusline/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";
import {
  type ChallengeOutcome,
  TwoFactorChallenge,
} from "@/features/auth/components/two-factor-challenge";
import {
  classifyChallengeError,
  isTwoFactorChallenge,
} from "@/features/auth/lib/two-factor";
import {
  assertPasskey,
  isWebAuthnSupported,
  webAuthnFailure,
} from "@/features/auth/lib/webauthn";
import { serverErrorMessage, serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

/*
 * DatabaseSeeder's account, so working on a screen does not start by typing
 * credentials. Vite drops this and the button below from a production build; the
 * credentials are the ones apps/api/database/seeders publishes anyway. English on
 * purpose — it is never shipped.
 */
const DEMO_ACCOUNT = {
  email: "test@example.com",
  password: "password",
  remember: false,
};

export const Route = createFileRoute("/_guest/login")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginPage,
});

type ChallengeAnswer = {
  code?: string;
  recoveryCode?: string;
  passkey?: string;
  trustDevice: boolean;
};

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const queryClient = useQueryClient();

  const login = useMutation(loginMutation());
  const answerChallenge = useMutation(answerTwoFactorChallengeMutation());
  const passkeyLoginOptions = useMutation(passkeyLoginOptionsMutation());
  const loginWithPasskey = useMutation(loginWithPasskeyMutation());
  const challengePasskeyOptions = useMutation(
    twoFactorPasskeyOptionsMutation(),
  );

  // The pending login lives in the server session; this only remembers that
  // the password step is done, and forgets it when the server does.
  const [challenge, setChallenge] = useState<TwoFactorChallengeData | null>(
    null,
  );
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [passwordStepNotice, setPasswordStepNotice] = useState<string | null>(
    null,
  );
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  const signIn = async (user: UserData) => {
    queryClient.setQueryData(currentUserQueryKey(), user);
    await navigate({ to: redirect ?? "/week" });
  };

  const handleSubmit = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    setPasswordStepNotice(null);
    setPasskeyError(null);

    try {
      const result = await login.mutateAsync({ body: values });

      if (isTwoFactorChallenge(result)) {
        setChallengeError(null);
        setChallenge(result);
        return null;
      }

      await signIn(result);
      return null;
    } catch (error) {
      return serverFieldErrors(error);
    }
  };

  const failChallenge = (error: unknown): ChallengeOutcome => {
    const failure = classifyChallengeError(error);

    switch (failure.status) {
      case "invalid":
        return { status: "invalid", message: failure.message };
      case "expired":
        setChallenge(null);
        setPasswordStepNotice(failure.message);
        return { status: "failed" };
      case "throttled":
        setChallengeError(failure.message);
        return { status: "failed" };
      default:
        setChallengeError(m.auth_two_factor_failed());
        return { status: "failed" };
    }
  };

  const answer = async (body: ChallengeAnswer): Promise<ChallengeOutcome> => {
    setChallengeError(null);

    try {
      await signIn(await answerChallenge.mutateAsync({ body }));
      return { status: "success" };
    } catch (error) {
      return failChallenge(error);
    }
  };

  const answerWithPasskey = async (
    trustDevice: boolean,
  ): Promise<ChallengeOutcome> => {
    setChallengeError(null);

    let credential: string;

    try {
      const { options } = await challengePasskeyOptions.mutateAsync({});
      credential = JSON.stringify(await assertPasskey(options));
    } catch (error) {
      const failure = webAuthnFailure(error);

      if (failure === "cancelled") {
        return { status: "failed" };
      }

      return failure === null
        ? failChallenge(error)
        : { status: "invalid", message: m.auth_passkey_failed() };
    }

    return answer({ passkey: credential, trustDevice });
  };

  const signInWithPasskey = async (remember: boolean) => {
    setPasswordStepNotice(null);
    setPasskeyError(null);

    try {
      const { options } = await passkeyLoginOptions.mutateAsync({});
      const credential = JSON.stringify(await assertPasskey(options));
      await signIn(
        await loginWithPasskey.mutateAsync({
          body: { credential, remember },
        }),
      );
    } catch (error) {
      const failure = webAuthnFailure(error);

      if (failure === "cancelled") {
        return;
      }

      setPasskeyError(
        failure === null
          ? serverErrorMessage(error, m.auth_passkey_failed())
          : m.auth_passkey_failed(),
      );
    }
  };

  const leaveChallenge = () => {
    setChallenge(null);
    setChallengeError(null);
  };

  if (challenge !== null) {
    return (
      <AuthCard title={m.auth_two_factor_title()}>
        <TwoFactorChallenge
          error={challengeError}
          isPending={answerChallenge.isPending}
          methods={challenge.methods}
          onBack={leaveChallenge}
          onSubmitCode={(code, trustDevice) => answer({ code, trustDevice })}
          onSubmitRecoveryCode={(recoveryCode, trustDevice) =>
            answer({ recoveryCode, trustDevice })
          }
          onUsePasskey={isWebAuthnSupported() ? answerWithPasskey : undefined}
        />
      </AuthCard>
    );
  }

  const loginError =
    login.error && !serverFieldErrors(login.error)
      ? m.auth_login_failed()
      : null;

  return (
    <AuthCard
      footer={
        <>
          {m.auth_no_account()}{" "}
          <Link className="text-primary hover:underline" to="/register">
            {m.auth_create_account()}
          </Link>
        </>
      }
      title={m.auth_login_title()}
    >
      <LoginForm
        error={passkeyError ?? passwordStepNotice ?? loginError}
        isPending={login.isPending}
        onSubmit={handleSubmit}
        passkey={
          isWebAuthnSupported()
            ? {
                onSignIn: (remember) => void signInWithPasskey(remember),
                isPending:
                  passkeyLoginOptions.isPending || loginWithPasskey.isPending,
              }
            : undefined
        }
      />
      {import.meta.env.DEV && (
        <Button
          className="mt-4 w-full"
          onClick={() => void handleSubmit(DEMO_ACCOUNT)}
          variant="outline"
        >
          Sign in as the seeded demo account
        </Button>
      )}
    </AuthCard>
  );
}
