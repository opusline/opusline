/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ remaining: NonNullable<unknown> }} Invoices_Todo_Budget_DetailInputs */

const en_invoices_todo_budget_detail = /** @type {(inputs: Invoices_Todo_Budget_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.remaining} left at the reference TJM before the fixed price is reached`)
};

const fr_invoices_todo_budget_detail = /** @type {(inputs: Invoices_Todo_Budget_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Encore ${i?.remaining} au TJM de référence avant d'atteindre le forfait`)
};

/**
* | output |
* | --- |
* | "{remaining} left at the reference TJM before the fixed price is reached" |
*
* @param {Invoices_Todo_Budget_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_budget_detail = /** @type {((inputs: Invoices_Todo_Budget_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_Budget_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_todo_budget_detail(inputs)
	return en_invoices_todo_budget_detail(inputs)
});