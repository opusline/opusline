/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expense_Vat_Eu_CueInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("TVA 0 €, mention « autoliquidation » ou « reverse charge », et votre numéro FR…")
	return /** @type {LocalizedString} */ ("TVA 0 €, “autoliquidation” or “reverse charge”, and your FR number…")
});