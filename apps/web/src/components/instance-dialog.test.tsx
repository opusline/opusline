import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { InstanceDialog } from "./instance-dialog";

const BASE_PROPS = {
  open: true,
  onOpenChange: () => {},
  version: "0.24.0",
  database: "pgsql",
  backup: null,
  isPending: false,
  error: null,
};

it("names what the instance is running", () => {
  render(<InstanceDialog {...BASE_PROPS} />);

  expect(screen.getByText("0.24.0")).toBeInTheDocument();
  expect(screen.getByText("pgsql")).toBeInTheDocument();
});

it("says when the last backup was taken, and how long ago", () => {
  render(
    <InstanceDialog
      {...BASE_PROPS}
      backup={{
        takenAt: new Date(Date.now() - 3 * 86_400_000).toISOString(),
        archive: "./backups/opusline-20260908-030004.tar.gz",
        bytes: 41_234_567,
      }}
    />,
  );

  expect(screen.getByText("il y a 3 jours")).toBeInTheDocument();
  expect(
    screen.getByText(/opusline-20260908-030004\.tar\.gz/),
  ).toBeInTheDocument();
});

it("tells an instance that has never been backed up what to do about it", () => {
  render(<InstanceDialog {...BASE_PROPS} />);

  expect(screen.getByRole("alert")).toHaveTextContent(
    /aucune sauvegarde enregistrée/i,
  );
  expect(screen.getByText("./opusline-backup.sh backup")).toBeInTheDocument();
});

it("offers the command whether or not a backup exists", () => {
  render(
    <InstanceDialog
      {...BASE_PROPS}
      backup={{
        takenAt: new Date().toISOString(),
        archive: "./backups/opusline-20260911-030004.tar.gz",
        bytes: 12,
      }}
    />,
  );

  expect(screen.getByText("./opusline-backup.sh backup")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("does not call a failed read a missing backup", () => {
  render(
    <InstanceDialog
      {...BASE_PROPS}
      database={null}
      error="Impossible de lire cette instance."
      version={null}
    />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Impossible de lire cette instance.",
  );
  expect(
    screen.queryByText(/aucune sauvegarde enregistrée/i),
  ).not.toBeInTheDocument();
  // Still the one thing a reader can act on when the app cannot tell them.
  expect(screen.getByText("./opusline-backup.sh backup")).toBeInTheDocument();
});
