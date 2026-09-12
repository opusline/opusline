/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Fr10_LabelInputs */

const en_expense_vat_fr10_label = /** @type {(inputs: Expense_Vat_Fr10_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FR 10 %`)
};

const fr_expense_vat_fr10_label = /** @type {(inputs: Expense_Vat_Fr10_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`FR 10 %`)
};

/**
* | output |
* | --- |
* | "FR 10 %" |
*
* @param {Expense_Vat_Fr10_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_fr10_label = /** @type {((inputs?: Expense_Vat_Fr10_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Fr10_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_fr10_label(inputs)
	return en_expense_vat_fr10_label(inputs)
});