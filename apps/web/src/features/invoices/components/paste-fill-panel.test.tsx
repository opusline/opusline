import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import type { FilledField } from "../lib/paste-fill";
import { PasteFillPanel } from "./paste-fill-panel";

const FILLED: FilledField[] = [
  { kind: "client", name: "Nordlys" },
  { kind: "lines", count: 2 },
  { kind: "term" },
];

function renderPanel(onFill = vi.fn<(text: string) => FilledField[] | null>()) {
  render(
    <PasteFillPanel
      onFill={onFill}
      prompt="Tu rédiges une facture…"
      sample='<opusline-document type="facture"></opusline-document>'
    />,
  );

  return onFill;
}

it("stays folded until asked, then takes a text", () => {
  renderPanel();

  expect(screen.queryByTestId("paste-fill-text")).not.toBeInTheDocument();

  fireEvent.click(screen.getByTestId("paste-fill-toggle"));

  expect(screen.getByTestId("paste-fill-text")).toBeInTheDocument();
  expect(screen.getByTestId("paste-fill-apply")).toBeDisabled();
});

it("fills from the sample and lists what was filled", () => {
  const onFill = renderPanel(vi.fn(() => FILLED));

  fireEvent.click(screen.getByTestId("paste-fill-toggle"));
  fireEvent.click(screen.getByTestId("paste-fill-sample"));
  fireEvent.click(screen.getByTestId("paste-fill-apply"));

  expect(onFill).toHaveBeenCalledWith(
    '<opusline-document type="facture"></opusline-document>',
  );
  expect(screen.getByTestId("paste-fill-filled")).toHaveAttribute(
    "data-count",
    "3",
  );
  expect(screen.getAllByTestId("paste-fill-chip")[0]).toHaveTextContent(
    "Client : Nordlys",
  );
  expect(screen.getAllByTestId("paste-fill-chip")[1]).toHaveTextContent(
    "2 lignes",
  );
});

it("says so when the text is not in the format, until it changes", () => {
  renderPanel(vi.fn(() => null));

  fireEvent.click(screen.getByTestId("paste-fill-toggle"));
  fireEvent.change(screen.getByTestId("paste-fill-text"), {
    target: { value: "Devis : 3 jours à 480 €" },
  });
  fireEvent.click(screen.getByTestId("paste-fill-apply"));

  expect(screen.getByTestId("paste-fill-unrecognized")).toBeInTheDocument();

  fireEvent.change(screen.getByTestId("paste-fill-text"), {
    target: { value: "autre chose" },
  });

  expect(
    screen.queryByTestId("paste-fill-unrecognized"),
  ).not.toBeInTheDocument();
});

it("shows the prompt on demand", () => {
  renderPanel();

  fireEvent.click(screen.getByTestId("paste-fill-toggle"));
  expect(screen.queryByTestId("paste-fill-prompt")).not.toBeInTheDocument();

  fireEvent.click(screen.getByTestId("paste-fill-prompt-toggle"));

  expect(screen.getByTestId("paste-fill-prompt")).toHaveTextContent(
    "Tu rédiges une facture…",
  );
});
