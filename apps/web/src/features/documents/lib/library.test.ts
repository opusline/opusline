import { describe, expect, it } from "vitest";
import { documentGroup, documentGroups } from "./fixtures";
import {
  filterGroups,
  groupKey,
  libraryDocuments,
  libraryDownloadHref,
  searchLibrary,
} from "./library";

describe("groupKey", () => {
  it("tells a client apart from a mission of the same client", () => {
    const client = documentGroup({ clientSlug: "nordlys" });
    const mission = documentGroup({
      clientSlug: "nordlys",
      missionSlug: "refonte-portail",
    });

    expect(groupKey(client)).not.toBe(groupKey(mission));
  });
});

describe("libraryDownloadHref", () => {
  it("points at the client endpoint for a client group", () => {
    const group = documentGroup();

    expect(libraryDownloadHref(group, group.documents[0])).toContain(
      "/clients/nordlys/documents/11/download",
    );
  });

  it("points at the mission endpoint for a mission group", () => {
    const [mission] = documentGroups();

    expect(libraryDownloadHref(mission, mission.documents[0])).toContain(
      "/clients/nordlys/missions/refonte-portail/documents/21/download",
    );
  });
});

describe("libraryDocuments", () => {
  it("flattens every group into one list", () => {
    expect(
      libraryDocuments(documentGroups()).map((document) => document.id),
    ).toEqual([21, 22, 11, 31]);
  });
});

describe("filterGroups", () => {
  it("returns the groups untouched when nothing is filtered", () => {
    const groups = documentGroups();

    expect(filterGroups(groups, "all")).toBe(groups);
  });

  it("drops the groups left with no document", () => {
    const filtered = filterGroups(documentGroups(), 2);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].documents).toHaveLength(1);
    expect(filtered[0].name).toBe("Refonte portail");
  });
});

describe("searchLibrary", () => {
  it("returns nothing while the query is empty", () => {
    expect(searchLibrary(documentGroups(), "   ")).toEqual([]);
  });

  it("matches on the file name", () => {
    const hits = searchLibrary(documentGroups(), "devis");

    expect(hits.map((hit) => hit.document.fileName)).toEqual([
      "devis-refonte-portail.pdf",
    ]);
  });

  it("matches on the fiche the document sits on", () => {
    const hits = searchLibrary(documentGroups(), "callisto");

    expect(hits.map((hit) => hit.document.id)).toEqual([31]);
  });

  it("reaches a mission through the name of its client", () => {
    const hits = searchLibrary(documentGroups(), "nordlys");

    expect(hits.map((hit) => hit.document.id)).toEqual([21, 11, 22]);
  });

  it("ignores accents on both sides", () => {
    const groups = [
      documentGroup({ name: "Ateliers Ruché", clientName: "Ateliers Ruché" }),
    ];

    expect(searchLibrary(groups, "ruche")).toHaveLength(1);
  });

  it("returns the newest hit first", () => {
    const hits = searchLibrary(documentGroups(), "pdf");

    expect(hits.map((hit) => hit.document.id)).toEqual([21, 31, 11, 22]);
  });

  it("searches what the category filter left", () => {
    expect(
      searchLibrary(filterGroups(documentGroups(), 3), "pdf"),
    ).toHaveLength(1);
  });
});
