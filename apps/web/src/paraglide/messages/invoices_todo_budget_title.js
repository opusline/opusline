/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ mission: NonNullable<unknown>, share: NonNullable<unknown> }} Invoices_Todo_Budget_TitleInputs */

const en_invoices_todo_budget_title = /** @type {(inputs: Invoices_Todo_Budget_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.mission} · fixed price ${i?.share} % consumed`)
};

const fr_invoices_todo_budget_title = /** @type {(inputs: Invoices_Todo_Budget_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.mission} · forfait consommé à ${i?.share} %`)
};

/**
* | output |
* | --- |
* | "{mission} · fixed price {share} % consumed" |
*
* @param {Invoices_Todo_Budget_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_budget_title = /** @type {((inputs: Invoices_Todo_Budget_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_Budget_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_todo_budget_title(inputs)
	return en_invoices_todo_budget_title(inputs)
});