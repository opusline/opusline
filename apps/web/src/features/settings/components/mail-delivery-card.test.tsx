import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { MailDeliveryCard } from "./mail-delivery-card";

const EMAIL = "theo@studio-lorem.example";

function renderCard(
  overrides: Partial<Parameters<typeof MailDeliveryCard>[0]> = {},
) {
  const onSendTest = vi.fn();

  render(
    <MailDeliveryCard
      email={EMAIL}
      error={null}
      isMailEnabled
      isSending={false}
      isSent={false}
      onSendTest={onSendTest}
      {...overrides}
    />,
  );

  return onSendTest;
}

const testButton = () =>
  screen.queryByRole("button", { name: m.mail_delivery_test_button() });

it("sends the test to the address it names", () => {
  const onSendTest = renderCard();

  expect(
    screen.getByText(m.mail_delivery_test_hint({ email: EMAIL })),
  ).toBeVisible();
  fireEvent.click(testButton() as HTMLElement);

  expect(onSendTest).toHaveBeenCalledOnce();
});

it("explains how to turn mail on, and offers no test, without a mailer", () => {
  renderCard({ isMailEnabled: false });

  expect(screen.getByText(m.mail_delivery_not_configured())).toBeVisible();
  expect(
    screen.getByRole("link", { name: m.mail_delivery_setup_guide() }),
  ).toHaveAttribute("href", expect.stringContaining("self-hosting.md"));
  expect(testButton()).toBeNull();
});

it("says what the two emails will tell once the relay took the first", () => {
  renderCard({ isSent: true });

  expect(screen.getByText(m.mail_delivery_test_sent())).toBeVisible();
});

it("shows the failure as it came back", () => {
  renderCard({ error: "The test email could not be sent: 550" });

  expect(
    screen.getByText("The test email could not be sent: 550"),
  ).toBeVisible();
  expect(screen.queryByText(m.mail_delivery_test_sent())).toBeNull();
});

it("ignores a second click while a test is being sent", () => {
  const onSendTest = renderCard({ isSending: true });

  fireEvent.click(testButton() as HTMLElement);

  expect(onSendTest).not.toHaveBeenCalled();
});
