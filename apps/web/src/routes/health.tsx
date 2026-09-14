import { getPingOptions } from "@opusline/api-client/react-query";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ApiStatus } from "@/features/health/components/api-status";
import { SentryTestError } from "@/features/health/components/sentry-test-error";
import { m } from "@/paraglide/messages.js";

export const Route = createFileRoute("/health")({
  component: HealthPage,
});

/**
 * No loader on purpose. This is the page a self-hoster opens when something is
 * wrong, and a loader that awaits the ping hands the screen to the error
 * boundary in exactly that case — leaving the diagnosis blank. The query lives
 * in the component so a refused ping is a state the page can draw.
 */
function HealthPage() {
  // And no retry: the answer wanted here is the one the API gives right now,
  // not the one it gives after seven seconds of backoff.
  const ping = useQuery({ ...getPingOptions(), retry: false });

  return (
    <div className="flex flex-col gap-6 p-8">
      {ping.isPending ? (
        <p className="text-muted-foreground">{m.common_loading()}</p>
      ) : (
        <ApiStatus status={ping.isError ? null : ping.data.status} />
      )}
      {ping.data?.sentry ? <SentryTestError /> : null}
    </div>
  );
}
