import type {
  ContributionLineKind,
  DeclarationDeadlineData,
  Locale,
  UrssafPeriodicity,
  VatDeclarationData,
} from "@opusline/api-client";

import { formatPercentFromBp } from "@/lib/billing";
import { cachedDateFormatter, fromCalendarDate } from "@/lib/dates";
import { monthStart } from "@/lib/months";
import { periodKind, periodTitle, shiftPeriod } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

const URSSAF_BADGE_MESSAGES: Record<UrssafPeriodicity, () => string> = {
  0: m.declarations_urssaf_badge_monthly,
  1: m.declarations_urssaf_badge_quarterly,
};

export function urssafBadgeLabel(periodicity: UrssafPeriodicity): string {
  return URSSAF_BADGE_MESSAGES[periodicity]();
}

const CONTRIBUTION_KIND_MESSAGES: Record<ContributionLineKind, () => string> = {
  0: m.declarations_contribution_social,
  1: m.declarations_contribution_cfp,
  2: m.declarations_contribution_liberating,
};

export function contributionKindLabel(kind: ContributionLineKind): string {
  return CONTRIBUTION_KIND_MESSAGES[kind]();
}

/** The `FiscalDeadlineKind`s this screen records: URSSAF, CA3, CFE and the 2042-C PRO. */
export type DeclarationKind = 0 | 1 | 3 | 5;

const DECLARATION_KIND_MESSAGES: Record<DeclarationKind, () => string> = {
  0: m.declarations_kind_urssaf,
  1: m.declarations_kind_ca3,
  3: m.declarations_kind_cfe,
  5: m.declarations_kind_income_tax,
};

export function declarationKindLabel(kind: DeclarationKind): string {
  return DECLARATION_KIND_MESSAGES[kind]();
}

/**
 * « juillet » for a month — the card titles carry no year, the way the design
 * writes them — and the shared « T2 2026 » for a quarter, where the year
 * disambiguates.
 */
export function declarationPeriodLabel(locale: Locale, period: string): string {
  if (periodKind(period) === "month") {
    return cachedDateFormatter(locale, { month: "long" }).format(
      fromCalendarDate(monthStart(period)),
    );
  }

  return periodTitle(locale, period);
}

/** What the copy button puts on the clipboard: whole euros, no spaces, no cents — what the forms expect. */
export function declarationCopyValue(amountCents: number): string {
  return String(Math.round(amountCents / 100));
}

export type DeadlineTone = "quiet" | "attention" | "overdue";

export function declarationDeadlineTone(
  deadline: DeclarationDeadlineData,
): DeadlineTone {
  if (deadline.daysLeft < 0) {
    return "overdue";
  }

  return deadline.daysLeft <= 5 ? "attention" : "quiet";
}

export type Ca3Row = {
  box: string;
  label: string;
  valueCents: number;
  /** The second figure of a dual row: box 08 carries the base and the tax. */
  value2Cents?: number;
  note?: string;
  tone: "default" | "success" | "quiet" | "due";
  /** Where the figure comes from, linked under it with a caption. */
  source?:
    | { to: "/invoices"; caption: string }
    | { to: "/expenses"; period: string; caption: string };
};

/**
 * The 3310-CA3 lines in the order the form prints them. The sales line is
 * labelled A1 (what the online form shows) though the canvas writes 01; box 25
 * only appears when the month ends in credit, and box 32 reads as quiet when
 * there is nothing to pay.
 */
export function ca3Rows(
  vat: VatDeclarationData,
  locale: Locale,
  format: (cents: number) => string,
): Ca3Row[] {
  const { boxes } = vat;
  const previous = declarationPeriodLabel(locale, shiftPeriod(vat.period, -1));
  const rows: Ca3Row[] = [
    {
      box: "A1",
      label: m.ca3_box_a1(),
      valueCents: boxes.salesHt.amount,
      tone: "default",
      source: {
        to: "/invoices",
        caption: m.declarations_invoices_collected({ count: vat.invoiceCount }),
      },
    },
    {
      box: "2A",
      label: m.ca3_box_2a(),
      valueCents: boxes.intraCommunityPurchasesHt.amount,
      tone: "default",
    },
    {
      box: "3B",
      label: m.ca3_box_3b(),
      valueCents: boxes.nonEuPurchasesHt.amount,
      tone: "default",
    },
    {
      box: "08",
      label: m.ca3_box_08(),
      valueCents: boxes.taxableBase.amount,
      value2Cents: boxes.collected.amount,
      tone: "default",
      note: rateLineNote(vat.rateBp, locale),
    },
    {
      box: "19",
      label: m.ca3_box_19(),
      valueCents: boxes.fixedAssets.amount,
      tone: "default",
    },
    {
      box: "20",
      label: m.ca3_box_20(),
      valueCents: boxes.goodsAndServices.amount,
      tone: "default",
      source: {
        to: "/expenses",
        period: vat.period,
        caption: m.declarations_expenses_count({ count: vat.expenseCount }),
      },
      note:
        vat.reverseChargedVat.amount > 0
          ? m.declarations_box_20_reverse_note({
              amount: format(vat.reverseChargedVat.amount),
            })
          : undefined,
    },
    {
      box: "21",
      label: m.ca3_box_21(),
      valueCents: boxes.otherDeductible.amount,
      tone: "default",
    },
    {
      box: "22",
      label: m.ca3_box_22(),
      valueCents: boxes.creditCarried.amount,
      tone: boxes.creditCarried.amount > 0 ? "success" : "quiet",
      note:
        boxes.creditCarried.amount > 0
          ? m.declarations_box_22_note({ month: previous })
          : undefined,
    },
  ];

  if (boxes.credit.amount > 0) {
    rows.push({
      box: "25",
      label: m.ca3_box_25(),
      valueCents: boxes.credit.amount,
      tone: "success",
      note: vat.creditIsRefundable
        ? m.declarations_box_25_refundable()
        : m.declarations_box_25_carried(),
    });
  }

  rows.push({
    box: "32",
    label: m.ca3_box_32(),
    valueCents: boxes.due.amount,
    tone: boxes.due.amount > 0 ? "due" : "quiet",
    note: boxes.due.amount > 0 ? undefined : m.declarations_box_32_nothing(),
  });

  return rows;
}

/** One `box<TAB>euros` line per figure, so a dual row yields two. */
export function ca3CopyLines(rows: Ca3Row[]): string[] {
  return rows.flatMap((row) =>
    row.value2Cents === undefined
      ? [`${row.box}\t${declarationCopyValue(row.valueCents)}`]
      : [
          `${row.box}\t${declarationCopyValue(row.valueCents)}`,
          `${row.box}\t${declarationCopyValue(row.value2Cents)}`,
        ],
  );
}

/**
 * The 3310-CA3 has one « TVA brute » line per rate (08 at 20 %, 9B at 10 %,
 * 09 at 5,5 %). The API sums the whole base under 08; a month billed at a
 * reduced rate, or at several, is told where to split it.
 */
function rateLineNote(
  rateBp: number | null,
  locale: Locale,
): string | undefined {
  if (rateBp === 2000) {
    return undefined;
  }

  return rateBp === null
    ? m.declarations_box_08_mixed_note()
    : m.declarations_box_08_rate_note({
        rate: m.common_percent({ value: formatPercentFromBp(locale, rateBp) }),
      });
}
