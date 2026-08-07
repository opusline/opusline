import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import { MAX_LOGO_BYTES } from "@/lib/logos";
import { LogoPicker } from "./logo-picker";

function renderPicker(
  overrides: Partial<ComponentProps<typeof LogoPicker>> = {},
) {
  const props: ComponentProps<typeof LogoPicker> = {
    label: "Logo du client",
    placeholder: "Déposez le logo",
    removeLabel: "Retirer le logo du client",
    size: "lg",
    onPick: vi.fn(),
    onRemove: vi.fn(),
    ...overrides,
  };

  render(<LogoPicker {...props} />);

  return props;
}

function pick(file: File) {
  fireEvent.change(screen.getByLabelText("Logo du client"), {
    target: { files: [file] },
  });
}

it("accepts a PNG logo", () => {
  const { onPick } = renderPicker();
  const file = new File(["x"], "nordlys.png", { type: "image/png" });

  pick(file);

  expect(onPick).toHaveBeenCalledWith(file);
});

it("accepts an SVG logo", () => {
  const { onPick } = renderPicker();
  const file = new File(["x"], "nordlys.svg", { type: "image/svg+xml" });

  pick(file);

  expect(onPick).toHaveBeenCalledWith(file);
});

it("refuses a format the API would reject", () => {
  const { onPick } = renderPicker();

  pick(new File(["x"], "nordlys.gif", { type: "image/gif" }));

  expect(onPick).not.toHaveBeenCalled();
  expect(screen.getByText("PNG ou SVG uniquement")).toBeInTheDocument();
});

it("refuses a logo over the size limit", () => {
  const { onPick } = renderPicker();
  const oversized = new File(["x"], "nordlys.png", { type: "image/png" });
  Object.defineProperty(oversized, "size", { value: MAX_LOGO_BYTES + 1 });

  pick(oversized);

  expect(onPick).not.toHaveBeenCalled();
  expect(screen.getByText("trop lourd (max 2 Mo)")).toBeInTheDocument();
});

it("shows the placeholder and no remove action while empty", () => {
  renderPicker();

  expect(screen.getByText("Déposez le logo")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Retirer le logo du client" }),
  ).not.toBeInTheDocument();
});

it("removes a filled logo from its own action", () => {
  const { onRemove } = renderPicker({ src: "/clients/nordlys/logo" });

  fireEvent.click(
    screen.getByRole("button", { name: "Retirer le logo du client" }),
  );

  expect(onRemove).toHaveBeenCalled();
});

it("treats a logo that fails to load as an empty slot", () => {
  const { container } = render(
    <LogoPicker
      label="Logo du client"
      onPick={vi.fn()}
      onRemove={vi.fn()}
      placeholder="Déposez le logo"
      removeLabel="Retirer le logo du client"
      size="lg"
      src="/clients/nordlys/logo"
    />,
  );

  fireEvent.error(container.querySelector("img") as HTMLImageElement);

  expect(screen.getByText("Déposez le logo")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Retirer le logo du client" }),
  ).not.toBeInTheDocument();
});

it("surfaces a server-side failure", () => {
  renderPicker({ error: "L'envoi a échoué. Réessayez dans un instant." });

  expect(
    screen.getByText("L'envoi a échoué. Réessayez dans un instant."),
  ).toBeInTheDocument();
});

it("refuses a new logo while an action is in flight", () => {
  const { onPick } = renderPicker({ isPending: true });

  pick(new File(["x"], "nordlys.png", { type: "image/png" }));

  expect(onPick).not.toHaveBeenCalled();
});

it("locks the remove action while an action is in flight", () => {
  renderPicker({ isPending: true, src: "/clients/nordlys/logo" });

  expect(
    screen.getByRole("button", { name: "Retirer le logo du client" }),
  ).toBeDisabled();
});
