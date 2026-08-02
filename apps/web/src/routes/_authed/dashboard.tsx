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
      <h1 className="font-bold text-2xl">Welcome, {user.name}</h1>
      <p className="mt-2 text-sm">{user.email}</p>
      <button
        className="mt-6 rounded border px-4 py-2 disabled:opacity-50"
        disabled={logout.isPending}
        onClick={() => logout.mutate({})}
        type="button"
      >
        Log out
      </button>
    </div>
  );
}
