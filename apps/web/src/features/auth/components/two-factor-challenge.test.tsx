import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { TwoFactorChallenge } from "./two-factor-challenge";

function renderChallenge(
  overrides: Partial<React.ComponentProps<typeof TwoFactorChallenge>> = {},
) {
  const props = {
    methods: [0 as const],
    onSubmitCode: vi.fn().mockResolvedValue({ status: "success" }),
    onSubmitRecoveryCode: vi.fn().mockResolvedValue({ status: "success" }),
    onBack: vi.fn(),
    isPending: false,
    error: null,
    ...overrides,
  };

  render(<TwoFactorChallenge {...props} />);

  return props;
}

function codeInput(): HTMLInputElement {
  return screen.getByLabelText(/code de votre application/i);
}

it("submits the code once as soon as six digits are typed", async () => {
  const { onSubmitCode } = renderChallenge();

  fireEvent.change(codeInput(), { target: { value: "482913" } });

  await waitFor(() =>
    expect(onSubmitCode).toHaveBeenCalledWith("482913", false),
  );
  expect(onSubmitCode).toHaveBeenCalledTimes(1);
});

it("passes the remember choice along with the code", async () => {
  const { onSubmitCode } = renderChallenge();

  fireEvent.click(
    screen.getByRole("checkbox", { name: /se souvenir de ce navigateur/i }),
  );
  fireEvent.change(codeInput(), { target: { value: "482913" } });

  await waitFor(() =>
    expect(onSubmitCode).toHaveBeenCalledWith("482913", true),
  );
});

it("shows a refused code on the field and clears it for another try", async () => {
  renderChallenge({
    onSubmitCode: vi.fn().mockResolvedValue({
      status: "invalid",
      message: "Le code est invalide ou a expiré.",
    }),
  });

  fireEvent.change(codeInput(), { target: { value: "000000" } });

  expect(
    await screen.findByText("Le code est invalide ou a expiré."),
  ).toBeInTheDocument();
  expect(codeInput()).toHaveValue("");
});

it("switches to a recovery code and submits it trimmed", async () => {
  const { onSubmitRecoveryCode, onSubmitCode } = renderChallenge();

  fireEvent.click(
    screen.getByRole("button", { name: /utiliser un code de secours/i }),
  );
  fireEvent.change(screen.getByLabelText(/code de secours/i), {
    target: { value: "  k4F7mQ2pL9-a8Zr3Tn6Wx " },
  });
  fireEvent.submit(screen.getByRole("button", { name: /^vérifier$/i }));

  await waitFor(() =>
    expect(onSubmitRecoveryCode).toHaveBeenCalledWith(
      "k4F7mQ2pL9-a8Zr3Tn6Wx",
      false,
    ),
  );
  expect(onSubmitCode).not.toHaveBeenCalled();
});

it("offers the way back to the password step", () => {
  const { onBack } = renderChallenge();

  fireEvent.click(
    screen.getByRole("button", { name: /utiliser un autre compte/i }),
  );

  expect(onBack).toHaveBeenCalledTimes(1);
});

it("shows the banner error", () => {
  renderChallenge({ error: "Trop de tentatives." });

  expect(screen.getByRole("alert")).toHaveTextContent("Trop de tentatives.");
});
