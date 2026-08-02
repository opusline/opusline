import {
  currentUserQueryKey,
  registerMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const register = useMutation({
    ...registerMutation(),
    onSuccess: async (user) => {
      queryClient.setQueryData(currentUserQueryKey(), user);
      await navigate({ to: "/dashboard" });
    },
  });

  return (
    <AuthCard
      footer={
        <>
          Déjà un compte ?{" "}
          <Link className="text-primary hover:underline" to="/login">
            Se connecter
          </Link>
        </>
      }
      title="Créer un compte"
    >
      <RegisterForm
        error={
          register.error
            ? "L'inscription a échoué. Vérifiez vos informations."
            : null
        }
        isPending={register.isPending}
        onSubmit={(values) => register.mutate({ body: values })}
      />
    </AuthCard>
  );
}
