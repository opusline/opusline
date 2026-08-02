import {
  currentUserQueryKey,
  registerMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";
import { serverFieldErrors } from "@/lib/validation";

export const Route = createFileRoute("/_guest/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const register = useMutation(registerMutation());

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      const user = await register.mutateAsync({ body: values });
      queryClient.setQueryData(currentUserQueryKey(), user);
      await navigate({ to: "/dashboard" });
      return null;
    } catch (error) {
      return serverFieldErrors(error);
    }
  };

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
          register.error && !serverFieldErrors(register.error)
            ? "L'inscription a échoué. Réessayez."
            : null
        }
        isPending={register.isPending}
        onSubmit={handleSubmit}
      />
    </AuthCard>
  );
}
