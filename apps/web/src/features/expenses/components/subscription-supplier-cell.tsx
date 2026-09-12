import type { SubscriptionData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { ExternalLinkIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

import { expenseCategoryLabel } from "../lib/labels";

export function SubscriptionSupplierCell({
  subscription,
}: {
  subscription: SubscriptionData;
}) {
  return (
    <div className="min-w-0">
      <div className="flex min-w-0 items-center gap-1.75">
        <span className="truncate text-foreground-hi text-sm">
          {subscription.supplier}
        </span>
        {subscription.customerSpaceUrl !== null && (
          <a
            aria-label={m.subscriptions_open_customer_space()}
            className="inline-flex shrink-0 rounded-xs text-muted-foreground-4 transition-colors hover:text-primary-text focus-visible:outline-2 focus-visible:outline-primary-text"
            href={subscription.customerSpaceUrl}
            rel="noreferrer"
            target="_blank"
            title={m.subscriptions_open_customer_space()}
          >
            <ExternalLinkIcon aria-hidden className="size-3" />
          </a>
        )}
        {subscription.proShareBp < 10_000 && (
          <Badge className="font-mono" variant="brand">
            {m.expenses_pro_share({ share: subscription.proShareBp / 100 })}
          </Badge>
        )}
      </div>
      <div className="mt-1 flex min-w-0 items-center gap-1.5">
        <Badge className="shrink-0" variant="quiet">
          {expenseCategoryLabel(subscription.category)}
        </Badge>
        {subscription.description !== null && (
          <span className="truncate text-muted-foreground-3 text-xs">
            {subscription.description}
          </span>
        )}
      </div>
    </div>
  );
}
