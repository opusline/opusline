export type Ca3BoxKey =
  | "salesHt"
  | "intraCommunityPurchasesHt"
  | "nonEuPurchasesHt"
  | "taxableBase"
  | "fixedAssets"
  | "goodsAndServices"
  | "otherDeductible"
  | "creditCarried"
  | "credit"
  | "due";

type Ca3BoxCodes = Record<Ca3BoxKey, string>;

/**
 * The box codes printed on each edition of the 3310-CA3, keyed by the year it
 * applies from. A redesign of the form is one new entry here and a bump of
 * `CURRENT_CA3_FORM_YEAR`.
 */
const CA3_FORMS = {
  2026: {
    salesHt: "A1",
    intraCommunityPurchasesHt: "A3",
    nonEuPurchasesHt: "B4",
    taxableBase: "08",
    fixedAssets: "19",
    goodsAndServices: "20",
    otherDeductible: "21",
    creditCarried: "22",
    credit: "25",
    due: "32",
  },
} as const satisfies Record<number, Ca3BoxCodes>;

const CURRENT_CA3_FORM_YEAR = 2026;

export const CA3_BOX_CODES: Ca3BoxCodes = CA3_FORMS[CURRENT_CA3_FORM_YEAR];
