/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_MoreInputs */

const en_expense_vat_more = /** @type {(inputs: Expense_Vat_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Learn more`)
};

const fr_expense_vat_more = /** @type {(inputs: Expense_Vat_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En savoir plus`)
};

/**
* | output |
* | --- |
* | "Learn more" |
*
* @param {Expense_Vat_MoreInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_more = /** @type {((inputs?: Expense_Vat_MoreInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_MoreInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_more(inputs)
	return en_expense_vat_more(inputs)
});