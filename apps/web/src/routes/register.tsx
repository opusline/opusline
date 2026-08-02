import {
  currentUserQueryKey,
  registerMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

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
    <RegisterForm
      error={register.error ? "Registration failed. Check your details." : null}
      isPending={register.isPending}
      onSubmit={(values) => register.mutate({ body: values })}
    />
  );
}
