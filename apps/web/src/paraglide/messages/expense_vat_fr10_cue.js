/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Fr10_CueInputs */

const en_expense_vat_fr10_cue = /** @type {(inputs: Expense_Vat_Fr10_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`“TVA 10 %”.`)
};

const fr_expense_vat_fr10_cue = /** @type {(inputs: Expense_Vat_Fr10_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`« TVA 10 % ».`)
};

/**
* | output |
* | --- |
* | "“TVA 10 %”." |
*
* @param {Expense_Vat_Fr10_CueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_fr10_cue = /** @type {((inputs?: Expense_Vat_Fr10_CueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Fr10_CueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_fr10_cue(inputs)
	return en_expense_vat_fr10_cue(inputs)
});