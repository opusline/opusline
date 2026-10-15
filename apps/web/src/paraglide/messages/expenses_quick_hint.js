/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Quick_HintInputs */



/**
* | output |
* | --- |
* | "Type it all in one go, the fields fill themselves." |
*
* @param {Expenses_Quick_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_quick_hint = /** @type {((inputs?: Expenses_Quick_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Quick_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Tapez tout d'une traite, les champs se remplissent.")
	return /** @type {LocalizedString} */ ("Type it all in one go, the fields fill themselves.")
});