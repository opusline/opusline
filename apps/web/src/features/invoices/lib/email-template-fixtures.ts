import type { EmailPreviewData, EmailTemplateData } from "@opusline/api-client";

export const EMAIL_TEMPLATES: EmailTemplateData[] = [
  {
    kind: 0,
    subject: "Facture {numero} ({titre})",
    body: "Bonjour {contact},\n\nVoici la facture {numero} pour {titre}, d'un montant de {montant} TTC, à régler avant le {echeance}.\n\nBonne journée,",
    isCustom: false,
    variables: [
      "numero",
      "titre",
      "montant",
      "reste",
      "echeance",
      "contact",
      "client",
    ],
  },
  {
    kind: 1,
    subject: "Devis {numero} ({titre})",
    body: "Bonjour {contact},\n\nComme convenu, voici le devis {numero} pour {titre} : {montant} HT, valable jusqu'au {validite}.\n\nBonne journée,",
    isCustom: false,
    variables: ["numero", "titre", "montant", "validite", "contact", "client"],
  },
  {
    kind: 2,
    subject: "Avoir {numero} (facture {facture})",
    body: "Bonjour {contact},\n\nVoici l'avoir {numero}, d'un montant de {montant} TTC, qui se rapporte à la facture {facture}.\n\n{traitement}\n\nBonne journée,",
    isCustom: false,
    variables: [
      "numero",
      "facture",
      "montant",
      "traitement",
      "contact",
      "client",
    ],
  },
  {
    kind: 3,
    subject: "Un petit rappel pour la facture {numero}",
    body: "Bonjour {contact},\n\nLa facture {numero} ({montant} TTC) est arrivée à échéance le {echeance}. Pouvez-vous regarder de votre côté ?\n\nMerci,",
    isCustom: true,
    variables: [
      "numero",
      "titre",
      "montant",
      "reste",
      "echeance",
      "retard",
      "penalites",
      "contact",
      "client",
    ],
  },
];

export const EMAIL_PREVIEW: EmailPreviewData = {
  subject: "Facture F-2026-014 (Refonte du site)",
  text: "Bonjour Sophie,\n\nVoici la facture F-2026-014 pour Refonte du site, d'un montant de 1 440,00 € TTC, à régler avant le 15/11/2026.\n\nBonne journée,",
  html: '<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#EFEBE5;font-family:sans-serif;padding:24px"><div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #E6E1D9;border-radius:6px;padding:22px 28px"><p>Bonjour Sophie,</p><p>Voici la facture F-2026-014 pour Refonte du site, d\'un montant de 1 440,00 € TTC, à régler avant le 15/11/2026.</p><div style="border:1px solid #E6E1D9;border-radius:6px;padding:14px 16px"><div style="font-size:11px;text-transform:uppercase;color:#8A8179">Facture F-2026-014</div><div style="font-size:24px;font-weight:600">1 440,00 €</div></div><p style="font-weight:600">Studio Lorem</p></div></body></html>',
};
