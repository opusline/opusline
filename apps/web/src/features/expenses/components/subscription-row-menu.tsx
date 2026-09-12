import type { SubscriptionData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import { cn } from "@opusline/ui/lib/utils";
import { ExternalLinkIcon, MoreVerticalIcon } from "lucide-react";

import { m } from "@/paraglide/messages.js";

export type SubscriptionRowMenuHandlers = {
  onEdit: (subscription: SubscriptionData) => void;
  onChangeAmount: (subscription: SubscriptionData) => void;
  onPause: (subscription: SubscriptionData) => void;
  onResume: (subscription: SubscriptionData) => void;
  onToggleProvision: (subscription: SubscriptionData) => void;
  onCancel: (subscription: SubscriptionData) => void;
  onReactivate: (subscription: SubscriptionData) => void;
  onDelete: (subscription: SubscriptionData) => void;
};

type SubscriptionRowMenuProps = SubscriptionRowMenuHandlers & {
  subscription: SubscriptionData;
  className?: string;
};

export function SubscriptionRowMenu({
  subscription,
  className,
  onEdit,
  onChangeAmount,
  onPause,
  onResume,
  onToggleProvision,
  onCancel,
  onReactivate,
  onDelete,
}: SubscriptionRowMenuProps) {
  const isCancelled = subscription.cancelledOn !== null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={m.expenses_row_menu_aria({
              supplier: subscription.supplier,
            })}
            className={cn(
              "text-muted-foreground-3 opacity-0 transition-opacity pointer-coarse:opacity-100 focus-visible:opacity-100 data-popup-open:opacity-100 group-hover/row:opacity-100",
              className,
            )}
            size="icon-sm"
            variant="ghost"
          />
        }
      >
        <MoreVerticalIcon aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-58">
        <DropdownMenuItem onClick={() => onEdit(subscription)}>
          {m.subscriptions_menu_edit()}
        </DropdownMenuItem>
        {!isCancelled && (
          <>
            {subscription.isPaused ? (
              <DropdownMenuItem onClick={() => onResume(subscription)}>
                {m.subscriptions_menu_resume()}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onPause(subscription)}>
                {m.subscriptions_menu_pause()}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onChangeAmount(subscription)}>
              {m.subscriptions_menu_change_amount()}
            </DropdownMenuItem>
            {subscription.periodicity === 2 && (
              <DropdownMenuItem onClick={() => onToggleProvision(subscription)}>
                {subscription.provisionMonthly
                  ? m.subscriptions_menu_unprovision()
                  : m.subscriptions_provision()}
              </DropdownMenuItem>
            )}
          </>
        )}
        {isCancelled ? (
          <DropdownMenuItem onClick={() => onReactivate(subscription)}>
            {m.subscriptions_menu_reactivate()}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onCancel(subscription)}>
            {m.subscriptions_menu_cancel()}
          </DropdownMenuItem>
        )}
        {subscription.customerSpaceUrl !== null && (
          <DropdownMenuItem
            render={
              <a
                href={subscription.customerSpaceUrl}
                rel="noreferrer"
                target="_blank"
              />
            }
          >
            {m.subscriptions_open_customer_space()}
            <ExternalLinkIcon aria-hidden className="ml-auto" />
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(subscription)}
          variant="destructive"
        >
          {m.subscriptions_menu_delete()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
