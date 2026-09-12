/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_HostingInputs */

const en_expense_category_hosting = /** @type {(inputs: Expense_Category_HostingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hosting`)
};

const fr_expense_category_hosting = /** @type {(inputs: Expense_Category_HostingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hébergement`)
};

/**
* | output |
* | --- |
* | "Hosting" |
*
* @param {Expense_Category_HostingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_hosting = /** @type {((inputs?: Expense_Category_HostingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_HostingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_hosting(inputs)
	return en_expense_category_hosting(inputs)
});