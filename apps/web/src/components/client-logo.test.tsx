import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { SAMPLE_LOGO_SRC } from "@/lib/logo-fixture";
import { ClientLogo } from "./client-logo";

it("falls back to the client initials when there is no logo", () => {
  render(<ClientLogo name="Nordlys Conseil" size="lg" />);

  expect(screen.getByText("NC")).toBeInTheDocument();
});

it("shows the logo when one is available", () => {
  const { container } = render(
    <ClientLogo name="Nordlys Conseil" size="lg" src={SAMPLE_LOGO_SRC} />,
  );

  expect(container.querySelector("img")).toHaveAttribute(
    "src",
    SAMPLE_LOGO_SRC,
  );
  expect(screen.queryByText("NC")).not.toBeInTheDocument();
});

it("falls back to the initials when the logo fails to load", () => {
  const { container } = render(
    <ClientLogo name="Nordlys Conseil" size="lg" src="/clients/x/logo" />,
  );
  const image = container.querySelector("img");
  expect(image).not.toBeNull();

  fireEvent.error(image as HTMLImageElement);

  expect(screen.getByText("NC")).toBeInTheDocument();
  expect(container.querySelector("img")).toBeNull();
});

it("shows the logo again once a new one replaces the failed source", () => {
  const { container, rerender } = render(
    <ClientLogo name="Nordlys" size="lg" src="/clients/x/logo" />,
  );
  fireEvent.error(container.querySelector("img") as HTMLImageElement);
  expect(screen.getByText("N")).toBeInTheDocument();

  rerender(<ClientLogo name="Nordlys" size="lg" src="/clients/x/logo?v=1" />);

  expect(container.querySelector("img")).toHaveAttribute(
    "src",
    "/clients/x/logo?v=1",
  );
});
