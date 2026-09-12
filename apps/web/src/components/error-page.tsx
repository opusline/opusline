import { Button } from "@opusline/ui/components/button";
import {
  type ErrorComponentProps,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { m } from "@/paraglide/messages.js";
import { FallbackCard } from "./fallback-card";

/**
 * The router's defaultErrorComponent: what a route shows when its loader or
 * its render threw. Reporting happened in the React root handlers already.
 * Retry resets the boundary and re-runs the loaders, so a failed loader gets
 * a second chance rather than a re-render of the same error.
 */
export function ErrorPage({ reset }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-96 items-center justify-center px-4 py-12">
      <FallbackCard hint={m.error_hint()} title={m.error_title()}>
        <Button
          onClick={() => {
            reset();
            void router.invalidate();
          }}
        >
          {m.error_retry()}
        </Button>
        <Button render={<Link to="/week" />} variant="outline">
          {m.error_home()}
        </Button>
      </FallbackCard>
    </div>
  );
}
