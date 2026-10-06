import { resetPasswordMutation } from "@opusline/api-client/react-query";
import { linkVariants } from "@opusline/ui/components/text-link";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

type ResetPasswordSearch = { token?: string; email?: string };

/*
 * Outside the _guest layout on purpose: that layout sends a signed-in browser
 * to the week, and the emailed link has to work in whichever browser opens it.
 */
export const Route = createFileRoute("/reset-password")({
  validateSearch: (search: Record<string, unknown>): ResetPasswordSearch => ({
    token: typeof search.token === "string" ? search.token : undefined,
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  beforeLoad: ({ search: { token, email } }) => {
    if (token === undefined || email === undefined) {
      throw redirect({ to: "/login" });
    }

    return { resetLink: { token, email } };
  },
  component: ResetPasswordPage,
});

/**
 * The token and the address come from the link, not from a field the user can
 * correct: whatever the server refuses besides the password is the link's.
 */
function linkError(error: unknown): string | null {
  if (error === null) {
    return null;
  }

  const fieldErrors = serverFieldErrors(error);

  if (fieldErrors === null) {
    return m.auth_reset_failed();
  }

  return fieldErrors.password === undefined
    ? m.auth_reset_link_invalid()
    : null;
}

function ResetPasswordPage() {
  const { resetLink } = Route.useRouteContext();
  const resetPassword = useMutation(resetPasswordMutation());

  const handleSubmit = async (values: {
    password: string;
    password_confirmation: string;
  }) => {
    try {
      await resetPassword.mutateAsync({ body: { ...values, ...resetLink } });
      return null;
    } catch (error) {
      const fieldErrors = serverFieldErrors(error);

      return fieldErrors?.password === undefined ? null : fieldErrors;
    }
  };

  return (
    <AuthCard
      description={m.auth_reset_description()}
      footer={
        <Link
          className={linkVariants({ underline: "always" })}
          data-testid="reset-password-sign-in"
          to="/login"
        >
          {m.auth_back_to_login()}
        </Link>
      }
      title={m.auth_reset_title()}
    >
      <ResetPasswordForm
        error={linkError(resetPassword.error)}
        isDone={resetPassword.isSuccess}
        isPending={resetPassword.isPending}
        onSubmit={handleSubmit}
      />
    </AuthCard>
  );
}
