import { createFileRoute } from "@tanstack/react-router";

import { pingApi } from "@/features/health/api";
import { ApiStatus } from "@/features/health/components/api-status";

export const Route = createFileRoute("/health")({
  loader: () => pingApi(),
  component: HealthPage,
});

function HealthPage() {
  const ping = Route.useLoaderData();

  return (
    <div className="p-8">
      <ApiStatus status={ping.status} />
    </div>
  );
}
