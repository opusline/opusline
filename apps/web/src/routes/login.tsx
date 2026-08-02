import {
  currentUserQueryKey,
  loginMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";
import { serverFieldErrors } from "@/lib/validation";

export const Route = createFileRoute("/login")({
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
          Pas encore de compte ?{" "}
          <Link className="text-primary hover:underline" to="/register">
            Créer un compte
          </Link>
        </>
      }
      title="Connexion"
    >
      <LoginForm
        error={
          login.error && !serverFieldErrors(login.error)
            ? "Identifiants invalides."
            : null
        }
        isPending={login.isPending}
        onSubmit={handleSubmit}
      />
    </AuthCard>
  );
}
