/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Todo_Budget_Exceeded_BadgeInputs */

const en_invoices_todo_budget_exceeded_badge = /** @type {(inputs: Invoices_Todo_Budget_Exceeded_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Over budget`)
};

const fr_invoices_todo_budget_exceeded_badge = /** @type {(inputs: Invoices_Todo_Budget_Exceeded_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Budget dépassé`)
};

/**
* | output |
* | --- |
* | "Over budget" |
*
* @param {Invoices_Todo_Budget_Exceeded_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_todo_budget_exceeded_badge = /** @type {((inputs?: Invoices_Todo_Budget_Exceeded_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Todo_Budget_Exceeded_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_todo_budget_exceeded_badge(inputs)
	return en_invoices_todo_budget_exceeded_badge(inputs)
});