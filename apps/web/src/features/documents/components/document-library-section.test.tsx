import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";

import { StoryRouter } from "@/test/story-router";

import { documentGroups } from "../lib/fixtures";
import { DocumentLibrarySection } from "./document-library-section";

// The group footer links to the fiche, so every render needs a router in scope —
// and the router only paints after its first tick.
async function renderSection(groups = documentGroups()) {
  render(
    <StoryRouter>
      <DocumentLibrarySection groups={groups} />
    </StoryRouter>,
  );

  await screen.findByRole("heading", { name: /Reçus des clients/ });
}

function search(text: string) {
  fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });
}

it("shows one collapsed group per fiche", async () => {
  await renderSection();

  const groups = screen.getAllByRole("button", { expanded: false });

  expect(groups).toHaveLength(3);
  expect(
    screen.queryByText("cra-juillet-2026-signe.pdf"),
  ).not.toBeInTheDocument();
});

it("reveals the documents of a group when it is expanded", async () => {
  await renderSection();

  fireEvent.click(screen.getByRole("button", { name: /Refonte portail/ }));

  expect(screen.getByText("cra-juillet-2026-signe.pdf")).toBeInTheDocument();
  expect(screen.getByText("devis-refonte-portail.pdf")).toBeInTheDocument();
});

it("links an expanded mission group to its fiche documents tab", async () => {
  await renderSection();

  fireEvent.click(screen.getByRole("button", { name: /Refonte portail/ }));

  expect(screen.getByRole("link", { name: /Ouvrir la fiche/ })).toHaveAttribute(
    "href",
    "/clients/nordlys/missions/refonte-portail?tab=documents",
  );
});

it("flips from groups to flat hits while searching", async () => {
  await renderSection();
  search("devis");

  expect(screen.queryByRole("button", { expanded: false })).toBeNull();
  expect(screen.getByText("devis-refonte-portail.pdf")).toBeInTheDocument();
  expect(
    screen.queryByText("contrat-cadre-nordlys-2026.pdf"),
  ).not.toBeInTheDocument();
});

it("returns to the groups when the search is cleared", async () => {
  await renderSection();
  search("devis");
  search("");

  expect(screen.getAllByRole("button", { expanded: false })).toHaveLength(3);
});

it("tells the user when nothing matches", async () => {
  await renderSection();
  search("zzz");

  expect(screen.getByText(/Aucun document ne correspond/)).toBeInTheDocument();
});

it("narrows the groups to one category", async () => {
  await renderSection();

  fireEvent.click(screen.getByRole("button", { name: /CRA signé \(1\)/ }));

  const groups = screen.getAllByRole("button", { expanded: false });

  expect(groups).toHaveLength(1);
  expect(within(groups[0]).getByText("Refonte portail")).toBeInTheDocument();
});

it("offers the empty state when no document was ever received", async () => {
  await renderSection([]);

  expect(screen.getByText(/Aucun document reçu/)).toBeInTheDocument();
  expect(screen.queryByRole("textbox")).toBeNull();
});
