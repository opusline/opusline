import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, it } from "vitest";

import { PaymentTermsPicker } from "./payment-terms-picker";

function Harness({ initial = 45 }: { initial?: number }) {
  const [value, setValue] = useState(initial);

  return (
    <>
      <PaymentTermsPicker onChange={setValue} value={value} />
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
