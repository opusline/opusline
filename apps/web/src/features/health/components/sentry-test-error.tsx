import { Button } from "@opusline/ui/components/button";

import { m } from "@/paraglide/messages.js";

/**
 * Thrown from the click handler on purpose: nothing in the app catches an
 * event-handler error, so it reaches Sentry through the SDK's global handlers,
 * the same road a real crash takes.
 */
function throwTestError(): never {
  const failure = new Error(
    "Sent on purpose from /health to check that the browser reports to Sentry",
  );
  failure.name = "SentryTestError";
  throw failure;
}

export function SentryTestError() {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-muted-foreground-3 text-sm">
        {m.health_sentry_test_hint()}
      </p>
      <Button onClick={throwTestError} variant="outline">
        {m.health_sentry_test_button()}
      </Button>
    </div>
  );
}
