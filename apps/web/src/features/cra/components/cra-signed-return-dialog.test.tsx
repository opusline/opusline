import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { craDetail } from "../lib/fixtures";
import { CraSignedReturnDialog } from "./cra-signed-return-dialog";

function renderDialog() {
  const onUpload = vi.fn();

  render(
    <CraSignedReturnDialog
      detail={craDetail({ status: 1, sentOn: "2026-08-01", editable: false })}
      error={null}
      isPending={false}
      onOpenChange={() => {}}
      onUpload={onUpload}
      open
    />,
  );

  return { onUpload };
}

function fileInput(): HTMLInputElement {
  return screen.getByLabelText("Déposer le CRA signé") as HTMLInputElement;
}

function submitButton(): HTMLElement {
  return screen.getByRole("button", { name: "Enregistrer le retour" });
}

it("uploads the signed return picked through the dropzone", () => {
  const { onUpload } = renderDialog();
  const file = new File(["%PDF"], "cra-aout-signe.pdf");

  fireEvent.change(fileInput(), { target: { files: [file] } });

  expect(screen.getByText("cra-aout-signe.pdf")).toBeInTheDocument();

  fireEvent.click(submitButton());

  expect(onUpload).toHaveBeenCalledWith(file);
});

it("keeps the first of several dropped files", () => {
  renderDialog();
  const dropzone = fileInput().closest("label") as HTMLElement;

  fireEvent.drop(dropzone, {
    dataTransfer: {
      files: [
        new File(["%PDF"], "cra-aout-signe.pdf"),
        new File(["%PDF"], "cra-juillet-signe.pdf"),
      ],
    },
  });

  expect(screen.getByText("cra-aout-signe.pdf")).toBeInTheDocument();
  expect(screen.queryByText("cra-juillet-signe.pdf")).not.toBeInTheDocument();
});

it("refuses a file that is neither a PDF nor an image", () => {
  const { onUpload } = renderDialog();

  fireEvent.change(fileInput(), {
    target: { files: [new File(["x"], "cra-aout.docx")] },
  });

  expect(
    screen.getByText("cra-aout.docx — un CRA signé est un PDF ou une image"),
  ).toBeInTheDocument();
  expect(submitButton()).toBeDisabled();
  expect(onUpload).not.toHaveBeenCalled();
});
