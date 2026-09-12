/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Fr20_CueInputs */

const en_expense_vat_fr20_cue = /** @type {(inputs: Expense_Vat_Fr20_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`“TVA 20 %” with an amount.`)
};

const fr_expense_vat_fr20_cue = /** @type {(inputs: Expense_Vat_Fr20_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`« TVA 20 % » avec un montant.`)
};

/**
* | output |
* | --- |
* | "“TVA 20 %” with an amount." |
*
* @param {Expense_Vat_Fr20_CueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_fr20_cue = /** @type {((inputs?: Expense_Vat_Fr20_CueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Fr20_CueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_fr20_cue(inputs)
	return en_expense_vat_fr20_cue(inputs)
});