/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_InternetInputs */

const en_expense_category_internet = /** @type {(inputs: Expense_Category_InternetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Internet`)
};

const fr_expense_category_internet = /** @type {(inputs: Expense_Category_InternetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Internet`)
};

/**
* | output |
* | --- |
* | "Internet" |
*
* @param {Expense_Category_InternetInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_internet = /** @type {((inputs?: Expense_Category_InternetInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_InternetInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_internet(inputs)
	return en_expense_category_internet(inputs)
});