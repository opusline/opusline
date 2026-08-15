import { currentUserOptions } from "@opusline/api-client/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: user } = useSuspenseQuery(currentUserOptions());

  return (
    <div>
      <h1 className="font-heading font-semibold text-2xl text-card-foreground">
        {m.dashboard_greeting({ name: user.name })}
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">
        {m.dashboard_placeholder()}
      </p>
    </div>
  );
}
