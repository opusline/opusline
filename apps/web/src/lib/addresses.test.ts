import { afterEach, expect, it, vi } from "vitest";

import { searchAddresses, searchCities } from "./addresses";

function stubFetch(payload: unknown, status = 200) {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify(payload), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", fetchMock);

  return fetchMock;
}

const NANTES = {
  features: [
    {
      properties: {
        id: "44109_6390_00012",
        label: "12 Rue de la Paix 44000 Nantes",
        name: "12 Rue de la Paix",
        postcode: "44000",
        city: "Nantes",
      },
    },
  ],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

it("maps a BAN feature onto the fields the form needs", async () => {
  stubFetch(NANTES);

  await expect(searchAddresses("12 rue de la paix")).resolves.toEqual([
    {
      id: "44109_6390_00012",
      label: "12 Rue de la Paix 44000 Nantes",
      line1: "12 Rue de la Paix",
      postalCode: "44000",
      city: "Nantes",
    },
  ]);
});

it("does not call the API for a query too short to match anything", async () => {
  const fetchMock = stubFetch(NANTES);

  await expect(searchAddresses("12")).resolves.toEqual([]);
  expect(fetchMock).not.toHaveBeenCalled();
});

it("returns nothing rather than throwing when the lookup fails", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new Error("offline");
    }),
  );

  await expect(searchAddresses("12 rue de la paix")).resolves.toEqual([]);
});

it("returns nothing when the API answers with an error status", async () => {
  stubFetch({}, 503);

  await expect(searchAddresses("12 rue de la paix")).resolves.toEqual([]);
});

it("skips features missing the parts the form fills in", async () => {
  stubFetch({ features: [{ properties: { id: "x", label: "Incomplete" } }] });

  await expect(searchAddresses("12 rue de la paix")).resolves.toEqual([]);
});

it("survives null entries in the feature list", async () => {
  stubFetch({ features: [null, "nonsense", NANTES.features[0]] });

  await expect(searchAddresses("12 rue de la paix")).resolves.toHaveLength(1);
});

it("survives null entries when looking up a city", async () => {
  stubFetch({ features: [null, NANTES.features[0]] });

  await expect(searchCities("nantes")).resolves.toHaveLength(1);
});
