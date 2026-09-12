/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Fr55_LabelInputs */

const en_expense_vat_fr55_label = /** @type {(inputs: Expense_Vat_Fr55_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FR 5,5 %`)
};

const fr_expense_vat_fr55_label = /** @type {(inputs: Expense_Vat_Fr55_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FR 5,5 %`)
};

/**
* | output |
* | --- |
* | "FR 5,5 %" |
*
* @param {Expense_Vat_Fr55_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_fr55_label = /** @type {((inputs?: Expense_Vat_Fr55_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Fr55_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_fr55_label(inputs)
	return en_expense_vat_fr55_label(inputs)
});