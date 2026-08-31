import { currentUserOptions } from "@opusline/api-client/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_guest")({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient
      .ensureQueryData({ ...currentUserOptions(), retry: false })
      .catch(() => null);

    if (user) {
      throw redirect({ to: "/week" });
    }
  },
  component: () => <Outlet />,
});
