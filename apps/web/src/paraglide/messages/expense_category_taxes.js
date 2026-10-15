/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Category_TaxesInputs */

const en_expense_category_taxes = /** @type {(inputs: Expense_Category_TaxesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taxes`)
};

const fr_expense_category_taxes = /** @type {(inputs: Expense_Category_TaxesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taxes`)
};

/**
* | output |
* | --- |
* | "Taxes" |
*
* @param {Expense_Category_TaxesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_category_taxes = /** @type {((inputs?: Expense_Category_TaxesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Category_TaxesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_category_taxes(inputs)
	return en_expense_category_taxes(inputs)
});