import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { EmailNotificationsCard } from "./email-notifications-card";

function renderCard(
  overrides: Partial<Parameters<typeof EmailNotificationsCard>[0]> = {},
) {
  const onChange = vi.fn();

  render(
    <EmailNotificationsCard
      error={null}
      isMailEnabled
      isSaving={false}
      onChange={onChange}
      preferences={{ securityAlerts: true, deadlineReminders: true }}
      {...overrides}
    />,
  );

  return onChange;
}

it("saves both preferences when one switch is flipped", () => {
  const onChange = renderCard();

  fireEvent.click(
    screen.getByRole("switch", {
      name: m.notifications_deadline_reminders_label(),
    }),
  );

  expect(onChange).toHaveBeenCalledWith({
    securityAlerts: true,
    deadlineReminders: false,
  });
});

it("says so when the instance sends no email", () => {
  renderCard({ isMailEnabled: false });

  expect(screen.getByText(m.notifications_mail_disabled())).toBeVisible();
});

it("stays silent about the mailer on an instance that has one", () => {
  renderCard();

  expect(screen.queryByText(m.notifications_mail_disabled())).toBeNull();
});

it("ignores a flip while a save is in flight", () => {
  const onChange = renderCard({ isSaving: true });

  fireEvent.click(
    screen.getByRole("switch", {
      name: m.notifications_security_alerts_label(),
    }),
  );

  expect(onChange).not.toHaveBeenCalled();
});
