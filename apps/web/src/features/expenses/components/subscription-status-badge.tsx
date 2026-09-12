import type { SubscriptionData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import {
  subscriptionStatus,
  subscriptionStatusPresentation,
} from "../lib/subscriptions";

type SubscriptionStatusBadgeProps = {
  subscription: SubscriptionData;
  /** The table prints the cancellation date under the pill, the card beside it. */
  layout?: "stacked" | "inline";
};

/** A pill only when there is something to say: an active subscription shows none. */
export function SubscriptionStatusBadge({
  subscription,
  layout = "stacked",
}: SubscriptionStatusBadgeProps) {
  const dateFormat = useDateFormat();
  const status = subscriptionStatus(subscription);

  if (status === "active") {
    return null;
  }

  const presentation = subscriptionStatusPresentation(status);
  const since =
    subscription.cancelledOn === null
      ? null
      : m.subscriptions_cancelled_on({
          date: calendarDateNumericLabel(dateFormat, subscription.cancelledOn),
        });

  return (
    <div
      className={layout === "inline" ? "flex items-center gap-2" : "min-w-0"}
    >
      <Badge shape="pill" variant={presentation.variant}>
        {presentation.label}
      </Badge>
      {since !== null && (
        <div className="mt-0.75 whitespace-nowrap text-muted-foreground-3 text-xs">
          {since}
        </div>
      )}
    </div>
  );
}
