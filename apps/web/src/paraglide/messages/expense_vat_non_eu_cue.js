/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Non_Eu_CueInputs */

const en_expense_vat_non_eu_cue = /** @type {(inputs: Expense_Vat_Non_Eu_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA 0 €, no French TVA mentioned.`)
};

const fr_expense_vat_non_eu_cue = /** @type {(inputs: Expense_Vat_Non_Eu_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA 0 €, aucune TVA française mentionnée.`)
};

/**
* | output |
* | --- |
* | "TVA 0 €, no French TVA mentioned." |
*
* @param {Expense_Vat_Non_Eu_CueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_non_eu_cue = /** @type {((inputs?: Expense_Vat_Non_Eu_CueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Non_Eu_CueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_non_eu_cue(inputs)
	return en_expense_vat_non_eu_cue(inputs)
});