import { Skeleton } from "@opusline/ui/components/skeleton";

/**
 * What a route shows while its chunk or data is still on the wire — the
 * router's defaultPendingComponent, so navigation paints a sketch of a page
 * instead of holding the previous one frozen.
 */
export function RoutePending() {
  return (
    <div aria-busy className="mx-auto flex w-full max-w-6xl flex-col gap-4 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
