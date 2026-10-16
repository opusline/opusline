import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@opusline/ui/components/alert-dialog";
import { Button } from "@opusline/ui/components/button";

import { m } from "@/paraglide/messages.js";

type IntegrationRemoveButtonProps = {
  label: string;
  confirmTitle: string;
  confirmBody: string;
  isRemoving: boolean;
  onRemove: () => void;
  /** The trigger's id; the confirming action takes `${testId}-confirm`. */
  testId: string;
};

/** Forgetting a third-party credential: destructive, so confirmed in a dialog. */
export function IntegrationRemoveButton({
  label,
  confirmTitle,
  confirmBody,
  isRemoving,
  onRemove,
  testId,
}: IntegrationRemoveButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            data-testid={testId}
            disabled={isRemoving}
            size="lg"
            variant="destructive"
          />
        }
      >
        {label}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{confirmBody}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{m.common_cancel()}</AlertDialogCancel>
          <AlertDialogAction
            data-testid={`${testId}-confirm`}
            onClick={onRemove}
            render={<Button size="2xl" variant="destructive" />}
          >
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
