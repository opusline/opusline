import {
  currentUserQueryKey,
  loginMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

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

  const login = useMutation({
    ...loginMutation(),
    onSuccess: async (user) => {
      queryClient.setQueryData(currentUserQueryKey(), user);
      await navigate({ to: redirect ?? "/dashboard" });
    },
  });

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
        error={login.error ? "Identifiants invalides." : null}
        isPending={login.isPending}
        onSubmit={(values) => login.mutate({ body: values })}
      />
    </AuthCard>
  );
}
