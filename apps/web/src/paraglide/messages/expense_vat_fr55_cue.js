/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Fr55_CueInputs */

const en_expense_vat_fr55_cue = /** @type {(inputs: Expense_Vat_Fr55_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`“TVA 5,5 %”.`)
};

const fr_expense_vat_fr55_cue = /** @type {(inputs: Expense_Vat_Fr55_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`« TVA 5,5 % ».`)
};

/**
* | output |
* | --- |
* | "“TVA 5,5 %”." |
*
* @param {Expense_Vat_Fr55_CueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_fr55_cue = /** @type {((inputs?: Expense_Vat_Fr55_CueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Fr55_CueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_fr55_cue(inputs)
	return en_expense_vat_fr55_cue(inputs)
});