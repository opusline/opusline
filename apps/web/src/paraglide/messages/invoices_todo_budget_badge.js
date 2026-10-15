/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Todo_Budget_BadgeInputs */

const en_invoices_todo_budget_badge = /** @type {(inputs: Invoices_Todo_Budget_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Budget`)
};

const fr_invoices_todo_budget_badge = /** @type {(inputs: Invoices_Todo_Budget_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Budget`)
};

/**
* | output |
* | --- |
* | "Budget" |
*
* @param {Invoices_Todo_Budget_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_budget_badge = /** @type {((inputs?: Invoices_Todo_Budget_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_Budget_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_todo_budget_badge(inputs)
	return en_invoices_todo_budget_badge(inputs)
});