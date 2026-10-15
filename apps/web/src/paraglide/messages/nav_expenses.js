/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_ExpensesInputs */

const en_nav_expenses = /** @type {(inputs: Nav_ExpensesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expenses`)
};

const fr_nav_expenses = /** @type {(inputs: Nav_ExpensesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dépenses`)
};

/**
* | output |
* | --- |
* | "Expenses" |
*
* @param {Nav_ExpensesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_expenses = /** @type {((inputs?: Nav_ExpensesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_ExpensesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_expenses(inputs)
	return en_nav_expenses(inputs)
});