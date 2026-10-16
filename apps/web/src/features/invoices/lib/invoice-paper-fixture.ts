import type { InvoicePaperData } from "@opusline/api-client";

const NBSP = " ";
const eur = (amount: string) => `${amount}${NBSP}€`;

/** An issued invoice, as BuildInvoicePaper resolves it in French. */
export const invoicePaperFixture: InvoicePaperData = {
  language: 0,
  labelSeparator: `${NBSP}:`,
  title: "Facture n° 2026-001",
  stamp: null,
  hasLogo: false,
  meta: [
    { label: "Émise le", value: "10/08/2026" },
    { label: "Échéance", value: "30/09/2026" },
    { label: "Prestation", value: "Refonte de l'espace client" },
    { label: "Catégorie", value: "Prestation de services" },
  ],
  seller: {
    name: "Théo Marchand EI",
    lines: [
      "12 rue de Strasbourg",
      "44000 Nantes",
      "SIRET : 123 456 782 00002",
      "theo@marchand.dev",
    ],
  },
  buyer: {
    name: "Nordlys",
    lines: [
      "3 impasse des Potiers",
      "44100 Nantes",
      "SIREN : 123 456 782",
      "TVA intracom. : FR11123456782",
    ],
  },
  documentTitle: "Refonte de l'espace client",
  description: "Lot 2 : tunnel de commande et fiche produit.\nRecette incluse.",
  head: {
    description: "Désignation",
    quantity: "Qté",
    unitPrice: "PU HT",
    vat: "TVA",
    total: "Total HT",
  },
  lines: [
    {
      label: "Atelier de cadrage",
      detail: "Demi-journée avec l'équipe produit, compte rendu inclus",
      quantity: "1 forfait",
      unitPrice: eur("300,00"),
      vat: "20 %",
      total: eur("300,00"),
    },
    {
      label: "Développement des écrans compte et commandes",
      detail: null,
      quantity: "6,5 j",
      unitPrice: eur("480,00"),
      vat: "20 %",
      total: eur(`3${NBSP}120,00`),
    },
  ],
  noLinesLabel: "Les lignes ajoutées apparaissent ici.",
  vatHead: { base: "Base HT", rate: "Taux", amount: "Montant TVA" },
  vatRows: [
    { base: eur(`3${NBSP}420,00`), rate: "20 %", amount: eur("684,00") },
  ],
  totals: [
    { label: "Total HT", value: eur(`3${NBSP}420,00`), emphasis: false },
    { label: "TVA", value: eur("684,00"), emphasis: false },
    { label: "Total TTC", value: eur(`4${NBSP}104,00`), emphasis: true },
  ],
  paymentTitle: "Informations de paiement",
  payment: [
    { label: "IBAN", value: "FR76 3000 6000 0112 3456 7890 189" },
    { label: "BIC", value: "AGRIFRPP" },
    { label: "Référence du virement", value: "2026-001" },
  ],
  legal:
    "Paiement à 30 jours fin de mois, au plus tard le 30/09/2026. En cas de retard, pénalités au taux annuel de 12,4 %, exigibles dès le lendemain de l'échéance, et indemnité forfaitaire pour frais de recouvrement de 40 € (art. L441-10 du Code de commerce). Pas d'escompte pour paiement anticipé.",
  footer: "2026-001",
};
