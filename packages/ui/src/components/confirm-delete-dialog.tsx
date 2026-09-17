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

type ConfirmDeleteDialogProps = {
  open: boolean;
  title: string;
  /** What goes, named the way the screen names it, so the click is informed. */
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function ConfirmDeleteDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isDeleting,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-testid="confirm-delete-cancel"
            disabled={isDeleting}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            data-testid="confirm-delete-submit"
            disabled={isDeleting}
            onClick={onConfirm}
            render={<Button size="2xl" variant="destructive" />}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
