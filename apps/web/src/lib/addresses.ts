const SEARCH_URL = "https://api-adresse.data.gouv.fr/search/";

const MIN_QUERY_LENGTH = 3;

export type AddressSuggestion = {
  id: string;
  label: string;
  line1: string;
  postalCode: string;
  city: string;
};

type BanFeature = {
  properties?: {
    id?: unknown;
    label?: unknown;
    name?: unknown;
    postcode?: unknown;
    city?: unknown;
  };
};

function toSuggestion(feature: BanFeature): AddressSuggestion | null {
  const properties = feature.properties;

  if (
    typeof properties?.id !== "string" ||
    typeof properties.label !== "string" ||
    typeof properties.name !== "string" ||
    typeof properties.postcode !== "string" ||
    typeof properties.city !== "string"
  ) {
    return null;
  }

  return {
    id: properties.id,
    label: properties.label,
    line1: properties.name,
    postalCode: properties.postcode,
    city: properties.city,
  };
}

export async function searchAddresses(
  query: string,
  signal?: AbortSignal,
): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();

  if (trimmed.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const url = `${SEARCH_URL}?q=${encodeURIComponent(trimmed)}&limit=5&autocomplete=1`;

  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      return [];
    }

    const payload: unknown = await response.json();
    const features =
      typeof payload === "object" &&
      payload !== null &&
      Array.isArray((payload as { features?: unknown }).features)
        ? ((payload as { features: BanFeature[] }).features ?? [])
        : [];

    return features
      .map(toSuggestion)
      .filter(
        (suggestion): suggestion is AddressSuggestion => suggestion !== null,
      );
  } catch {
    return [];
  }
}

export type CitySuggestion = {
  id: string;
  label: string;
  city: string;
  postalCode: string;
};

export async function searchCities(
  query: string,
  signal?: AbortSignal,
): Promise<CitySuggestion[]> {
  const trimmed = query.trim();

  if (trimmed.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const url = `${SEARCH_URL}?q=${encodeURIComponent(trimmed)}&type=municipality&limit=5&autocomplete=1`;

  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      return [];
    }

    const payload: unknown = await response.json();
    const features =
      typeof payload === "object" &&
      payload !== null &&
      Array.isArray((payload as { features?: unknown }).features)
        ? ((payload as { features: BanFeature[] }).features ?? [])
        : [];

    return features.flatMap((feature) => {
      const properties = feature.properties;

      if (
        typeof properties?.id !== "string" ||
        typeof properties.city !== "string" ||
        typeof properties.postcode !== "string"
      ) {
        return [];
      }

      return [
        {
          id: properties.id,
          label: `${properties.city} (${properties.postcode})`,
          city: properties.city,
          postalCode: properties.postcode,
        },
      ];
    });
  } catch {
    return [];
  }
}
