/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Exempt_LabelInputs */

const en_expense_vat_exempt_label = /** @type {(inputs: Expense_Vat_Exempt_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No TVA`)
};

const fr_expense_vat_exempt_label = /** @type {(inputs: Expense_Vat_Exempt_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hors TVA`)
};

/**
* | output |
* | --- |
* | "No TVA" |
*
* @param {Expense_Vat_Exempt_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_exempt_label = /** @type {((inputs?: Expense_Vat_Exempt_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Exempt_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_exempt_label(inputs)
	return en_expense_vat_exempt_label(inputs)
});