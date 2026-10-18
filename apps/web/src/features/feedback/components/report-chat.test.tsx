import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { ReportChat, type ReportTranscript } from "./report-chat";

function renderChat(
  transcript: ReportTranscript = [],
  onSend = vi.fn(async () => true),
) {
  const onSkip = vi.fn();
  render(
    <ReportChat
      error={null}
      isPending={false}
      onSend={onSend}
      onSkip={onSkip}
      transcript={transcript}
    />,
  );

  return { onSend, onSkip };
}

it("sends what the account typed, without the spaces around it", async () => {
  const { onSend } = renderChat();

  fireEvent.change(screen.getByLabelText(m.report_chat_label()), {
    target: { value: "  The preview is cut.  " },
  });
  fireEvent.click(screen.getByRole("button", { name: m.report_chat_send() }));

  await waitFor(() =>
    expect(onSend).toHaveBeenCalledWith("The preview is cut."),
  );
  await waitFor(() =>
    expect(screen.getByLabelText(m.report_chat_label())).toHaveValue(""),
  );
});

it("keeps the message when Claude could not answer it", async () => {
  renderChat(
    [],
    vi.fn(async () => false),
  );

  fireEvent.change(screen.getByLabelText(m.report_chat_label()), {
    target: { value: "The preview is cut." },
  });
  fireEvent.keyDown(screen.getByLabelText(m.report_chat_label()), {
    key: "Enter",
  });

  await waitFor(() =>
    expect(screen.getByLabelText(m.report_chat_label())).toHaveValue(
      "The preview is cut.",
    ),
  );
});

it("shows who said what", () => {
  renderChat([
    { speaker: 0, text: "The preview is cut." },
    { speaker: 1, text: "On which screen?" },
  ]);

  const lines = screen.getAllByTestId("report-chat-line");

  expect(lines.map((line) => line.dataset.speaker)).toEqual(["0", "1"]);
  expect(screen.getByText("On which screen?")).toBeVisible();
});

it("leaves the plain form one click away", () => {
  const { onSkip } = renderChat();

  fireEvent.click(screen.getByRole("button", { name: m.report_chat_skip() }));

  expect(onSkip).toHaveBeenCalled();
});

it("hands over to the form once the conversation is as long as the API takes", () => {
  renderChat(
    Array.from({ length: 19 }, (_, index) => ({
      speaker: (index % 2) as 0 | 1,
      text: `Line ${index}`,
    })),
  );

  expect(screen.queryByLabelText(m.report_chat_label())).toBeNull();
  expect(
    screen.getByRole("button", { name: m.report_chat_skip() }),
  ).toBeVisible();
});
