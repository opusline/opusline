import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { SessionLock } from "./session-lock";

const BASE_PROPS = {
  error: null,
  isPending: false,
  onSignOut: () => {},
  onUnlock: async () => null,
  reason: "inactivity" as const,
};

it("sends the typed password to the unlock", async () => {
  const onUnlock = vi.fn(async () => null);
  render(<SessionLock {...BASE_PROPS} onUnlock={onUnlock} />);

  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value: "secret-password" },
  });
  fireEvent.submit(screen.getByRole("button", { name: /déverrouiller/i }));

  await waitFor(() => expect(onUnlock).toHaveBeenCalledWith("secret-password"));
});

it("puts a refused password on the field instead of unlocking", async () => {
  render(
    <SessionLock
      {...BASE_PROPS}
      onUnlock={async () => "Le mot de passe est incorrect."}
    />,
  );

  fireEvent.change(screen.getByLabelText(/^mot de passe$/i), {
    target: { value: "wrong" },
  });
  fireEvent.submit(screen.getByRole("button", { name: /déverrouiller/i }));

  expect(
    await screen.findByText(/le mot de passe est incorrect/i),
  ).toBeInTheDocument();
});

it("does not call the unlock with an empty password", async () => {
  const onUnlock = vi.fn(async () => null);
  render(<SessionLock {...BASE_PROPS} onUnlock={onUnlock} />);

  fireEvent.submit(screen.getByRole("button", { name: /déverrouiller/i }));

  expect(await screen.findByText(/ce champ est requis/i)).toBeInTheDocument();
  expect(onUnlock).not.toHaveBeenCalled();
});

it("names what raised the lock", () => {
  const { rerender } = render(<SessionLock {...BASE_PROPS} />);
  expect(screen.getByRole("dialog")).toHaveAccessibleName(/verrouillé/i);

  rerender(<SessionLock {...BASE_PROPS} reason="expired" />);
  expect(screen.getByRole("dialog")).toHaveAccessibleName(/session expirée/i);
});

it("offers a way out that is not the password", () => {
  const onSignOut = vi.fn();
  render(<SessionLock {...BASE_PROPS} onSignOut={onSignOut} />);

  fireEvent.click(
    screen.getByRole("button", { name: /se déconnecter complètement/i }),
  );

  expect(onSignOut).toHaveBeenCalledTimes(1);
});
