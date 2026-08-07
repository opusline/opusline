import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { searchAddresses } from "@/lib/addresses";
import { SuggestField } from "./suggest-field";

const SUGGESTION = {
  properties: {
    id: "44109_6390_00012",
    label: "12 Rue de la Paix 44000 Nantes",
    name: "12 Rue de la Paix",
    postcode: "44000",
    city: "Nantes",
  },
};

function stubBan(features: unknown[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(JSON.stringify({ features }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    ),
  );
}

function renderField(value: string, onSelect = vi.fn()) {
  const handleChange = vi.fn();

  render(
    <SuggestField
      field={{
        name: "billingAddressLine1",
        state: {
          value,
          meta: { isTouched: false, isValid: true, errors: [] },
        },
        handleChange,
        handleBlur: vi.fn(),
      }}
      label="Adresse"
      onSearch={searchAddresses}
      onSelect={onSelect}
    />,
  );

  return { handleChange, onSelect };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

function type(value: string) {
  fireEvent.change(screen.getByRole("combobox"), { target: { value } });
}

it("offers the addresses the lookup returns", async () => {
  stubBan([SUGGESTION]);
  renderField("");
  type("12 rue de la paix");

  expect(
    await screen.findByRole("option", {
      name: "12 Rue de la Paix 44000 Nantes",
    }),
  ).toBeInTheDocument();
});

it("hands the picked address back so siblings can be filled", async () => {
  stubBan([SUGGESTION]);
  const { onSelect } = renderField("");
  type("12 rue de la paix");

  fireEvent.mouseDown(await screen.findByRole("option"));

  expect(onSelect).toHaveBeenCalledWith({
    id: "44109_6390_00012",
    label: "12 Rue de la Paix 44000 Nantes",
    line1: "12 Rue de la Paix",
    postalCode: "44000",
    city: "Nantes",
  });
});

it("picks the highlighted address from the keyboard", async () => {
  stubBan([SUGGESTION]);
  const { onSelect } = renderField("");
  type("12 rue de la paix");

  await screen.findByRole("option");
  const input = screen.getByRole("combobox");

  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "Enter" });

  expect(onSelect).toHaveBeenCalled();
});

it("stays a plain text field when the lookup finds nothing", async () => {
  stubBan([]);
  const { handleChange } = renderField("");
  type("nowhere at all");

  await waitFor(() => {
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
  // Typing still reaches the form even though nothing was suggested.
  expect(handleChange).toHaveBeenCalledWith("nowhere at all");
});

it("stays closed when the field opens with a value already in it", async () => {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify({ features: [SUGGESTION] }), { status: 200 }),
  );
  vi.stubGlobal("fetch", fetchMock);

  renderField("12 Rue de la Paix");

  await waitFor(() => expect(fetchMock).not.toHaveBeenCalled());
  expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
});
