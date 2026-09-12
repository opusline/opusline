import type {
  DateFormat,
  ExpenseCategory,
  ExpenseData,
  ExpensesMonthData,
  ExpenseVatStatus,
  Locale,
} from "@opusline/api-client";
import type { Badge } from "@opusline/ui/components/badge";
import type { ComponentProps } from "react";

import { formatPercentFromBp } from "@/lib/billing";
import {
  cachedDateFormatter,
  calendarDateNumericLabel,
  fromCalendarDate,
} from "@/lib/dates";
import { monthStart } from "@/lib/months";
import { m } from "@/paraglide/messages.js";

const EXPENSE_CATEGORY_MESSAGES: Record<ExpenseCategory, () => string> = {
  0: m.expense_category_equipment,
  1: m.expense_category_software,
  2: m.expense_category_internet,
  3: m.expense_category_phone,
  4: m.expense_category_electricity,
  5: m.expense_category_hosting,
  6: m.expense_category_travel,
  7: m.expense_category_meal,
  8: m.expense_category_hotel,
  9: m.expense_category_fuel,
  10: m.expense_category_insurance,
  11: m.expense_category_taxes,
  12: m.expense_category_other,
};

export function expenseCategoryLabel(category: ExpenseCategory): string {
  return EXPENSE_CATEGORY_MESSAGES[category]();
}

/**
 * The categories whose TVA the fisc looks at twice — the canvas flags them
 * with a warning icon next to the chip. Repas is recoverable only on an
 * invoice in the business's name; hotel nights and fuel never are.
 */
const EXPENSE_CATEGORY_WARNINGS: Partial<
  Record<ExpenseCategory, () => string>
> = {
  7: m.expense_category_warning_meal,
  8: m.expense_category_warning_hotel,
  9: m.expense_category_warning_fuel,
};

export function expenseCategoryWarning(
  category: ExpenseCategory,
): string | null {
  return EXPENSE_CATEGORY_WARNINGS[category]?.() ?? null;
}

/** The month a period key names, lowercase and alone: « août », « septembre ». */
export function monthName(locale: Locale, period: string): string {
  return cachedDateFormatter(locale, { month: "long" }).format(
    fromCalendarDate(monthStart(period)),
  );
}

/** The rate line under the TVA cell: « 20 % », « autoliq. 20 % », « hors TVA ». */
export function expenseRateLabel(locale: Locale, expense: ExpenseData): string {
  if (expense.vatTreatment === 3 || expense.vatRateBp === 0) {
    return m.expense_vat_exempt();
  }

  const rate = m.common_percent({
    value: formatPercentFromBp(locale, expense.vatRateBp),
  });

  return expense.vatTreatment === 0
    ? rate
    : m.expense_vat_rate_reverse({ rate });
}

export type ExpenseStatusPresentation = {
  label: string;
  /** The line under the pill: which CA3, or what is missing. */
  sub: string | null;
  variant: NonNullable<ComponentProps<typeof Badge>["variant"]>;
  /** The small mono tag on a reverse-charged pill: « UE » or « US ». */
  flag: string | null;
  isDeducted: boolean;
};

const STATUS_VARIANTS: Record<
  ExpenseVatStatus,
  ExpenseStatusPresentation["variant"]
> = {
  0: "brand-outline",
  1: "success",
  2: "quiet",
  3: "attention",
  4: "info",
  5: "quiet",
};

/**
 * What the status pill says for one expense, given the month it sits in.
 * Under the franchise en base (`month.vat === null`) the TVA statuses have no
 * meaning, so the pill only says whether the receipt is there.
 */
export function expenseStatusPresentation(
  locale: Locale,
  dateFormat: DateFormat,
  expense: ExpenseData,
  month: Pick<ExpensesMonthData, "month" | "vat" | "declaredOn">,
): ExpenseStatusPresentation {
  if (month.vat === null) {
    return expense.receipt === null
      ? {
          label: m.expense_status_receipt_missing(),
          sub: null,
          variant: "attention",
          flag: null,
          isDeducted: false,
        }
      : {
          label: m.expense_status_receipt_linked(),
          sub: null,
          variant: "success",
          flag: null,
          isDeducted: true,
        };
  }

  const claimMonth = monthName(locale, expense.vatClaimPeriod);
  const base = {
    variant: STATUS_VARIANTS[expense.vatStatus],
    flag: null,
    isDeducted: false,
  };

  switch (expense.vatStatus) {
    case 0:
      return {
        ...base,
        label: m.expense_status_deductible(),
        sub: m.expense_status_deductible_sub({ month: claimMonth }),
      };
    case 1:
      return {
        ...base,
        label: m.expense_status_deducted(),
        // The month's filing date only dates this row's CA3 when the row was
        // claimed on it; a deduction deferred to a later month names that month.
        sub:
          expense.vatClaimPeriod === month.month && month.declaredOn !== null
            ? m.expense_status_deducted_sub({
                date: calendarDateNumericLabel(dateFormat, month.declaredOn),
              })
            : m.expense_status_deductible_sub({ month: claimMonth }),
        isDeducted: true,
      };
    case 2:
      return {
        ...base,
        label: m.expense_status_deferred(),
        sub: expense.isRegularisation
          ? m.expense_status_deferred_regularisation_sub({ month: claimMonth })
          : m.expense_status_deferred_sub({ month: claimMonth }),
      };
    case 3:
      return {
        ...base,
        label: m.expense_status_blocked(),
        sub: m.expense_status_blocked_sub(),
      };
    case 4:
      return {
        ...base,
        label: m.expense_status_reverse_charged(),
        sub:
          expense.vatTreatment === 2
            ? m.expense_status_reverse_charged_non_eu_sub()
            : m.expense_status_reverse_charged_eu_sub(),
        flag:
          expense.vatTreatment === 2
            ? m.expense_status_reverse_charged_non_eu_flag()
            : m.expense_status_reverse_charged_eu_flag(),
      };
    case 5:
      return { ...base, label: m.expense_status_exempt(), sub: null };
  }
}
