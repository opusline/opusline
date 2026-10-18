import { ButtonLink } from "@opusline/ui/components/button";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

it("stays a link to assistive technology, only styled as a button", () => {
  render(
    <ButtonLink render={<a href="/clients/new" />}>Créer un client</ButtonLink>,
  );

  const link = screen.getByRole("link", { name: "Créer un client" });
  expect(link).toHaveAttribute("href", "/clients/new");
  expect(link).not.toHaveAttribute("type");
  expect(screen.queryByRole("button")).toBeNull();
});
