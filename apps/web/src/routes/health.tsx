import { getPingOptions } from "@opusline/api-client/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ApiStatus } from "@/features/health/components/api-status";

export const Route = createFileRoute("/health")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getPingOptions()),
  component: HealthPage,
});

function HealthPage() {
  const { data: ping } = useSuspenseQuery(getPingOptions());

  return (
    <div className="p-8">
      <ApiStatus status={ping.status} />
    </div>
  );
}
