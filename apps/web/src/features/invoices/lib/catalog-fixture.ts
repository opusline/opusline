import type { CatalogItemData } from "@opusline/api-client";

export const catalogFixture: CatalogItemData[] = [
  {
    id: 1,
    label: "Atelier de cadrage",
    detail: "Demi-journée avec l'équipe produit, compte rendu inclus",
    unit: 2,
    unitPrice: { amount: 30_000, currency: "EUR" },
    vatRateBp: 2000,
  },
  {
    id: 2,
    label: "Heure de maintenance",
    detail: "Interventions ponctuelles, par tranche de 30 min",
    unit: 1,
    unitPrice: { amount: 8_500, currency: "EUR" },
    vatRateBp: 2000,
  },
  {
    id: 3,
    label: "Journée de développement frontend",
    detail: null,
    unit: 0,
    unitPrice: { amount: 55_000, currency: "EUR" },
    vatRateBp: 2000,
  },
];
