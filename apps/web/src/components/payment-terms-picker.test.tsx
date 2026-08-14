import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, it } from "vitest";

import { PaymentTermsPicker } from "./payment-terms-picker";

function Harness({
  initial = 45,
  variant,
}: {
  initial?: number;
  variant?: "default" | "inline";
}) {
  const [value, setValue] = useState(initial);

  return (
    <>
      <PaymentTermsPicker onChange={setValue} value={value} variant={variant} />
      <button onClick={() => setValue(initial)} type="button">
        reset
      </button>
      <output>{value}</output>
    </>
  );
}

it("follows a value it did not emit, so a form reset cannot desync it", () => {
  render(<Harness />);

  fireEvent.click(screen.getByRole("button", { name: "Autre…" }));
  fireEvent.change(screen.getByLabelText("Délai de paiement en jours"), {
    target: { value: "90" },
  });
  expect(screen.getByRole("status")).toHaveTextContent("90");

  fireEvent.click(screen.getByRole("button", { name: "reset" }));

  expect(screen.getByRole("status")).toHaveTextContent("45");
  expect(
    screen.queryByLabelText("Délai de paiement en jours"),
  ).not.toBeInTheDocument();
});

it("keeps the custom input open while a preset number is typed into it", () => {
  render(<Harness />);

  fireEvent.click(screen.getByRole("button", { name: "Autre…" }));
  fireEvent.change(screen.getByLabelText("Délai de paiement en jours"), {
    target: { value: "30" },
  });

  expect(
    screen.getByLabelText("Délai de paiement en jours"),
  ).toBeInTheDocument();
});

it("inline: emits what is typed into the always-visible day input", () => {
  render(<Harness variant="inline" />);

  fireEvent.change(screen.getByLabelText("Délai de paiement en jours"), {
    target: { value: "90" },
  });

  expect(screen.getByRole("status")).toHaveTextContent("90");
});

it("inline: follows a value it did not emit, so a form reset cannot desync it", () => {
  render(<Harness variant="inline" />);

  fireEvent.change(screen.getByLabelText("Délai de paiement en jours"), {
    target: { value: "90" },
  });
  fireEvent.click(screen.getByRole("button", { name: "reset" }));

  expect(screen.getByLabelText("Délai de paiement en jours")).toHaveValue("45");
});

it("inline: selects the matching preset chip when its number is typed", () => {
  render(<Harness variant="inline" />);

  fireEvent.change(screen.getByLabelText("Délai de paiement en jours"), {
    target: { value: "60" },
  });

  expect(screen.getByRole("button", { name: "60 j" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
