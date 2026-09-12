import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { ErrorPage } from "./components/error-page";
import { RoutePending } from "./components/route-pending";
import { reportApiFailure } from "./lib/monitoring";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
    // Once per query after its retries and once per mutation; the 4xx filter
    // lives in reportApiFailure.
    queryCache: new QueryCache({ onError: reportApiFailure }),
    mutationCache: new MutationCache({ onError: reportApiFailure }),
  });

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: RoutePending,
    defaultErrorComponent: ErrorPage,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
