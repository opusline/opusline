import type { SubscriptionData } from "@opusline/api-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@opusline/ui/components/alert-dialog";
import { Button } from "@opusline/ui/components/button";

import { m } from "@/paraglide/messages.js";

type DeleteSubscriptionDialogProps = {
  /** The subscription up for deletion; null keeps the dialog closed. */
  subscription: SubscriptionData | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (subscription: SubscriptionData) => void;
};

export function DeleteSubscriptionDialog({
  subscription,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteSubscriptionDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={subscription !== null}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{m.subscriptions_delete_title()}</AlertDialogTitle>
          <AlertDialogDescription>
            {subscription !== null &&
              m.subscriptions_delete_body({ supplier: subscription.supplier })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {m.common_cancel()}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={() => {
              if (subscription !== null) {
                onConfirm(subscription);
              }
            }}
            render={<Button size="2xl" variant="destructive" />}
          >
            {m.subscriptions_delete_confirm()}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
