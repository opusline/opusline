import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import type * as React from "react";

/**
 * A memory router around a subject, so components rendering `<Link>` work
 * outside the app. Used by stories and by component tests; a helper with no
 * visual surface of its own, so it needs no story.
 */
export function StoryRouter({ children }: { children: React.ReactNode }) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => children }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return <RouterProvider router={router} />;
}
