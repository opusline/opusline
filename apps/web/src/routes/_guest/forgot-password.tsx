import {
  getPingOptions,
  requestPasswordResetMutation,
} from "@opusline/api-client/react-query";
import { linkVariants } from "@opusline/ui/components/text-link";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { serverFieldErrors, writeErrorBanner } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_guest/forgot-password")({
  beforeLoad: async ({ context }) => {
    const ping = await context.queryClient
      .ensureQueryData(getPingOptions())
      .catch(() => null);

    // An instance without a mailer has no reset to offer: the login page
    // hides the link, and a typed URL lands back there.
    if (ping?.mailEnabled === false) {
      throw redirect({ to: "/login" });
    }
  },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const requestReset = useMutation(requestPasswordResetMutation());

  const handleSubmit = async (values: { email: string }) => {
    try {
      await requestReset.mutateAsync({ body: values });
      return null;
    } catch (error) {
      return serverFieldErrors(error);
    }
  };

  return (
    <AuthCard
      description={m.auth_forgot_description()}
      footer={
        <Link className={linkVariants({ underline: "always" })} to="/login">
          {m.auth_back_to_login()}
        </Link>
      }
      title={m.auth_forgot_title()}
    >
      <ForgotPasswordForm
        error={writeErrorBanner(requestReset.error, m.auth_forgot_failed())}
        isPending={requestReset.isPending}
        isSent={requestReset.isSuccess}
        onSubmit={handleSubmit}
      />
    </AuthCard>
  );
}
