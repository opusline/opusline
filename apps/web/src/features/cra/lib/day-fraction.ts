/**
 * A day of work, in the basis points the API stores. Its own module because both
 * `cra-grid.ts` and `labels.ts` need it, and `cra-grid.ts` already imports from
 * `labels.ts` — putting it in either would close a cycle.
 */
export const FULL_DAY_BP = 10_000;
export const HALF_DAY_BP = 5_000;
