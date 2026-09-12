/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_ExemptInputs */

const en_expense_vat_exempt = /** @type {(inputs: Expense_Vat_ExemptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no TVA`)
};

const fr_expense_vat_exempt = /** @type {(inputs: Expense_Vat_ExemptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`hors TVA`)
};

/**
* | output |
* | --- |
* | "no TVA" |
*
* @param {Expense_Vat_ExemptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_exempt = /** @type {((inputs?: Expense_Vat_ExemptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_ExemptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_exempt(inputs)
	return en_expense_vat_exempt(inputs)
});