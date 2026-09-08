import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { usePasswordConfirmation } from "./use-password-confirmation";

function Harness({ action }: { action: () => Promise<string> }) {
  const { guarded, dialog } = usePasswordConfirmation();

  return (
    <>
      <button
        onClick={() => {
          guarded(action)
            .then((outcome) => {
              document.title =
                outcome.status === "done"
                  ? `done:${outcome.value}`
                  : "cancelled";
            })
            .catch(() => {
              document.title = "rejected";
            });
        }}
        type="button"
      >
        Run
      </button>
      {dialog}
    </>
  );
}

function renderHarness(action: () => Promise<string>) {
  document.title = "";

  render(
    <QueryClientProvider client={new QueryClient()}>
      <Harness action={action} />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

it("runs the action once when the window is already open", async () => {
  const action = vi.fn().mockResolvedValue("ok");
  renderHarness(action);

  fireEvent.click(screen.getByRole("button", { name: "Run" }));

  await waitFor(() => expect(document.title).toBe("done:ok"));
  expect(action).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("asks for the password on a 423 and retries the action once confirmed", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
  );
  const action = vi
    .fn()
    .mockRejectedValueOnce({ status: 423, message: "Confirmez." })
    .mockResolvedValueOnce("ok");
  renderHarness(action);

  fireEvent.click(screen.getByRole("button", { name: "Run" }));

  const dialog = await screen.findByRole("dialog");
  expect(dialog).toHaveTextContent("Confirmez votre mot de passe");

  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value: "secret-password" },
  });
  fireEvent.submit(screen.getByRole("button", { name: "Confirmer" }));

  await waitFor(() => expect(document.title).toBe("done:ok"));
  expect(action).toHaveBeenCalledTimes(2);
});

it("reports a cancellation when the dialog is closed", async () => {
  const action = vi.fn().mockRejectedValue({ status: 423 });
  renderHarness(action);

  fireEvent.click(screen.getByRole("button", { name: "Run" }));
  await screen.findByRole("dialog");

  fireEvent.keyDown(document.activeElement ?? document.body, {
    key: "Escape",
  });

  await waitFor(() => expect(document.title).toBe("cancelled"));
  expect(action).toHaveBeenCalledTimes(1);
});

it("passes any other failure through untouched", async () => {
  const action = vi.fn().mockRejectedValue({ status: 409, message: "Non." });
  renderHarness(action);

  fireEvent.click(screen.getByRole("button", { name: "Run" }));

  await waitFor(() => expect(document.title).toBe("rejected"));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
