import {
  currentUserQueryKey,
  registerMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";
import { serverFieldErrors } from "@/lib/validation";
import { m } from "@/paraglide/messages.js";

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
      await navigate({ to: "/week" });
      return null;
    } catch (error) {
      return serverFieldErrors(error);
    }
  };

  return (
    <AuthCard
      footer={
        <>
          {m.auth_have_account()}{" "}
          <Link className="text-primary hover:underline" to="/login">
            {m.auth_login_submit()}
          </Link>
        </>
      }
      title={m.auth_create_account()}
    >
      <RegisterForm
        error={
          register.error && !serverFieldErrors(register.error)
            ? m.auth_register_failed()
            : null
        }
        isPending={register.isPending}
        onSubmit={handleSubmit}
      />
    </AuthCard>
  );
}
