/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Eu_CueInputs */

const en_expense_vat_eu_cue = /** @type {(inputs: Expense_Vat_Eu_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA 0 €, “autoliquidation” or “reverse charge”, and your FR number…`)
};

const fr_expense_vat_eu_cue = /** @type {(inputs: Expense_Vat_Eu_CueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TVA 0 €, mention « autoliquidation » ou « reverse charge », et votre numéro FR…`)
};

/**
* | output |
* | --- |
* | "TVA 0 €, “autoliquidation” or “reverse charge”, and your FR number…" |
*
* @param {Expense_Vat_Eu_CueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expense_vat_eu_cue = /** @type {((inputs?: Expense_Vat_Eu_CueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expense_Vat_Eu_CueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expense_vat_eu_cue(inputs)
	return en_expense_vat_eu_cue(inputs)
});