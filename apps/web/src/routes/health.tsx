import { getPingOptions } from "@opusline/api-client/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ApiStatus } from "@/features/health/components/api-status";
import { SentryTestError } from "@/features/health/components/sentry-test-error";

export const Route = createFileRoute("/health")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getPingOptions()),
  component: HealthPage,
});

function HealthPage() {
  const { data: ping } = useSuspenseQuery(getPingOptions());

  return (
    <div className="flex flex-col gap-6 p-8">
      <ApiStatus status={ping.status} />
      {ping.sentry === null ? null : <SentryTestError />}
    </div>
  );
}
