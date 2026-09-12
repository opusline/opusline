import type { ExpenseCategory } from "@opusline/api-client";

import { fromCalendarDate, toCalendarDate } from "@/lib/dates";

import type { VatChoice } from "./vat";

export type QuickEntry = {
  supplier?: string;
  description?: string;
  /** The typed amount with a `.` decimal, ready for the locale formatter. */
  ttcDraft?: string;
  /** `Y-m-d`: the most recent such day on or before `today`. */
  spentOn?: string;
  vatChoice?: VatChoice;
  proShare?: string;
  category?: ExpenseCategory;
};

const RATE_CHOICES: Record<string, VatChoice> = {
  "20": "fr20",
  "10": "fr10",
  "5.5": "fr55",
};

const WORD_CHOICES: Record<string, VatChoice> = {
  autoliq: "eu",
  autoliquidation: "eu",
  ue: "eu",
  intracom: "eu",
  "hors-ue": "nonEu",
  horsue: "nonEu",
  us: "nonEu",
  horstva: "exempt",
  "hors-tva": "exempt",
};

/** Keyword → category, first match wins; matched on the folded line. */
const CATEGORY_KEYWORDS: Array<[RegExp, ExpenseCategory]> = [
  [/ecran|clavier|souris|cable|ordinateur|\bpc\b|casque|imprimante/, 0],
  [/\btrain\b|taxi|\bvol\b|avion|billet|peage|parking/, 6],
  [/dejeuner|resto|repas|diner|restaurant/, 7],
  [/hotel|nuitee|chambre/, 8],
  [/essence|carburant|gasoil|gazole/, 9],
  [/licence|logiciel|saas|abonnement/, 1],
  [/fibre|internet|\bbox\b/, 2],
  [/mobile|forfait|telephone/, 3],
  [/assurance|rc pro/, 10],
  [/hebergement|serveur|domaine|vps|cloud/, 5],
  [/electricite|kwh|energie/, 4],
];

function fold(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** « 12/08 » is the last 12 August on or before today, or nothing when no such day exists. */
function recentDate(
  day: number,
  month: number,
  today: string,
): string | undefined {
  const year = Number(today.slice(0, 4));

  for (const candidate of [year, year - 1]) {
    const date = fromCalendarDate(
      `${candidate}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    );

    if (date.getMonth() + 1 !== month || date.getDate() !== day) {
      return undefined;
    }

    const calendarDate = toCalendarDate(date);

    if (calendarDate <= today) {
      return calendarDate;
    }
  }

  return undefined;
}

/**
 * « lunaprint 429 écran 20% » → supplier Lunaprint, 429 TTC, description
 * « Écran », 20 % TVA. Tokens are read left to right: an amount, a `dd/mm`
 * date, a rate, a `N% pro` share and the reverse-charge words are picked out;
 * what comes before the amount is the supplier, what comes after it the
 * description. French spaces its percent sign, so « 20 % » is glued first.
 */
export function parseQuickEntry(input: string, today: string): QuickEntry {
  const tokens = input
    .trim()
    .replace(/(\d)\s+%/g, "$1%")
    .split(/\s+/)
    .filter(Boolean);
  const entry: QuickEntry = {};
  const supplier: string[] = [];
  const description: string[] = [];
  let hasAmount = false;

  tokens.forEach((token, index) => {
    const lowercased = token.toLowerCase();
    const dateMatch = /^(\d{1,2})\/(\d{1,2})$/.exec(token);

    if (dateMatch !== null) {
      const spentOn = recentDate(
        Number(dateMatch[1]),
        Number(dateMatch[2]),
        today,
      );

      if (spentOn !== undefined) {
        entry.spentOn = spentOn;
      }

      return;
    }

    const rateMatch = /^(\d+(?:[.,]\d+)?)%$/.exec(token);

    if (rateMatch !== null) {
      const value = (rateMatch[1] ?? "").replace(",", ".");

      if (tokens[index + 1]?.toLowerCase() === "pro") {
        entry.proShare = value;
      } else {
        const choice = RATE_CHOICES[value];

        if (choice !== undefined) {
          entry.vatChoice = choice;
        }
      }

      return;
    }

    if (lowercased === "pro" && /%$/.test(tokens[index - 1] ?? "")) {
      return;
    }

    if (!hasAmount && /^\d+(?:[.,]\d+)?€?$/.test(token)) {
      hasAmount = true;
      entry.ttcDraft = token.replace("€", "").replace(",", ".");
      return;
    }

    const word = WORD_CHOICES[lowercased];

    if (word !== undefined) {
      entry.vatChoice = word;
      return;
    }

    (hasAmount ? description : supplier).push(token);
  });

  if (supplier.length > 0) {
    entry.supplier = supplier.map(capitalize).join(" ");
  }

  if (description.length > 0) {
    entry.description = capitalize(description.join(" "));
  }

  const category = CATEGORY_KEYWORDS.find(([pattern]) =>
    pattern.test(fold(input)),
  )?.[1];

  if (category !== undefined) {
    entry.category = category;
  }

  return entry;
}
