import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import type { FormSubmitResult } from "@/lib/form";
import { EmailCard } from "./email-card";

function renderCard(
  onSubmit: () => Promise<FormSubmitResult> = async () => ({
    status: "success",
  }),
) {
  const submit = vi.fn(onSubmit);

  render(
    <EmailCard
      currentEmail="theo@example.com"
      error={null}
      isPending={false}
      onSubmit={submit}
    />,
  );

  return submit;
}

function fillAndSubmit(email: string) {
  fireEvent.change(screen.getByLabelText("Nouvelle adresse e-mail"), {
    target: { value: email },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Changer l'adresse e-mail" }),
  );
}

it("names the address the account signs in with", () => {
  renderCard();

  expect(
    screen.getByText(/vous vous connectez avec theo@example\.com/i),
  ).toBeInTheDocument();
});

it("sends the new address and says what changing it did", async () => {
  const submit = renderCard();

  fillAndSubmit("theo@nordlys.example");

  expect(
    await screen.findByText(/vos navigateurs de confiance sont oubliés/i),
  ).toBeInTheDocument();
  expect(submit).toHaveBeenCalledWith({ email: "theo@nordlys.example" });
  expect(screen.getByLabelText("Nouvelle adresse e-mail")).toHaveValue("");
});

it("refuses a malformed address before asking the API", async () => {
  const submit = renderCard();

  fireEvent.change(screen.getByLabelText("Nouvelle adresse e-mail"), {
    target: { value: "pas-une-adresse" },
  });
  // A click would stop at the browser's own type="email" check.
  fireEvent.submit(
    screen.getByRole("button", { name: "Changer l'adresse e-mail" }),
  );

  expect(
    await screen.findByText("Adresse e-mail invalide."),
  ).toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});

it.each([
  [
    "an address with capitals",
    "Theo@Nordlys.example",
    "Écrivez l'adresse en minuscules.",
  ],
  [
    "the address already in use",
    "theo@example.com",
    "C'est déjà l'adresse avec laquelle vous vous connectez.",
  ],
])("refuses %s before asking the API", async (_case, email, message) => {
  const submit = renderCard();

  fillAndSubmit(email);

  expect(await screen.findByText(message)).toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
});

it("drops the confirmation as soon as another change is attempted", async () => {
  renderCard();
  fillAndSubmit("theo@nordlys.example");
  await screen.findByText(/vos navigateurs de confiance sont oubliés/i);

  fillAndSubmit("theo@example.com");

  await waitFor(() =>
    expect(
      screen.queryByText(/vos navigateurs de confiance sont oubliés/i),
    ).not.toBeInTheDocument(),
  );
});

it("shows the API's reason next to the field it refused", async () => {
  renderCard(async () => ({
    status: "invalid",
    fieldErrors: { email: { message: "Cette adresse est déjà utilisée." } },
  }));

  fillAndSubmit("theo@nordlys.example");

  await waitFor(() =>
    expect(
      screen.getByText("Cette adresse est déjà utilisée."),
    ).toBeInTheDocument(),
  );
  expect(
    screen.queryByText(/vos navigateurs de confiance sont oubliés/i),
  ).not.toBeInTheDocument();
});
