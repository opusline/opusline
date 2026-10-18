import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { m } from "@/paraglide/messages.js";
import { AnthropicCard } from "./anthropic-card";

const KEY = "sk-ant-api03-test-key";

function renderCard(hasApiKey: boolean) {
  const onSave = vi.fn(async () => ({ status: "success" as const }));
  const onRemove = vi.fn();

  render(
    <AnthropicCard
      error={null}
      isRemoving={false}
      onRemove={onRemove}
      onSave={onSave}
      settings={{ hasApiKey, model: "claude-opus-5-5" }}
    />,
  );

  return { onSave, onRemove };
}

it("saves the pasted key without the spaces around it", async () => {
  const { onSave } = renderCard(false);

  fireEvent.change(
    screen.getByLabelText(m.integrations_anthropic_key_label()),
    {
      target: { value: `  ${KEY}\n` },
    },
  );
  fireEvent.click(
    screen.getByRole("button", { name: m.integrations_anthropic_save() }),
  );

  await waitFor(() => expect(onSave).toHaveBeenCalledWith({ apiKey: KEY }));
});

it("does not send something that is not an anthropic key", async () => {
  const { onSave } = renderCard(false);

  fireEvent.change(
    screen.getByLabelText(m.integrations_anthropic_key_label()),
    {
      target: { value: "sk-proj-not-anthropic" },
    },
  );
  fireEvent.click(
    screen.getByRole("button", { name: m.integrations_anthropic_save() }),
  );

  await waitFor(() =>
    expect(
      screen.getByLabelText(m.integrations_anthropic_key_label()),
    ).toBeInvalid(),
  );
  expect(onSave).not.toHaveBeenCalled();
});

it("says a key is saved and which model it pays for, never the key", () => {
  renderCard(true);

  expect(
    screen.getByText(
      m.integrations_anthropic_saved_detail({ model: "claude-opus-5-5" }),
    ),
  ).toBeVisible();
  expect(
    screen.queryByLabelText(m.integrations_anthropic_key_label()),
  ).toBeNull();
});
