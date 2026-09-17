import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";

/**
 * The footer of every cursor-windowed list: one centered, quiet button that
 * pulls the next page. One home so the paginated lists cannot drift apart.
 */
export function LoadMoreButton({
  label,
  isLoading,
  onClick,
  className,
}: {
  label: string;
  isLoading: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-center", className)}>
      <Button disabled={isLoading} onClick={onClick} size="sm" variant="ghost">
        {label}
      </Button>
    </div>
  );
}
