import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";
import { setupApiClient } from "@/lib/api";
import "@/lib/zod";
import "@/lib/i18n";
import { getRouter } from "./router";

setupApiClient();

const router = getRouter();

const rootElement = document.getElementById("app")!;

// A marker rather than an emptiness check: #app ships with the static shell
// from index.html, which React replaces on mount.
if (!rootElement.dataset.mounted) {
  rootElement.dataset.mounted = "true";
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
