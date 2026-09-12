/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Exempt_CueInputs */

const en_expense_vat_exempt_cue = /** @type {(inputs: Expense_Vat_Exempt_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no TVA line at all.`)
};

const fr_expense_vat_exempt_cue = /** @type {(inputs: Expense_Vat_Exempt_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucune ligne de TVA.`)
};

/**
* | output |
* | --- |
* | "no TVA line at all." |
*
* @param {Expense_Vat_Exempt_CueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_exempt_cue = /** @type {((inputs?: Expense_Vat_Exempt_CueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Exempt_CueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_exempt_cue(inputs)
	return en_expense_vat_exempt_cue(inputs)
});