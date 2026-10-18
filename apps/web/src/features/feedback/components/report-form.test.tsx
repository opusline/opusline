import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { ReportForm } from "./report-form";

const context = {
  route: "/invoicing/invoices/12",
  browser: "Firefox 144 on Linux",
  locale: "fr-FR",
};

function fillReport() {
  fireEvent.change(screen.getByLabelText(m.report_title_label()), {
    target: { value: "The preview is cut on the right" },
  });
  fireEvent.change(screen.getByLabelText(m.report_body_label_bug()), {
    target: { value: "At 1280 px the totals column is hidden." },
  });
}

it("sends the report with the context the account agreed to share", async () => {
  const onSubmit = vi.fn();
  render(<ReportForm context={context} onSubmit={onSubmit} />);

  fillReport();
  fireEvent.click(screen.getByRole("button", { name: m.report_submit() }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith({
      kind: 0,
      title: "The preview is cut on the right",
      body: "At 1280 px the totals column is hidden.",
      context,
    }),
  );
});

it("leaves the context out once the account unticks it", async () => {
  const onSubmit = vi.fn();
  render(<ReportForm context={context} onSubmit={onSubmit} />);

  fillReport();
  fireEvent.click(
    screen.getByRole("checkbox", { name: m.report_share_context() }),
  );
  fireEvent.click(screen.getByRole("button", { name: m.report_submit() }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ context: null }),
    ),
  );
  expect(screen.queryByText(context.route)).toBeNull();
});

it("asks what would help when the report is an idea", async () => {
  const onSubmit = vi.fn();
  render(<ReportForm context={context} onSubmit={onSubmit} />);

  fireEvent.click(
    screen.getByRole("button", { name: m.report_kind_feature() }),
  );

  expect(screen.getByLabelText(m.report_body_label_feature())).toBeVisible();
});

it("does not send a title too short to describe anything", async () => {
  const onSubmit = vi.fn();
  render(<ReportForm context={context} onSubmit={onSubmit} />);

  fillReport();
  fireEvent.change(screen.getByLabelText(m.report_title_label()), {
    target: { value: "Bug" },
  });
  fireEvent.click(screen.getByRole("button", { name: m.report_submit() }));

  await waitFor(() =>
    expect(screen.getByLabelText(m.report_title_label())).toBeInvalid(),
  );
  expect(onSubmit).not.toHaveBeenCalled();
});

it("links to the filed issue once the report is sent", () => {
  const onSendAnother = vi.fn();
  render(
    <ReportForm
      context={context}
      filedIssue={{
        number: 640,
        url: "https://github.com/opusline/opusline/issues/640",
      }}
      onSendAnother={onSendAnother}
      onSubmit={vi.fn()}
    />,
  );

  expect(
    screen.getByRole("link", { name: m.report_sent_link() }),
  ).toHaveAttribute("href", "https://github.com/opusline/opusline/issues/640");

  fireEvent.click(
    screen.getByRole("button", { name: m.report_send_another() }),
  );
  expect(onSendAnother).toHaveBeenCalled();
});
