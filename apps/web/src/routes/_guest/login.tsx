import type { TwoFactorChallengeData, UserData } from "@opusline/api-client";
import {
  answerTwoFactorChallengeMutation,
  currentUserQueryKey,
  loginMutation,
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
import { serverFieldErrors } from "@/lib/validation";
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
  trustDevice: boolean;
};

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const queryClient = useQueryClient();

  const login = useMutation(loginMutation());
  const answerChallenge = useMutation(answerTwoFactorChallengeMutation());

  // The pending login lives in the server session; this only remembers that
  // the password step is done, and forgets it when the server does.
  const [challenge, setChallenge] = useState<TwoFactorChallengeData | null>(
    null,
  );
  const [challengeError, setChallengeError] = useState<string | null>(null);
  const [passwordStepNotice, setPasswordStepNotice] = useState<string | null>(
    null,
  );

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

  const answer = async (body: ChallengeAnswer): Promise<ChallengeOutcome> => {
    setChallengeError(null);

    try {
      await signIn(await answerChallenge.mutateAsync({ body }));
      return { status: "success" };
    } catch (error) {
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
        error={passwordStepNotice ?? loginError}
        isPending={login.isPending}
        onSubmit={handleSubmit}
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
