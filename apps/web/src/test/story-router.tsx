import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import type * as React from "react";

/**
 * A memory router around a story, so components rendering `<Link>` work
 * outside the app. Story-only helper — it needs no story of its own.
 */
export function StoryRouter({ children }: { children: React.ReactNode }) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => children }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return <RouterProvider router={router} />;
}
