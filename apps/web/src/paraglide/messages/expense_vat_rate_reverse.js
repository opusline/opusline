/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Expense_Vat_Rate_ReverseInputs */

const en_expense_vat_rate_reverse = /** @type {(inputs: Expense_Vat_Rate_ReverseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`autoliq. ${i?.rate}`)
};

const fr_expense_vat_rate_reverse = /** @type {(inputs: Expense_Vat_Rate_ReverseInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`autoliq. ${i?.rate}`)
};

/**
* | output |
* | --- |
* | "autoliq. {rate}" |
*
* @param {Expense_Vat_Rate_ReverseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_rate_reverse = /** @type {((inputs: Expense_Vat_Rate_ReverseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Rate_ReverseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_rate_reverse(inputs)
	return en_expense_vat_rate_reverse(inputs)
});