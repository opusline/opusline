import {
  currentUserOptions,
  logoutMutation,
} from "@opusline/api-client/react-query";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(currentUserOptions());

  const logout = useMutation({
    ...logoutMutation(),
    onSuccess: async () => {
      queryClient.clear();
      await navigate({ to: "/login" });
    },
  });

  return (
    <div className="p-8">
      <h1 className="font-heading font-semibold text-[23px] text-card-foreground">
        Bonjour, {user.name}
      </h1>
      <p className="mt-2 text-[13px] text-muted-foreground">{user.email}</p>
      <button
        className="mt-6 h-8 rounded-sm border border-border px-3 text-[13px] text-secondary-foreground transition hover:bg-secondary disabled:opacity-50"
        disabled={logout.isPending}
        onClick={() => logout.mutate({})}
        type="button"
      >
        Se déconnecter
      </button>
    </div>
  );
}
