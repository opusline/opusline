import {
  currentUserQueryKey,
  loginMutation,
} from "@opusline/api-client/react-query";
import { Button } from "@opusline/ui/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";
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

function LoginPage() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const queryClient = useQueryClient();

  const login = useMutation(loginMutation());

  const handleSubmit = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    try {
      const user = await login.mutateAsync({ body: values });
      queryClient.setQueryData(currentUserQueryKey(), user);
      await navigate({ to: redirect ?? "/dashboard" });
      return null;
    } catch (error) {
      return serverFieldErrors(error);
    }
  };

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
        error={
          login.error && !serverFieldErrors(login.error)
            ? m.auth_login_failed()
            : null
        }
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
